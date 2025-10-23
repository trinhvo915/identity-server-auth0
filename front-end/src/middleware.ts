import {NextRequestWithAuth, withAuth} from "next-auth/middleware"
import { NextResponse } from "next/server"
import { getRedirectPath, isPublicRoute } from "@/core/utils/configs/router-config"

export default withAuth(
  function middleware(req : NextRequestWithAuth) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    // Allow access to public routes
    if (isPublicRoute(path)) {
      return NextResponse.next();
    }

    // Determine if user is authenticated and their role
    const isAuthenticated = !!token;
    const userRole = token?.role as string | undefined;

    // Check if redirect is needed based on auth state and role
    const redirectPath = getRedirectPath(isAuthenticated, userRole, path);

    if (redirectPath) {
      return NextResponse.redirect(new URL(redirectPath, req.url));
    }

    // User has access
    return NextResponse.next();
  },
  {
    callbacks: {
      // Always authorize to let middleware function handle logic
      authorized: () => true,
    },
  }
)

export const config = {
  matcher: [
    // Protect only root admin page
    '/admin',
    // Protect only root dashboard page
    '/dashboard',
    // Protect session page
    '/session',
  ]
}