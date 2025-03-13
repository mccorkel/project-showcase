import React, { useEffect, useState } from 'react';
import { 
  useHttpsEnforcement, 
  isHttps, 
  HttpsEnforcementConfig, 
  DEFAULT_HTTPS_CONFIG 
} from '../../utils/security/httpsEnforcement';

/**
 * Props for the HttpsEnforcement component
 */
interface HttpsEnforcementProps {
  /**
   * HTTPS enforcement configuration
   */
  config?: HttpsEnforcementConfig;
  
  /**
   * Whether to show a warning for non-HTTPS connections
   */
  showWarning?: boolean;
  
  /**
   * Custom warning component
   */
  warningComponent?: React.ReactNode;
  
  /**
   * Children elements
   */
  children: React.ReactNode;
}

/**
 * Default warning component for non-HTTPS connections
 */
const DefaultWarning: React.FC = () => (
  <div 
    style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      backgroundColor: '#f8d7da',
      color: '#721c24',
      padding: '10px 20px',
      textAlign: 'center',
      zIndex: 9999,
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
    }}
  >
    <strong>Warning:</strong> You are viewing this page over an insecure connection. 
    Your data may be at risk. Please switch to HTTPS for a secure experience.
  </div>
);

/**
 * Component that enforces HTTPS for the application
 */
export const HttpsEnforcement: React.FC<HttpsEnforcementProps> = ({ 
  config = DEFAULT_HTTPS_CONFIG,
  showWarning = true,
  warningComponent,
  children 
}) => {
  // Use HTTPS enforcement hook
  useHttpsEnforcement(config);
  
  // Check if current environment is HTTPS
  const [isSecure, setIsSecure] = useState<boolean>(true);
  
  useEffect(() => {
    // Only check in browser environment
    if (typeof window !== 'undefined') {
      setIsSecure(isHttps());
    }
  }, []);
  
  // Show warning for non-HTTPS connections if enabled
  const showHttpsWarning = !isSecure && showWarning && config.enabled;
  
  return (
    <>
      {showHttpsWarning && (
        warningComponent || <DefaultWarning />
      )}
      {children}
    </>
  );
};

/**
 * Props for the HttpsRedirect component
 */
interface HttpsRedirectProps {
  /**
   * HTTPS enforcement configuration
   */
  config?: HttpsEnforcementConfig;
}

/**
 * Component that redirects to HTTPS
 */
export const HttpsRedirect: React.FC<HttpsRedirectProps> = ({ 
  config = DEFAULT_HTTPS_CONFIG 
}) => {
  // Use HTTPS enforcement hook
  useHttpsEnforcement(config);
  
  return null;
};

/**
 * Hook to check if the current connection is secure
 * 
 * @returns Whether the current connection is secure
 */
export const useIsSecureConnection = (): boolean => {
  const [isSecure, setIsSecure] = useState<boolean>(true);
  
  useEffect(() => {
    // Only check in browser environment
    if (typeof window !== 'undefined') {
      setIsSecure(isHttps());
    }
  }, []);
  
  return isSecure;
};

/**
 * Example usage:
 * 
 * // Wrap your app with the HttpsEnforcement component
 * <HttpsEnforcement>
 *   <App />
 * </HttpsEnforcement>
 * 
 * // Use the HttpsRedirect component for simple redirects
 * <HttpsRedirect />
 * 
 * // Use the useIsSecureConnection hook to check if the connection is secure
 * const MyComponent = () => {
 *   const isSecure = useIsSecureConnection();
 *   
 *   return (
 *     <div>
 *       {isSecure ? 'Secure connection' : 'Insecure connection'}
 *     </div>
 *   );
 * };
 */ 