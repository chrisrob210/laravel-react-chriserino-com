import React from 'react';
import { Link } from 'react-router-dom';

interface AccessDeniedProps {
    message?: string;
    showBackButton?: boolean;
}

/**
 * AccessDenied component - displays an access denied message
 * Can be used for admin-only pages or other protected content
 */
export default function AccessDenied({
    message = "You need admin privileges to access this page.",
    showBackButton = true
}: AccessDeniedProps) {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-slate-100 via-slate-200 to-slate-300">
            <div className="text-center bg-white p-8 rounded-lg shadow-lg max-w-md">
                <div className="mb-4">
                    <svg
                        className="mx-auto h-16 w-16 text-red-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                        />
                    </svg>
                </div>
                <h1 className="text-3xl font-bold text-gray-800 mb-4">Access Denied</h1>
                <p className="text-gray-600 mb-6">{message}</p>
                {showBackButton && (
                    <Link
                        to="/"
                        className="inline-block px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                    >
                        Go Back Home
                    </Link>
                )}
            </div>
        </div>
    );
}