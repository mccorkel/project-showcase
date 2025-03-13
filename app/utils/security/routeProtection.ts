import { UserRole } from './fieldAccessControl';

// Define route protection rules
export const protectedRoutes = {
  // Student routes
  '/secure/dashboard': {
    roles: [UserRole.STUDENT, UserRole.INSTRUCTOR, UserRole.ADMIN],
    redirectPath: '/access-denied'
  },
  '/secure/profile': {
    roles: [UserRole.STUDENT, UserRole.INSTRUCTOR, UserRole.ADMIN],
    redirectPath: '/access-denied'
  },
  '/secure/submissions': {
    roles: [UserRole.STUDENT, UserRole.INSTRUCTOR, UserRole.ADMIN],
    redirectPath: '/access-denied'
  },
  '/secure/showcase': {
    roles: [UserRole.STUDENT, UserRole.INSTRUCTOR, UserRole.ADMIN],
    redirectPath: '/access-denied'
  },
  '/secure/analytics': {
    roles: [UserRole.STUDENT, UserRole.INSTRUCTOR, UserRole.ADMIN],
    redirectPath: '/access-denied'
  },
  
  // Instructor routes
  '/secure/instructor/dashboard': {
    roles: [UserRole.INSTRUCTOR, UserRole.ADMIN],
    redirectPath: '/access-denied'
  },
  '/secure/instructor/cohorts': {
    roles: [UserRole.INSTRUCTOR, UserRole.ADMIN],
    redirectPath: '/access-denied'
  },
  '/secure/instructor/students': {
    roles: [UserRole.INSTRUCTOR, UserRole.ADMIN],
    redirectPath: '/access-denied'
  },
  '/secure/instructor/submissions': {
    roles: [UserRole.INSTRUCTOR, UserRole.ADMIN],
    redirectPath: '/access-denied'
  },
  '/secure/instructor/analytics': {
    roles: [UserRole.INSTRUCTOR, UserRole.ADMIN],
    redirectPath: '/access-denied'
  },
  
  // Admin routes
  '/secure/admin/dashboard': {
    roles: [UserRole.ADMIN],
    redirectPath: '/access-denied'
  },
  '/secure/admin/users': {
    roles: [UserRole.ADMIN],
    redirectPath: '/access-denied'
  },
  '/secure/admin/instructors': {
    roles: [UserRole.ADMIN],
    redirectPath: '/access-denied'
  },
  '/secure/admin/students': {
    roles: [UserRole.ADMIN],
    redirectPath: '/access-denied'
  },
  '/secure/admin/templates': {
    roles: [UserRole.ADMIN],
    redirectPath: '/access-denied'
  },
  '/secure/admin/analytics': {
    roles: [UserRole.ADMIN],
    redirectPath: '/access-denied'
  },
  '/secure/admin/audit-logs': {
    roles: [UserRole.ADMIN],
    redirectPath: '/access-denied'
  },
  '/secure/admin/delegations': {
    roles: [UserRole.ADMIN],
    redirectPath: '/access-denied'
  }
};

// Helper function to check if a route is protected
export const isProtectedRoute = (path: string): boolean => {
  // Check exact matches
  if (protectedRoutes[path]) return true;
  
  // Check for dynamic routes
  return Object.keys(protectedRoutes).some(route => {
    // Convert route pattern to regex
    // e.g., '/secure/admin/students/[id]' becomes /^\/secure\/admin\/students\/[^\/]+$/
    const pattern = route.replace(/\[\w+\]/g, '[^/]+');
    const regex = new RegExp(`^${pattern}$`);
    return regex.test(path);
  });
};

// Helper function to get required roles for a route
export const getRequiredRoles = (path: string): UserRole[] => {
  // Check exact matches
  if (protectedRoutes[path]) return protectedRoutes[path].roles;
  
  // Check for dynamic routes
  for (const route of Object.keys(protectedRoutes)) {
    // Convert route pattern to regex
    const pattern = route.replace(/\[\w+\]/g, '[^/]+');
    const regex = new RegExp(`^${pattern}$`);
    if (regex.test(path)) {
      return protectedRoutes[route].roles;
    }
  }
  
  return [];
};

// Helper function to get redirect path for a route
export const getRedirectPath = (path: string): string => {
  // Check exact matches
  if (protectedRoutes[path]) return protectedRoutes[path].redirectPath;
  
  // Check for dynamic routes
  for (const route of Object.keys(protectedRoutes)) {
    // Convert route pattern to regex
    const pattern = route.replace(/\[\w+\]/g, '[^/]+');
    const regex = new RegExp(`^${pattern}$`);
    if (regex.test(path)) {
      return protectedRoutes[route].redirectPath;
    }
  }
  
  return '/login';
}; 