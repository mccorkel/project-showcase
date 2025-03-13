'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { fetchAuthSession, getCurrentUser } from 'aws-amplify/auth';
import { UserRole } from '@/utils/security/fieldAccessControl';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles?: UserRole[];
  redirectPath?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRoles = [],
  redirectPath = '/login',
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userRoles, setUserRoles] = useState<UserRole[]>([]);
  const [isClient, setIsClient] = useState(false);

  // This effect runs only on the client side
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    // Skip authentication check during SSR
    if (!isClient) return;

    const checkAuth = async () => {
      try {
        // Check if user is authenticated
        const authSession = await fetchAuthSession();
        const user = await getCurrentUser();
        
        setIsAuthenticated(!!authSession.tokens);
        
        // For now, we'll assume all authenticated users have the 'user' role
        // In a real application, you would fetch the user's roles from your database
        // or from custom attributes in the user's profile
        setUserRoles([UserRole.STUDENT]); // Default role
        
        setIsLoading(false);
      } catch (error) {
        console.error('Authentication error:', error);
        setIsAuthenticated(false);
        setIsLoading(false);
        router.push(`${redirectPath}?redirect=${encodeURIComponent(pathname)}`);
      }
    };

    checkAuth();
  }, [router, pathname, redirectPath, isClient]);

  // Check if user has required roles
  const hasRequiredRoles = () => {
    if (requiredRoles.length === 0) return true;
    
    // Check if the user has any of the required roles
    return requiredRoles.some(role => userRoles.includes(role));
  };

  // During SSR or when not yet loaded on client, render children without protection
  if (!isClient || isLoading) {
    return <>{children}</>;
  }

  // Client-side protection
  if (!isAuthenticated) {
    router.push(`${redirectPath}?redirect=${encodeURIComponent(pathname)}`);
    return null;
  }

  if (requiredRoles.length > 0 && !hasRequiredRoles()) {
    router.push('/access-denied');
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute; 