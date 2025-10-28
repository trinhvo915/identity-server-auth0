export type UserRole = 'ADMIN' | 'USER' | 'GUEST';

/**
 * Route configuration for role-based access control
 */
export interface RouteConfig {
  path: string;
  requiredRole?: UserRole;
  requiresAuth?: boolean;
}

export const PROTECTED_ROUTES: RouteConfig[] = [
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
  {
    path: '/session',
    requiresAuth: true,
  },
  {
    path: '/profile',
    requiresAuth: true,
  },

  // Add more routes here as needed
  // {
  //   path: '/settings',
  //   requiredRole: 'USER',
  //   requiresAuth: true,
  // },
];

export function isProtectedRoute(pathname: string): boolean {
  return PROTECTED_ROUTES.some(route =>
    pathname.startsWith(route.path)
  );
}

export function getRouteConfig(pathname: string): RouteConfig | undefined {
  return PROTECTED_ROUTES.find(route =>
    pathname.startsWith(route.path)
  );
}

export function hasRequiredRole(
  userRole: string | undefined,
  requiredRole: UserRole | undefined
): boolean {
  // If no role required, allow access
  if (!requiredRole) return true;

  // Check if user has the required role
  return userRole === requiredRole;
}

export function getRedirectPath(
  isAuthenticated: boolean,
  userRole: string | undefined,
  targetPath: string
): string | null {
  const routeConfig = getRouteConfig(targetPath);

  if (!routeConfig) return null;

  if (routeConfig.requiresAuth && !isAuthenticated) {
    return '/access-denied';
  }

  if (routeConfig.requiredRole && !hasRequiredRole(userRole, routeConfig.requiredRole)) {
    return '/access-denied';
  }

  return null;
}

export const PUBLIC_ROUTES = [
  '/',
  '/access-denied',
  '/not-found',
  '/api/auth',
];

export function isPublicRoute(pathname: string): boolean {
  return PUBLIC_ROUTES.some(route =>
    pathname === route || pathname.startsWith(route + '/')
  );
}
