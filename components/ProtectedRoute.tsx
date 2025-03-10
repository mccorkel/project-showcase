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
        
        // Get user roles from token claims if available
        if (authSession.tokens?.idToken?.payload['cognito:groups']) {
          setUserRoles(authSession.tokens.idToken.payload['cognito:groups'] as string[]);
        }
        
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
    return requiredRoles.some(role => userRoles.includes(role));
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
    return null;
  }

  if (!hasRequiredRoles()) {
    router.push('/403');
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute; 