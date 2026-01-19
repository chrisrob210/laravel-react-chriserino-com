import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useUser, useAuth } from '@clerk/clerk-react';
import { useAdmin } from '../hooks/useAdmin';
import AccessDenied from './common/AccessDenied';
import { getSanctumToken } from '../lib/api';

interface ProtectedRouteProps {
    children: React.ReactElement;
    requireAdmin?: boolean;
}

/**
 * ProtectedRoute component that protects routes based on authentication and admin status
 * 
 * @param children - The component to render if access is granted
 * @param requireAdmin - If true, requires user to be an admin (default: false)
 */
export default function ProtectedRoute({
    children,
    requireAdmin = false
}: ProtectedRouteProps) {
    const { isSignedIn, isLoaded } = useUser();
    const { getToken } = useAuth();
    const isAdmin = useAdmin();
    const [tokenReady, setTokenReady] = useState(false);

    // Ensure Sanctum token exists when user is signed in
    useEffect(() => {
        if (isSignedIn && isLoaded) {
            const ensureToken = async () => {
                const existingToken = localStorage.getItem('sanctum_token');
                if (!existingToken) {
                    await getSanctumToken(getToken);
                }
                setTokenReady(true);
            };
            ensureToken();
        } else if (!isSignedIn && isLoaded) {
            setTokenReady(true);
        }
    }, [isSignedIn, isLoaded, getToken]);

    // Wait for Clerk to load
    if (!isLoaded || (isSignedIn && !tokenReady)) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-lg">Loading...</div>
            </div>
        );
    }

    // If not signed in or admin required but not admin, show access denied
    if (!isSignedIn || (requireAdmin && !isAdmin)) {
        return (
            <AccessDenied showBackButton={true} />
        );
    }

    return children;
}