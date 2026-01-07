import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { useAdmin } from '../hooks/useAdmin';
import AccessDenied from './common/AccessDenied';

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
    const isAdmin = useAdmin();

    // Wait for Clerk to load
    if (!isLoaded) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-lg">Loading...</div>
            </div>
        );
    }

    // If not signed in, redirect to home
    // if (!isSignedIn) {
    //     return <Navigate to="/" replace />;
    // }

    // If admin is required but user is not admin, show access denied
    // if (requireAdmin && !isAdmin) {
    if (!isSignedIn || requireAdmin && !isAdmin) {
        return (
            <AccessDenied showBackButton={true} />
        );
    }

    return children;
}