import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { fetchAuthSession, getCurrentUser } from 'aws-amplify/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles?: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRoles = [],
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userRoles, setUserRoles] = useState<string[]>([]);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check if user is authenticated
        const authSession = await fetchAuthSession();
        const user = await getCurrentUser();
        
        setIsAuthenticated(!!authSession.tokens);
        
        // For now, we'll assume all authenticated users have the 'user' role
        // In a real application, you would fetch the user's roles from your database
        // or from custom attributes in the user's profile
        setUserRoles(['user']);
        
        setIsLoading(false);
      } catch (error) {
        console.error('Authentication error:', error);
        setIsAuthenticated(false);
        setIsLoading(false);
        router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
      }
    };

    checkAuth();
  }, [router, pathname]);

  // Check if user has required roles
  const hasRequiredRoles = () => {
    if (requiredRoles.length === 0) return true;
    
    // If 'user' role is sufficient, allow access
    if (requiredRoles.includes('user') && userRoles.includes('user')) {
      return true;
    }
    
    // For more specific roles, you would implement your custom logic here
    // This is a placeholder for your application's role-checking logic
    return false;
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
    return null;
  }

  if (requiredRoles.length > 0 && !hasRequiredRoles()) {
    router.push('/403');
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute; 