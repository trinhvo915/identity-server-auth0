export type UserRole = 'ADMIN' | 'USER' | 'GUEST';

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

export function getRouteConfig(pathname: string): RouteConfig | undefined {
  return PROTECTED_ROUTES.find(route =>
    pathname.startsWith(route.path)
  );
}

export function hasRequiredRole(
  userRoles: string[] | undefined,
  requiredRole: UserRole | undefined
): boolean {
  if (!requiredRole) return true;

  if (!userRoles || userRoles.length === 0) return false;

  return userRoles.includes(requiredRole);
}

export function getRedirectPath(
  isAuthenticated: boolean,
  userRoles: string[] | undefined,
  targetPath: string
): string | null {
  const routeConfig = getRouteConfig(targetPath);

  if (!routeConfig) return null;

  if (routeConfig.requiresAuth && !isAuthenticated) {
    return '/access-denied';
  }

  if (routeConfig.requiredRole && !hasRequiredRole(userRoles, routeConfig.requiredRole)) {
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
