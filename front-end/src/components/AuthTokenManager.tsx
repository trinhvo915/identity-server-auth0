"use client";

import { useAuthToken } from "@/hooks/useAuthToken";

/**
 * Component that manages Auth0 access token in localStorage
 * This component should be placed in the root layout to work across all pages
 * It automatically syncs the access token with localStorage whenever session changes
 */
export function AuthTokenManager() {
  useAuthToken();

  // This component doesn't render anything
  return null;
}
