import React, { useEffect, useRef } from 'react';
import { 
  getCSRFToken, 
  addCSRFTokenToForm, 
  refreshCSRFToken 
} from '../../utils/security/csrfProtection';

/**
 * Props for the CSRFForm component
 */
interface CSRFFormProps extends React.FormHTMLAttributes<HTMLFormElement> {
  /**
   * Children elements
   */
  children: React.ReactNode;
}

/**
 * A form component that automatically adds CSRF protection
 */
export const CSRFForm: React.FC<CSRFFormProps> = ({ 
  children, 
  onSubmit,
  ...props 
}) => {
  const formRef = useRef<HTMLFormElement>(null);

  // Add CSRF token to the form when it mounts
  useEffect(() => {
    if (formRef.current) {
      addCSRFTokenToForm(formRef.current);
    }
  }, []);

  // Handle form submission
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    // Refresh the CSRF token on form submission
    refreshCSRFToken();
    
    // Call the original onSubmit handler if provided
    if (onSubmit) {
      onSubmit(event);
    }
  };

  return (
    <form {...props} ref={formRef} onSubmit={handleSubmit}>
      {children}
    </form>
  );
};

/**
 * Props for the CSRFInput component
 */
interface CSRFInputProps {
  /**
   * Additional CSS class names
   */
  className?: string;
}

/**
 * A hidden input component that contains a CSRF token
 */
export const CSRFInput: React.FC<CSRFInputProps> = ({ className }) => {
  const [token, setToken] = React.useState<string>('');

  // Get the CSRF token when the component mounts
  useEffect(() => {
    setToken(getCSRFToken());
  }, []);

  return (
    <input 
      type="hidden" 
      name="X-CSRF-Token" 
      value={token} 
      className={className} 
    />
  );
};

/**
 * Props for the CSRFProvider component
 */
interface CSRFProviderProps {
  /**
   * Children elements
   */
  children: React.ReactNode;
  
  /**
   * Refresh interval in milliseconds (default: 30 minutes)
   */
  refreshInterval?: number;
}

/**
 * A provider component that refreshes the CSRF token periodically
 */
export const CSRFProvider: React.FC<CSRFProviderProps> = ({ 
  children, 
  refreshInterval = 30 * 60 * 1000 // 30 minutes
}) => {
  // Refresh the CSRF token periodically
  useEffect(() => {
    // Refresh immediately on mount
    refreshCSRFToken();
    
    // Set up interval to refresh token
    const intervalId = setInterval(() => {
      refreshCSRFToken();
    }, refreshInterval);
    
    // Clean up interval on unmount
    return () => {
      clearInterval(intervalId);
    };
  }, [refreshInterval]);

  return <>{children}</>;
};

/**
 * Hook to get the current CSRF token
 * 
 * @returns The current CSRF token
 */
export const useCSRFToken = (): string => {
  const [token, setToken] = React.useState<string>(getCSRFToken());

  // Refresh the token when the component mounts
  useEffect(() => {
    setToken(getCSRFToken());
  }, []);

  return token;
};

/**
 * Example usage:
 * 
 * // Wrap your app with the CSRFProvider
 * <CSRFProvider>
 *   <App />
 * </CSRFProvider>
 * 
 * // Use the CSRFForm component for forms
 * <CSRFForm onSubmit={handleSubmit}>
 *   <input type="text" name="username" />
 *   <button type="submit">Submit</button>
 * </CSRFForm>
 * 
 * // Or use the CSRFInput component in your own forms
 * <form onSubmit={handleSubmit}>
 *   <CSRFInput />
 *   <input type="text" name="username" />
 *   <button type="submit">Submit</button>
 * </form>
 * 
 * // Use the useCSRFToken hook in your components
 * const MyComponent = () => {
 *   const csrfToken = useCSRFToken();
 *   
 *   const handleApiCall = async () => {
 *     await fetch('/api/data', {
 *       method: 'POST',
 *       headers: {
 *         'Content-Type': 'application/json',
 *         'X-CSRF-Token': csrfToken
 *       },
 *       body: JSON.stringify({ data: 'example' })
 *     });
 *   };
 *   
 *   return (
 *     <button onClick={handleApiCall}>Call API</button>
 *   );
 * };
 */ 