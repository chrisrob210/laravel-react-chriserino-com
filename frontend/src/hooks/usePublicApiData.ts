import { useState, useEffect } from 'react';

const API_BASE_URL = process.env.REACT_APP_API_URL || '/api';

interface UsePublicApiDataReturn<T> {
    data: T | null;
    loading: boolean;
    error: Error | null;
}

/**
 * Custom hook for fetching public API data (no authentication required)
 * 
 * @param endpoint - The API endpoint URI (e.g., '/projects/portfolio', '/technologies/by-category')
 * @returns Object containing data, loading state, and error
 */
export function usePublicApiData<T = any>(
    endpoint: string
): UsePublicApiDataReturn<T> {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await fetch(`${API_BASE_URL}${endpoint}`);
                
                if (!response.ok) {
                    throw new Error(`Failed to fetch: ${response.status}`);
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
        };

        fetchData();
    }, [endpoint]);

    return {
        data,
        loading,
        error,
    };
}
