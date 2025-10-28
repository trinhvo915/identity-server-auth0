"use client";

import { useSession } from "next-auth/react";
import { useEffect } from "react";

/**
 * Custom hook to manage Auth0 access token in localStorage
 * Automatically saves the token when user signs in
 * and removes it when user signs out
 */
export function useAuthToken() {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "authenticated" && session?.accessToken) {
      localStorage.setItem("access_token", session.accessToken);
    } else if (status === "unauthenticated") {
      localStorage.removeItem("access_token");
    }
  }, [session, status]);

  return {
    accessToken: session?.accessToken,
    isAuthenticated: status === "authenticated",
    isLoading: status === "loading",
  };
}
