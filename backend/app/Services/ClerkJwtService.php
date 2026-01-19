<?php

namespace App\Services;

use App\Models\User;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

class ClerkJwtService
{
    /**
     * Get Clerk's JWKS (JSON Web Key Set) for JWT verification
     */
    private function getJwks(): array
    {
        $clerkInstanceId = env('CLERK_INSTANCE_ID');

        if (!$clerkInstanceId) {
            Log::error('CLERK_INSTANCE_ID not configured');
            throw new \Exception('CLERK_INSTANCE_ID not configured');
        }

        // Cache JWKS for 1 hour (they don't change often)
        return Cache::remember('clerk_jwks', 3600, function () use ($clerkInstanceId) {
            try {
                $url = "https://{$clerkInstanceId}.clerk.accounts.dev/.well-known/jwks.json";
                // Log::info('Fetching Clerk JWKS', ['url' => $url]);

                $response = Http::timeout(10)->get($url);

                if (!$response->successful()) {
                    Log::error('Failed to fetch Clerk JWKS', [
                        'status' => $response->status(),
                        'body' => $response->body(),
                    ]);
                    throw new \Exception('Failed to fetch Clerk JWKS: ' . $response->status());
                }

                $jwks = $response->json();

                if (!isset($jwks['keys']) || !is_array($jwks['keys'])) {
                    throw new \Exception('Invalid JWKS format');
                }

                return $jwks;
            } catch (\Exception $e) {
                Log::error('Error fetching JWKS: ' . $e->getMessage());
                throw $e;
            }
        });
    }

    /**
     * Get the public key for a specific key ID
     */
    private function getPublicKey(string $kid): ?string
    {
        try {
            $jwks = $this->getJwks();

            foreach ($jwks['keys'] as $key) {
                if (isset($key['kid']) && $key['kid'] === $kid) {
                    // Convert JWK to PEM format
                    return $this->jwkToPem($key);
                }
            }

            Log::warning('Key ID not found in JWKS', ['kid' => $kid, 'available_kids' => array_column($jwks['keys'], 'kid')]);
            return null;
        } catch (\Exception $e) {
            Log::error('Error getting public key: ' . $e->getMessage());
            return null;
        }
    }

    /**
     * Convert JWK to PEM format using OpenSSL
     */
    private function jwkToPem(array $jwk): string
    {
        // Decode base64url encoded modulus and exponent
        $n = $this->base64UrlDecode($jwk['n']);
        $e = $this->base64UrlDecode($jwk['e']);

        // Create RSA public key structure
        $publicKey = [
            'n' => $n,
            'e' => $e,
        ];

        // Build the RSA public key in DER format
        $der = $this->buildRsaPublicKeyDer($publicKey);

        // Convert DER to PEM
        $pem = "-----BEGIN PUBLIC KEY-----\n";
        $pem .= chunk_split(base64_encode($der), 64, "\n");
        $pem .= "-----END PUBLIC KEY-----\n";

        return $pem;
    }

    /**
     * Decode base64url encoded string
     */
    private function base64UrlDecode(string $data): string
    {
        return base64_decode(strtr($data, '-_', '+/'));
    }

    /**
     * Build RSA public key in DER format
     */
    private function buildRsaPublicKeyDer(array $key): string
    {
        // ASN.1 encoding for RSA public key
        // SEQUENCE {
        //   SEQUENCE {
        //     OBJECT IDENTIFIER rsaEncryption (1 2 840 113549 1 1 1)
        //     NULL
        //   }
        //   BIT STRING {
        //     SEQUENCE {
        //       INTEGER n
        //       INTEGER e
        //     }
        //   }
        // }

        $modulus = $key['n'];
        $exponent = $key['e'];

        // Encode modulus (INTEGER)
        $modulusDer = $this->encodeInteger($modulus);

        // Encode exponent (INTEGER)
        $exponentDer = $this->encodeInteger($exponent);

        // Encode RSA public key sequence
        $rsaSequence = $this->encodeSequence($modulusDer . $exponentDer);

        // Encode algorithm identifier sequence
        $algorithmOid = "\x06\x09\x2a\x86\x48\x86\xf7\x0d\x01\x01\x01"; // rsaEncryption OID
        $algorithmNull = "\x05\x00"; // NULL
        $algorithmSequence = $this->encodeSequence($algorithmOid . $algorithmNull);

        // Encode bit string containing RSA sequence
        $bitString = "\x03" . $this->encodeLength(strlen($rsaSequence) + 1) . "\x00" . $rsaSequence;

        // Final sequence
        $publicKeyInfo = $this->encodeSequence($algorithmSequence . $bitString);

        return $publicKeyInfo;
    }

    /**
     * Encode ASN.1 INTEGER
     */
    private function encodeInteger(string $value): string
    {
        // Remove leading zeros, but keep at least one byte
        $value = ltrim($value, "\x00");
        if ($value === '') {
            $value = "\x00";
        }

        // If the first byte has the high bit set, prepend a zero byte
        if (ord($value[0]) & 0x80) {
            $value = "\x00" . $value;
        }

        return "\x02" . $this->encodeLength(strlen($value)) . $value;
    }

    /**
     * Encode ASN.1 SEQUENCE
     */
    private function encodeSequence(string $data): string
    {
        return "\x30" . $this->encodeLength(strlen($data)) . $data;
    }

    /**
     * Encode ASN.1 length
     */
    private function encodeLength(int $length): string
    {
        if ($length < 0x80) {
            return chr($length);
        }

        $bytes = '';
        while ($length > 0) {
            $bytes = chr($length & 0xff) . $bytes;
            $length >>= 8;
        }

        return chr(0x80 | strlen($bytes)) . $bytes;
    }

    /**
     * Verify Clerk JWT token and return decoded payload
     *
     * @param string $token The Clerk JWT token
     * @return array|null Decoded JWT payload or null if invalid
     */
    public function verifyToken(string $token): ?array
    {
        try {
            // Decode header to get key ID
            $tks = explode('.', $token);
            if (count($tks) !== 3) {
                Log::warning('Invalid JWT format: wrong number of parts');
                return null;
            }

            $header = json_decode($this->base64UrlDecode($tks[0]), true);
            if (!$header || !isset($header['kid'])) {
                Log::warning('Invalid JWT header or missing kid');
                return null;
            }

            // Get public key for this key ID
            $publicKey = $this->getPublicKey($header['kid']);
            if (!$publicKey) {
                Log::warning('Public key not found for kid: ' . $header['kid']);
                return null;
            }

            // Verify and decode JWT using Firebase JWT library
            $decoded = JWT::decode($token, new Key($publicKey, 'RS256'));

            return (array) $decoded;
        } catch (\Firebase\JWT\ExpiredException $e) {
            Log::warning('Clerk JWT expired: ' . $e->getMessage());
            return null;
        } catch (\Firebase\JWT\SignatureInvalidException $e) {
            Log::warning('Clerk JWT signature invalid: ' . $e->getMessage());
            return null;
        } catch (\Exception $e) {
            Log::warning('Clerk JWT verification failed: ' . $e->getMessage());
            return null;
        }
    }

    /**
     * Alternative: Verify using Clerk's API (simpler, but requires API call)
     * Use this if JWT verification is too complex
     */
    public function verifyTokenViaApi(string $token): ?array
    {
        $clerkSecretKey = env('CLERK_SECRET_KEY');

        if (!$clerkSecretKey) {
            return null;
        }

        try {
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $clerkSecretKey,
            ])->post('https://api.clerk.com/v1/tokens/verify', [
                'token' => $token,
            ]);

            if ($response->successful()) {
                return $response->json();
            }

            return null;
        } catch (\Exception $e) {
            Log::warning('Clerk API verification failed: ' . $e->getMessage());
            return null;
        }
    }
}
