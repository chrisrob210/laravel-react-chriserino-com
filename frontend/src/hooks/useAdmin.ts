import { useUser } from '@clerk/clerk-react';

/**
 * Custom hook to check if the current user is an admin
 * Admin status is stored in Clerk's public metadata
 * Set via Clerk Dashboard: Users > [User] > Metadata > Public metadata
 * Add: { "role": "admin" } or { "isAdmin": true }
 * 
 * @returns {boolean} true if user is an admin, false otherwise
 */
export function useAdmin(): boolean {
    const { user } = useUser();

    if (!user) {
        return false;
    }

    // Check if user has admin role in public metadata
    const isAdmin = user.publicMetadata?.role === 'admin';

    return isAdmin;
}