/**
 * CSRF Protection Utility
 * 
 * This utility provides functions to help protect against Cross-Site Request Forgery (CSRF) attacks.
 * It generates, validates, and manages CSRF tokens for form submissions and API requests.
 */

import { v4 as uuidv4 } from 'uuid';

// Constants
const CSRF_TOKEN_KEY = 'csrf_token';
const CSRF_TOKEN_HEADER = 'X-CSRF-Token';
const CSRF_TOKEN_EXPIRY = 4 * 60 * 60 * 1000; // 4 hours in milliseconds

/**
 * CSRF token with expiration
 */
interface CSRFToken {
  token: string;
  expiresAt: number;
}

/**
 * Generate a new CSRF token
 * 
 * @returns The generated token
 */
export function generateCSRFToken(): string {
  // Generate a random token using UUID
  const token = uuidv4();
  
  // Store the token with expiration
  const expiresAt = Date.now() + CSRF_TOKEN_EXPIRY;
  const tokenData: CSRFToken = { token, expiresAt };
  
  // Store in localStorage
  localStorage.setItem(CSRF_TOKEN_KEY, JSON.stringify(tokenData));
  
  return token;
}

/**
 * Get the current CSRF token, generating a new one if needed
 * 
 * @returns The current CSRF token
 */
export function getCSRFToken(): string {
  // Try to get the existing token
  const storedToken = localStorage.getItem(CSRF_TOKEN_KEY);
  
  if (storedToken) {
    try {
      const tokenData: CSRFToken = JSON.parse(storedToken);
      
      // Check if token is still valid
      if (tokenData.expiresAt > Date.now()) {
        return tokenData.token;
      }
    } catch (error) {
      // Invalid token format, generate a new one
      console.error('Invalid CSRF token format:', error);
    }
  }
  
  // No valid token found, generate a new one
  return generateCSRFToken();
}

/**
 * Validate a CSRF token against the stored token
 * 
 * @param token The token to validate
 * @returns Whether the token is valid
 */
export function validateCSRFToken(token: string): boolean {
  // Get the stored token
  const storedToken = localStorage.getItem(CSRF_TOKEN_KEY);
  
  if (!storedToken) {
    return false;
  }
  
  try {
    const tokenData: CSRFToken = JSON.parse(storedToken);
    
    // Check if token is still valid and matches
    return tokenData.expiresAt > Date.now() && tokenData.token === token;
  } catch (error) {
    console.error('Error validating CSRF token:', error);
    return false;
  }
}

/**
 * Refresh the CSRF token expiration
 * 
 * @returns Whether the token was successfully refreshed
 */
export function refreshCSRFToken(): boolean {
  // Get the stored token
  const storedToken = localStorage.getItem(CSRF_TOKEN_KEY);
  
  if (!storedToken) {
    // No token to refresh, generate a new one
    generateCSRFToken();
    return true;
  }
  
  try {
    const tokenData: CSRFToken = JSON.parse(storedToken);
    
    // Update the expiration
    tokenData.expiresAt = Date.now() + CSRF_TOKEN_EXPIRY;
    
    // Store the updated token
    localStorage.setItem(CSRF_TOKEN_KEY, JSON.stringify(tokenData));
    
    return true;
  } catch (error) {
    console.error('Error refreshing CSRF token:', error);
    return false;
  }
}

/**
 * Clear the CSRF token
 */
export function clearCSRFToken(): void {
  localStorage.removeItem(CSRF_TOKEN_KEY);
}

/**
 * Add a CSRF token to a form element
 * 
 * @param form The form element to add the token to
 */
export function addCSRFTokenToForm(form: HTMLFormElement): void {
  // Remove any existing CSRF token input
  const existingInput = form.querySelector(`input[name="${CSRF_TOKEN_HEADER}"]`);
  if (existingInput) {
    existingInput.remove();
  }
  
  // Create a hidden input for the CSRF token
  const input = document.createElement('input');
  input.type = 'hidden';
  input.name = CSRF_TOKEN_HEADER;
  input.value = getCSRFToken();
  
  // Add the input to the form
  form.appendChild(input);
}

/**
 * Add a CSRF token to fetch options
 * 
 * @param options Fetch options to add the token to
 * @returns Updated fetch options with CSRF token
 */
export function addCSRFTokenToFetchOptions(options: RequestInit = {}): RequestInit {
  // Create headers if they don't exist
  const headers = options.headers || {};
  
  // Add the CSRF token header
  const updatedHeaders = {
    ...headers,
    [CSRF_TOKEN_HEADER]: getCSRFToken()
  };
  
  // Return updated options
  return {
    ...options,
    headers: updatedHeaders
  };
}

/**
 * Create a fetch wrapper that automatically adds CSRF tokens
 * 
 * @returns A fetch function that adds CSRF tokens to requests
 */
export function createCSRFProtectedFetch(): typeof fetch {
  return (input: RequestInfo | URL, init?: RequestInit) => {
    // Add CSRF token to the request
    const csrfProtectedInit = addCSRFTokenToFetchOptions(init);
    
    // Call the original fetch
    return fetch(input, csrfProtectedInit);
  };
}

/**
 * Create an Axios request interceptor that adds CSRF tokens
 * 
 * @param axios Axios instance
 */
export function addCSRFTokenToAxios(axios: any): void {
  axios.interceptors.request.use((config: any) => {
    // Add CSRF token to the request headers
    config.headers = config.headers || {};
    config.headers[CSRF_TOKEN_HEADER] = getCSRFToken();
    
    return config;
  });
}

/**
 * Example usage:
 * 
 * // Add CSRF token to a form
 * const form = document.querySelector('form');
 * addCSRFTokenToForm(form);
 * 
 * // Add CSRF token to fetch request
 * fetch('/api/data', addCSRFTokenToFetchOptions({
 *   method: 'POST',
 *   body: JSON.stringify({ data: 'example' })
 * }));
 * 
 * // Use CSRF-protected fetch
 * const csrfFetch = createCSRFProtectedFetch();
 * csrfFetch('/api/data', {
 *   method: 'POST',
 *   body: JSON.stringify({ data: 'example' })
 * });
 * 
 * // Add CSRF token to Axios
 * import axios from 'axios';
 * addCSRFTokenToAxios(axios);
 * axios.post('/api/data', { data: 'example' });
 */ 