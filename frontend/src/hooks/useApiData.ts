import { useState, useEffect, useCallback, useRef } from 'react';
import { useApi } from '../lib/api';

interface UseApiDataOptions {
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
    body?: any;
    headers?: Record<string, string>;
    autoFetch?: boolean; // Whether to fetch automatically on mount
}

interface UseApiDataReturn<T> {
    data: T | null;
    loading: boolean;
    error: Error | null;
    refetch: () => Promise<void>;
}

/**
 * Custom hook for fetching protected API data
 * 
 * @param endpoint - The API endpoint URI (e.g., '/projects', '/auth/me')
 * @param options - Optional request options (method, body, headers, autoFetch)
 * @returns Object containing data, loading state, error, and refetch function
 */
export function useApiData<T = any>(
    endpoint: string,
    options: UseApiDataOptions = {}
): UseApiDataReturn<T> {
    const { apiRequest } = useApi();
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(options.autoFetch !== false); // Default to true
    const [error, setError] = useState<Error | null>(null);

    // Store options in a ref to avoid recreating fetchData when options object reference changes
    const optionsRef = useRef(options);
    optionsRef.current = options;

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const currentOptions = optionsRef.current;
            const requestOptions: RequestInit = {
                method: currentOptions.method || 'GET',
                headers: currentOptions.headers,
            };

            if (currentOptions.body && (currentOptions.method === 'POST' || currentOptions.method === 'PUT' || currentOptions.method === 'PATCH')) {
                requestOptions.body = JSON.stringify(currentOptions.body);
            }

            const response = await apiRequest(endpoint, requestOptions);

            if (!response.ok) {
                if (response.status === 401) {
                    throw new Error('Unauthorized - token may be invalid');
                } else if (response.status === 404) {
                    throw new Error('Resource not found');
                } else {
                    throw new Error(`API request failed: ${response.status} ${response.statusText}`);
                }
            }

            const responseData = await response.json();
            setData(responseData);
        } catch (err) {
            const error = err instanceof Error ? err : new Error('Unknown error occurred');
            setError(error);
            console.error(`Error fetching ${endpoint}:`, error);
        } finally {
            setLoading(false);
        }
    }, [endpoint, apiRequest]);

    useEffect(() => {
        if (options.autoFetch !== false) {
            fetchData();
        }
    }, [endpoint, options.autoFetch, fetchData]);

    return {
        data,
        loading,
        error,
        refetch: fetchData,
    };
}