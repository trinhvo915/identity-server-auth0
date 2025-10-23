"use client";

import { signOut } from "next-auth/react";
import { clearAuthData } from "@/core/utils/helper/logout-cleanup.utils";

/**
 * Custom hook for handling complete logout
 * Includes localStorage cleanup and Auth0 SSO session clearing
 */
export function useLogout() {
  const logout = async () => {
    try {
      // Step 1: Clear localStorage data
      clearAuthData();

      // Step 2: Build Auth0 logout URL
      const auth0Domain = 'identity-security.us.auth0.com';
      const clientId = 'fCWjalwOFRVemMufo3k2iUH3q4j0358G';
      const returnTo = window.location.origin;

      const auth0LogoutUrl = `https://${auth0Domain}/v2/logout?client_id=${clientId}&returnTo=${encodeURIComponent(returnTo)}`;

      // Step 3: Sign out from NextAuth (clears cookies)
      // Don't redirect automatically - we'll redirect to Auth0 logout
      await signOut({ redirect: false });

      // Step 4: Redirect to Auth0 to clear SSO session
      // This is crucial - without this, Auth0 will auto-login next time
      window.location.href = auth0LogoutUrl;
    } catch (error) {
      console.error('Logout error:', error);
      // Fallback: redirect to home
      window.location.href = '/';
    }
  };

  return { logout };
}
