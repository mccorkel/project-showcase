/**
 * HTTPS Enforcement Utility
 * 
 * This utility provides functions to help with enforcing HTTPS
 * and redirecting HTTP requests to HTTPS.
 */

/**
 * HTTPS enforcement configuration
 */
export interface HttpsEnforcementConfig {
  /**
   * Whether to enforce HTTPS
   */
  enabled: boolean;
  
  /**
   * Whether to include subdomains in HSTS header
   */
  includeSubdomains: boolean;
  
  /**
   * Whether to include preload directive in HSTS header
   */
  preload: boolean;
  
  /**
   * Max age for HSTS header in seconds
   */
  maxAge: number;
  
  /**
   * Allowed hosts (for development environments)
   */
  allowedHosts: string[];
  
  /**
   * Whether to redirect HTTP to HTTPS
   */
  redirectHttp: boolean;
  
  /**
   * Status code to use for HTTP to HTTPS redirects
   */
  redirectStatusCode: 301 | 302 | 307 | 308;
}

/**
 * Default HTTPS enforcement configuration
 */
export const DEFAULT_HTTPS_CONFIG: HttpsEnforcementConfig = {
  enabled: true,
  includeSubdomains: true,
  preload: true,
  maxAge: 63072000, // 2 years in seconds
  allowedHosts: [],
  redirectHttp: true,
  redirectStatusCode: 301 // Permanent redirect
};

/**
 * Development HTTPS enforcement configuration
 */
export const DEVELOPMENT_HTTPS_CONFIG: HttpsEnforcementConfig = {
  enabled: false,
  includeSubdomains: false,
  preload: false,
  maxAge: 0,
  allowedHosts: ['localhost', '127.0.0.1'],
  redirectHttp: false,
  redirectStatusCode: 302 // Temporary redirect
};

/**
 * Check if the current environment is HTTPS
 * 
 * @returns Whether the current environment is HTTPS
 */
export function isHttps(): boolean {
  if (typeof window !== 'undefined') {
    return window.location.protocol === 'https:';
  }
  
  return false;
}

/**
 * Generate HSTS header value
 * 
 * @param config HTTPS enforcement configuration
 * @returns HSTS header value
 */
export function generateHstsHeader(
  config: HttpsEnforcementConfig = DEFAULT_HTTPS_CONFIG
): string {
  if (!config.enabled) {
    return '';
  }
  
  const parts: string[] = [`max-age=${config.maxAge}`];
  
  if (config.includeSubdomains) {
    parts.push('includeSubDomains');
  }
  
  if (config.preload) {
    parts.push('preload');
  }
  
  return parts.join('; ');
}

/**
 * Check if a host is allowed
 * 
 * @param host Host to check
 * @param config HTTPS enforcement configuration
 * @returns Whether the host is allowed
 */
export function isAllowedHost(
  host: string,
  config: HttpsEnforcementConfig = DEFAULT_HTTPS_CONFIG
): boolean {
  if (!host) {
    return false;
  }
  
  // Remove port if present
  const hostWithoutPort = host.split(':')[0];
  
  return config.allowedHosts.includes(hostWithoutPort);
}

/**
 * Generate HTTPS redirect URL
 * 
 * @param url Original URL
 * @returns HTTPS URL
 */
export function generateHttpsUrl(url: string): string {
  if (url.startsWith('https://')) {
    return url;
  }
  
  if (url.startsWith('http://')) {
    return url.replace(/^http:\/\//i, 'https://');
  }
  
  return `https://${url}`;
}

/**
 * Check if HTTPS should be enforced
 * 
 * @param host Host to check
 * @param config HTTPS enforcement configuration
 * @returns Whether HTTPS should be enforced
 */
export function shouldEnforceHttps(
  host: string,
  config: HttpsEnforcementConfig = DEFAULT_HTTPS_CONFIG
): boolean {
  if (!config.enabled) {
    return false;
  }
  
  // Don't enforce HTTPS for allowed hosts (e.g., localhost)
  if (isAllowedHost(host, config)) {
    return false;
  }
  
  return true;
}

/**
 * Generate HTTPS enforcement middleware for Next.js
 * 
 * @param config HTTPS enforcement configuration
 * @returns Middleware function
 */
export function createHttpsEnforcementMiddleware(
  config: HttpsEnforcementConfig = DEFAULT_HTTPS_CONFIG
) {
  return (req: any, res: any, next: () => void) => {
    const host = req.headers.host || '';
    const protocol = req.headers['x-forwarded-proto'] || 'http';
    
    if (shouldEnforceHttps(host, config) && protocol !== 'https' && config.redirectHttp) {
      // Generate HTTPS URL
      const httpsUrl = generateHttpsUrl(`${host}${req.url}`);
      
      // Redirect to HTTPS
      res.writeHead(config.redirectStatusCode, {
        Location: httpsUrl,
        'Strict-Transport-Security': generateHstsHeader(config)
      });
      res.end();
      return;
    }
    
    // Add HSTS header if HTTPS
    if (protocol === 'https' && config.enabled) {
      res.setHeader('Strict-Transport-Security', generateHstsHeader(config));
    }
    
    next();
  };
}

/**
 * Redirect to HTTPS if currently on HTTP
 * 
 * @param config HTTPS enforcement configuration
 */
export function redirectToHttps(
  config: HttpsEnforcementConfig = DEFAULT_HTTPS_CONFIG
): void {
  if (typeof window === 'undefined') {
    return;
  }
  
  const host = window.location.host;
  const protocol = window.location.protocol;
  
  if (shouldEnforceHttps(host, config) && protocol === 'http:' && config.redirectHttp) {
    // Generate HTTPS URL
    const httpsUrl = generateHttpsUrl(window.location.href);
    
    // Redirect to HTTPS
    window.location.href = httpsUrl;
  }
}

/**
 * React hook to enforce HTTPS
 * 
 * @param config HTTPS enforcement configuration
 */
export function useHttpsEnforcement(
  config: HttpsEnforcementConfig = DEFAULT_HTTPS_CONFIG
): void {
  if (typeof window === 'undefined') {
    return;
  }
  
  // Redirect to HTTPS on mount
  if (config.enabled) {
    redirectToHttps(config);
  }
}

/**
 * Configure HTTPS for AWS Amplify
 * 
 * @param amplify AWS Amplify instance
 * @param config HTTPS enforcement configuration
 */
export function configureAmplifyHttps(
  amplify: any,
  config: HttpsEnforcementConfig = DEFAULT_HTTPS_CONFIG
): void {
  if (!amplify || !config.enabled) {
    return;
  }
  
  // Configure Amplify to use HTTPS
  if (amplify.configure) {
    const existingConfig = amplify.configure();
    
    amplify.configure({
      ...existingConfig,
      API: {
        ...existingConfig.API,
        endpoints: (existingConfig.API?.endpoints || []).map((endpoint: any) => ({
          ...endpoint,
          custom_header: async () => {
            return {
              ...endpoint.custom_header,
              'Strict-Transport-Security': generateHstsHeader(config)
            };
          }
        }))
      }
    });
  }
}

/**
 * Example usage:
 * 
 * // Check if current environment is HTTPS
 * const isHttpsEnvironment = isHttps();
 * 
 * // Generate HSTS header
 * const hstsHeader = generateHstsHeader({
 *   enabled: true,
 *   includeSubdomains: true,
 *   preload: true,
 *   maxAge: 63072000,
 *   allowedHosts: ['localhost', '127.0.0.1'],
 *   redirectHttp: true,
 *   redirectStatusCode: 301
 * });
 * 
 * // Create HTTPS enforcement middleware for Next.js
 * const httpsMiddleware = createHttpsEnforcementMiddleware();
 * 
 * // In Next.js middleware.ts
 * import { createHttpsEnforcementMiddleware } from '../utils/security/httpsEnforcement';
 * 
 * export function middleware(req) {
 *   const httpsMiddleware = createHttpsEnforcementMiddleware();
 *   return httpsMiddleware(req, {
 *     setHeader: (name, value) => res.headers.set(name, value),
 *     writeHead: (statusCode, headers) => {
 *       res.status = statusCode;
 *       Object.entries(headers).forEach(([name, value]) => {
 *         res.headers.set(name, value);
 *       });
 *     },
 *     end: () => {}
 *   }, () => {});
 * }
 * 
 * // In React component
 * import { useHttpsEnforcement } from '../utils/security/httpsEnforcement';
 * 
 * function MyComponent() {
 *   useHttpsEnforcement();
 *   
 *   return <div>My Component</div>;
 * }
 */ 