import { useAuth } from '@clerk/clerk-react';
import { useCallback } from 'react';

const API_BASE_URL = process.env.REACT_APP_API_URL || '/api';

// Get Sanctum token from Clerk session
// This is a regular function that accepts getToken as a parameter
export async function getSanctumToken(getToken: () => Promise<string | null>): Promise<string | null> {
    try {
        const clerkToken = await getToken();

        if (!clerkToken) {
            return null;
        }

        const response = await fetch(`${API_BASE_URL}/auth/clerk-login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                clerk_token: clerkToken,
            }),
        });

        if (!response.ok) {
            throw new Error('Failed to get Sanctum token');
        }

        const data = await response.json();

        // Store token
        localStorage.setItem('sanctum_token', data.token);

        return data.token;
    } catch (error) {
        console.error('Error getting Sanctum token:', error);
        return null;
    }
}

// Make authenticated API request
// This is a regular function that accepts getToken as an optional parameter
export async function apiRequest(
    endpoint: string,
    options: RequestInit = {},
    getToken?: () => Promise<string | null>
): Promise<Response> {
    let token = localStorage.getItem('sanctum_token');

    // If no token and getToken provided, try to get one
    if (!token && getToken) {
        token = await getSanctumToken(getToken);
    }

    const headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
    });

    // If unauthorized, try refreshing token once
    if (response.status === 401 && getToken) {
        localStorage.removeItem('sanctum_token');
        const newToken = await getSanctumToken(getToken);

        if (newToken) {
            return apiRequest(endpoint, {
                ...options,
                headers: {
                    ...headers,
                    Authorization: `Bearer ${newToken}`,
                },
            }, getToken);
        }
    }

    return response;
}

// Custom hook - calls useAuth() here (hooks can be called in hooks!)
export function useApi() {
    const { getToken } = useAuth(); // ✅ Hook called at top level of custom hook

    // Memoize apiRequest to prevent it from changing on every render
    const apiRequestMemo = useCallback(
        (endpoint: string, options?: RequestInit) => {
            return apiRequest(endpoint, options, getToken);
        },
        [getToken]
    );

    const getSanctumTokenMemo = useCallback(
        () => getSanctumToken(getToken),
        [getToken]
    );

    return {
        apiRequest: apiRequestMemo,
        getSanctumToken: getSanctumTokenMemo,
    };
}

// Usage example
export async function getProjects(getToken?: () => Promise<string | null>) {
    const response = await apiRequest('/projects', {}, getToken);
    return response.json();
}