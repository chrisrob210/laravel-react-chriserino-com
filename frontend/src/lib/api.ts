// lib/api.ts or similar
import { useAuth } from '@clerk/clerk-react';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

// Get Sanctum token from Clerk session
export async function getSanctumToken(): Promise<string | null> {
    const { getToken } = useAuth();

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
export async function apiRequest(
    endpoint: string,
    options: RequestInit = {}
): Promise<Response> {
    let token = localStorage.getItem('sanctum_token');

    // If no token, try to get one
    if (!token) {
        token = await getSanctumToken();
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
    if (response.status === 401 && token) {
        localStorage.removeItem('sanctum_token');
        const newToken = await getSanctumToken();

        if (newToken) {
            return apiRequest(endpoint, {
                ...options,
                headers: {
                    ...headers,
                    Authorization: `Bearer ${newToken}`,
                },
            });
        }
    }

    return response;
}

// Usage example
export async function getProjects() {
    const response = await apiRequest('/projects');
    return response.json();
}