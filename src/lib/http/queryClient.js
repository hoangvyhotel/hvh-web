import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60000,
      gcTime: 10 * 60000,
      refetchOnWindowFocus: false,
      retry: (failureCount, error) => {
        const status = error?.response?.status ?? 0;
        if (status >= 400 && status < 500 && status !== 429) return false;
        return failureCount < 2;
      }
    },
    mutations: {
      retry: 0
    }
  }
});
