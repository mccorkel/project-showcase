import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import useSession from '../hooks/useSession';
import { UserRole } from '../utils/security/fieldAccessControl';

interface ProtectedRouteProps {
  /**
   * The component to render if the user is authenticated
   */
  children: React.ReactNode;
  
  /**
   * The path to redirect to if the user is not authenticated
   * Default: '/login'
   */
  redirectPath?: string;
  
  /**
   * Required user roles to access this route
   * If not provided, any authenticated user can access the route
   */
  requiredRoles?: UserRole[];
}

/**
 * Protected Route Component
 * 
 * This component protects routes that require authentication.
 * It redirects unauthenticated users to the login page.
 * It can also restrict access based on user roles.
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  redirectPath = '/login',
  requiredRoles
}) => {
  const location = useLocation();
  const { isAuthenticated, session, loading } = useSession({
    redirectOnTimeout: redirectPath
  });
  
  // Store the current location in session storage for redirect after login
  useEffect(() => {
    if (!isAuthenticated && !loading) {
      sessionStorage.setItem('redirectAfterLogin', location.pathname);
    }
  }, [isAuthenticated, loading, location.pathname]);
  
  // Show loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  // Redirect if not authenticated
  if (!isAuthenticated) {
    return <Navigate to={redirectPath} replace />;
  }
  
  // Check role-based access if required
  if (requiredRoles && requiredRoles.length > 0 && session) {
    const userRole = session.userRole as UserRole;
    const hasRequiredRole = requiredRoles.includes(userRole);
    
    if (!hasRequiredRole) {
      // Redirect to unauthorized page if user doesn't have required role
      return <Navigate to="/unauthorized" replace />;
    }
  }
  
  // Render the protected component
  return <>{children}</>;
};

export default ProtectedRoute; 