"use client";

import {
  QueryClient,
  QueryClientProvider,
  QueryCache,
  MutationCache,
} from "@tanstack/react-query";
import { useState, type ReactNode } from "react";
import { ApiError } from "./errors";

/**
 * Handles 401 errors globally — redirects to /login.
 * Uses a flag to prevent multiple simultaneous redirects.
 */
let isRedirecting = false;

function handleGlobalError(error: Error) {
  if (
    error instanceof ApiError &&
    error.status === 401 &&
    !isRedirecting &&
    typeof window !== "undefined"
  ) {
    isRedirecting = true;
    window.location.href = "/login";
  }
}

export function QueryProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        queryCache: new QueryCache({
          onError: handleGlobalError,
        }),
        mutationCache: new MutationCache({
          onError: handleGlobalError,
        }),
        defaultOptions: {
          queries: {
            // Re-fetch in background every 5s (replaces setInterval polling)
            refetchInterval: 5000,
            // Don't show loading spinner on background refetches
            refetchIntervalInBackground: false,
            // Keep previous data while fetching fresh data
            placeholderData: (prev: unknown) => prev,
            // Don't retry on 401 errors (they won't resolve by retrying)
            retry: (failureCount, error) => {
              if (error instanceof ApiError && error.status === 401) return false;
              return failureCount < 1;
            },
            // 10 second stale time before refetch
            staleTime: 10_000,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
