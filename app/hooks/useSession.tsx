import { useState, useEffect, useCallback } from 'react';
import { 
  SessionInfo, 
  LoginResult,
  getCurrentSession,
  isSessionValid,
  login as loginApi,
  logout as logoutApi,
  extendSession,
  setupSessionTimeoutMonitoring
} from '../utils/security/sessionManager';

interface UseSessionProps {
  onSessionTimeout?: () => void;
  redirectOnTimeout?: string;
  checkInterval?: number;
}

interface UseSessionReturn {
  session: SessionInfo | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<LoginResult>;
  logout: () => void;
  loading: boolean;
}

/**
 * React hook for session management
 * 
 * @param props Configuration options
 * @returns Session management functions and state
 */
export function useSession(props?: UseSessionProps): UseSessionReturn {
  const { 
    onSessionTimeout, 
    checkInterval = 60 * 1000 
  } = props || {};

  const [session, setSession] = useState<SessionInfo | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  // Function to update session state
  const updateSessionState = useCallback(() => {
    const currentSession = getCurrentSession();
    const valid = isSessionValid();
    
    setSession(currentSession);
    setIsAuthenticated(valid);
    setLoading(false);
  }, []);

  // Handle session timeout
  const handleSessionTimeout = useCallback(() => {
    updateSessionState();
    
    if (onSessionTimeout) {
      onSessionTimeout();
    }
    
    if (props?.redirectOnTimeout) {
      window.location.href = props.redirectOnTimeout;
    }
  }, [onSessionTimeout, props?.redirectOnTimeout, updateSessionState]);

  // Login function
  const login = useCallback(async (
    email: string, 
    password: string
  ): Promise<LoginResult> => {
    // Get IP address and user agent
    // In a real app, you might get the IP from an API
    const ipAddress = '127.0.0.1';
    const userAgent = navigator.userAgent;
    
    const result = await loginApi(email, password, ipAddress, userAgent);
    
    if (result.success) {
      updateSessionState();
    }
    
    return result;
  }, [updateSessionState]);

  // Logout function
  const logout = useCallback(() => {
    const ipAddress = '127.0.0.1';
    const userAgent = navigator.userAgent;
    
    logoutApi(ipAddress, userAgent);
    updateSessionState();
  }, [updateSessionState]);

  // Initialize session state
  useEffect(() => {
    updateSessionState();
  }, [updateSessionState]);

  // Set up session monitoring
  useEffect(() => {
    const cleanup = setupSessionTimeoutMonitoring(
      handleSessionTimeout,
      checkInterval
    );
    
    return cleanup;
  }, [handleSessionTimeout, checkInterval]);

  // Set up activity handler to extend session
  useEffect(() => {
    const activityHandler = () => {
      if (isAuthenticated) {
        extendSession();
      }
    };
    
    const activityEvents = ['mousedown', 'keydown', 'touchstart', 'scroll'];
    
    activityEvents.forEach(event => {
      window.addEventListener(event, activityHandler);
    });
    
    return () => {
      activityEvents.forEach(event => {
        window.removeEventListener(event, activityHandler);
      });
    };
  }, [isAuthenticated]);

  return {
    session,
    isAuthenticated,
    login,
    logout,
    loading
  };
}

export default useSession; 