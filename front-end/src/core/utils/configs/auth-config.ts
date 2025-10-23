/**
 * Authentication and Authorization Configuration
 *
 * This file contains reusable utilities for protecting routes
 * and managing access control across the application.
 */

export type UserRole = 'ADMIN' | 'USER' | 'GUEST';

/**
 * Route configuration for role-based access control
 */
export interface RouteConfig {
  path: string;
  requiredRole?: UserRole;
  requiresAuth?: boolean;
}

/**
 * Define protected routes and their required roles
 *
 * Usage:
 * - If requiresAuth is true but no requiredRole, any authenticated user can access
 * - If requiredRole is specified, only users with that role can access
 * - Routes not listed here are public
 */
export const PROTECTED_ROUTES: RouteConfig[] = [
  // Admin routes - require ADMIN role
  {
    path: '/admin',
    requiredRole: 'ADMIN',
    requiresAuth: true,
  },
  {
    path: '/dashboard',
    requiredRole: 'ADMIN',
    requiresAuth: true,
  },

  // Authenticated routes - any logged-in user
  {
    path: '/session',
    requiresAuth: true,
  },

  // Add more routes here as needed
  // {
  //   path: '/profile',
  //   requiresAuth: true,
  // },
  // {
  //   path: '/settings',
  //   requiredRole: 'USER',
  //   requiresAuth: true,
  // },
];

/**
 * Check if a path matches a protected route
 */
export function isProtectedRoute(pathname: string): boolean {
  return PROTECTED_ROUTES.some(route =>
    pathname.startsWith(route.path)
  );
}

/**
 * Get route configuration for a given path
 */
export function getRouteConfig(pathname: string): RouteConfig | undefined {
  return PROTECTED_ROUTES.find(route =>
    pathname.startsWith(route.path)
  );
}

/**
 * Check if user has required role for a route
 */
export function hasRequiredRole(
  userRole: string | undefined,
  requiredRole: UserRole | undefined
): boolean {
  // If no role required, allow access
  if (!requiredRole) return true;

  // Check if user has the required role
  return userRole === requiredRole;
}

/**
 * Determine redirect destination based on authentication state and role
 */
export function getRedirectPath(
  isAuthenticated: boolean,
  userRole: string | undefined,
  targetPath: string
): string | null {
  const routeConfig = getRouteConfig(targetPath);

  // If route is not protected, allow access
  if (!routeConfig) return null;

  // If route requires authentication but user is not authenticated
  if (routeConfig.requiresAuth && !isAuthenticated) {
    return '/access-denied';
  }

  // If route requires specific role
  if (routeConfig.requiredRole && !hasRequiredRole(userRole, routeConfig.requiredRole)) {
    return '/access-denied';
  }

  // User has access
  return null;
}

/**
 * Public routes that should never be protected
 */
export const PUBLIC_ROUTES = [
  '/',
  '/access-denied',
  '/not-found',
  '/api/auth',
];

/**
 * Check if a path is a public route
 */
export function isPublicRoute(pathname: string): boolean {
  return PUBLIC_ROUTES.some(route =>
    pathname === route || pathname.startsWith(route + '/')
  );
}
