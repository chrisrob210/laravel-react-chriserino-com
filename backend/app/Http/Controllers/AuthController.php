<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Services\ClerkJwtService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class AuthController extends Controller
{
    public function __construct(
        private ClerkJwtService $clerkService
    ) {}

    /**
     * Exchange Clerk JWT for Sanctum token
     *
     * POST /api/auth/clerk-login
     * Body: { "clerk_token": "eyJ..." }
     */
    public function clerkLogin(Request $request)
    {
        $request->validate([
            'clerk_token' => 'required|string',
        ]);

        $clerkToken = $request->input('clerk_token');

        // Verify Clerk token
        $clerkUser = $this->clerkService->verifyToken($clerkToken);

        if (!$clerkUser) {
            return response()->json([
                'error' => 'Invalid or expired Clerk token'
            ], 401);
        }

        // Extract user info from Clerk token
        $clerkId = $clerkUser['sub'] ?? $clerkUser['id'] ?? null;
        $email = $clerkUser['email'] ?? $clerkUser['email_addresses'][0]['email_address'] ?? null;
        $firstName = $clerkUser['first_name'] ?? $clerkUser['given_name'] ?? '';
        $lastName = $clerkUser['last_name'] ?? $clerkUser['family_name'] ?? '';
        $name = trim(($clerkUser['name'] ?? "$firstName $lastName")) ?: 'User';

        if (!$clerkId) {
            Log::error('Clerk token missing user ID', ['token_data' => $clerkUser]);
            return response()->json([
                'error' => 'Invalid token format'
            ], 401);
        }

        // Find or create user
        $user = User::firstOrCreate(
            ['clerk_id' => $clerkId],
            [
                'name' => $name,
                'email' => $email ?? "{$clerkId}@clerk.user",
                'password' => bcrypt(str()->random(64)), // Random password, Clerk handles auth
                'email_verified_at' => $email ? now() : null,
            ]
        );

        // Update user info if it changed
        $updated = false;
        if ($user->name !== $name) {
            $user->name = $name;
            $updated = true;
        }
        if ($email && $user->email !== $email) {
            $user->email = $email;
            $user->email_verified_at = now();
            $updated = true;
        }
        if ($updated) {
            $user->save();
        }

        // Create Sanctum token
        $token = $user->createToken('auth-token', ['*'])->plainTextToken;

        return response()->json([
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'clerk_id' => $user->clerk_id,
            ],
            'token' => $token,
        ]);
    }

    /**
     * Revoke current Sanctum token (logout)
     *
     * POST /api/auth/logout
     */
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Logged out successfully'
        ]);
    }

    /**
     * Get current authenticated user
     *
     * GET /api/auth/me
     */
    public function me(Request $request)
    {
        return response()->json([
            'user' => $request->user(),
        ]);
    }
}
