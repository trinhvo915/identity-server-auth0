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
      // Save access token to localStorage
      localStorage.setItem("access_token", session.accessToken);
      console.log("Access token saved to localStorage");
    } else if (status === "unauthenticated") {
      // Remove access token from localStorage when user is not authenticated
      localStorage.removeItem("access_token");
      console.log("Access token removed from localStorage");
    }
  }, [session, status]);

  return {
    accessToken: session?.accessToken,
    isAuthenticated: status === "authenticated",
    isLoading: status === "loading",
  };
}
