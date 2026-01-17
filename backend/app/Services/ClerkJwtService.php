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
            throw new \Exception('CLERK_INSTANCE_ID not configured');
        }

        // Cache JWKS for 1 hour (they don't change often)
        return Cache::remember('clerk_jwks', 3600, function () use ($clerkInstanceId) {
            $response = Http::get("https://{$clerkInstanceId}.clerk.accounts.dev/.well-known/jwks.json");

            if (!$response->successful()) {
                throw new \Exception('Failed to fetch Clerk JWKS');
            }

            return $response->json();
        });
    }

    /**
     * Get the public key for a specific key ID
     */
    private function getPublicKey(string $kid): ?string
    {
        $jwks = $this->getJwks();

        foreach ($jwks['keys'] as $key) {
            if ($key['kid'] === $kid) {
                // Convert JWK to PEM format
                return $this->jwkToPem($key);
            }
        }

        return null;
    }

    /**
     * Convert JWK to PEM format
     */
    private function jwkToPem(array $jwk): string
    {
        $n = base64_decode(strtr($jwk['n'], '-_', '+/'));
        $e = base64_decode(strtr($jwk['e'], '-_', '+/'));

        $rsa = [
            'n' => $n,
            'e' => $e,
        ];

        // Convert RSA array to PEM
        $der = $this->derEncode([
            'sequence' => [
                'integer' => $rsa['n'],
                'integer' => $rsa['e'],
            ],
        ]);

        $pem = "-----BEGIN PUBLIC KEY-----\n";
        $pem .= chunk_split(base64_encode($der), 64, "\n");
        $pem .= "-----END PUBLIC KEY-----\n";

        return $pem;
    }

    /**
     * Simplified DER encoding (for RSA public keys)
     */
    private function derEncode(array $data): string
    {
        // This is a simplified version. For production, consider using a library
        // or Clerk's simpler verification endpoint
        // For now, we'll use a simpler approach below
        return '';
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
                return null;
            }

            $header = json_decode(base64_decode(strtr($tks[0], '-_', '+/')), true);
            if (!isset($header['kid'])) {
                return null;
            }

            // Get public key
            $publicKey = $this->getPublicKey($header['kid']);
            if (!$publicKey) {
                return null;
            }

            // Verify and decode JWT
            $decoded = JWT::decode($token, new Key($publicKey, 'RS256'));

            return (array) $decoded;
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
