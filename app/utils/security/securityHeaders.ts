/**
 * Security Headers Utility
 * 
 * This utility provides functions to help with setting security headers
 * to protect against common web vulnerabilities.
 */

/**
 * Security header configuration
 */
export interface SecurityHeadersConfig {
  /**
   * Content Security Policy
   */
  contentSecurityPolicy?: string | boolean;
  
  /**
   * X-XSS-Protection header
   */
  xssProtection?: string | boolean;
  
  /**
   * X-Content-Type-Options header
   */
  contentTypeOptions?: string | boolean;
  
  /**
   * X-Frame-Options header
   */
  frameOptions?: string | boolean;
  
  /**
   * Referrer-Policy header
   */
  referrerPolicy?: string | boolean;
  
  /**
   * Strict-Transport-Security header
   */
  strictTransportSecurity?: string | boolean;
  
  /**
   * Permissions-Policy header
   */
  permissionsPolicy?: string | boolean;
  
  /**
   * Cache-Control header
   */
  cacheControl?: string | boolean;
}

/**
 * Default security header configuration
 */
export const DEFAULT_SECURITY_HEADERS: SecurityHeadersConfig = {
  contentSecurityPolicy: "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; font-src 'self'; connect-src 'self'; media-src 'self'; object-src 'none'; frame-src 'none';",
  xssProtection: "1; mode=block",
  contentTypeOptions: "nosniff",
  frameOptions: "DENY",
  referrerPolicy: "strict-origin-when-cross-origin",
  strictTransportSecurity: "max-age=63072000; includeSubDomains; preload",
  permissionsPolicy: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  cacheControl: "no-store, max-age=0"
};

/**
 * Generate security headers based on configuration
 * 
 * @param config Security header configuration
 * @returns Object with security headers
 */
export function generateSecurityHeaders(
  config: SecurityHeadersConfig = DEFAULT_SECURITY_HEADERS
): Record<string, string> {
  const headers: Record<string, string> = {};
  
  // Content Security Policy
  if (config.contentSecurityPolicy) {
    headers['Content-Security-Policy'] = typeof config.contentSecurityPolicy === 'string'
      ? config.contentSecurityPolicy
      : DEFAULT_SECURITY_HEADERS.contentSecurityPolicy as string;
  }
  
  // X-XSS-Protection
  if (config.xssProtection) {
    headers['X-XSS-Protection'] = typeof config.xssProtection === 'string'
      ? config.xssProtection
      : DEFAULT_SECURITY_HEADERS.xssProtection as string;
  }
  
  // X-Content-Type-Options
  if (config.contentTypeOptions) {
    headers['X-Content-Type-Options'] = typeof config.contentTypeOptions === 'string'
      ? config.contentTypeOptions
      : DEFAULT_SECURITY_HEADERS.contentTypeOptions as string;
  }
  
  // X-Frame-Options
  if (config.frameOptions) {
    headers['X-Frame-Options'] = typeof config.frameOptions === 'string'
      ? config.frameOptions
      : DEFAULT_SECURITY_HEADERS.frameOptions as string;
  }
  
  // Referrer-Policy
  if (config.referrerPolicy) {
    headers['Referrer-Policy'] = typeof config.referrerPolicy === 'string'
      ? config.referrerPolicy
      : DEFAULT_SECURITY_HEADERS.referrerPolicy as string;
  }
  
  // Strict-Transport-Security
  if (config.strictTransportSecurity) {
    headers['Strict-Transport-Security'] = typeof config.strictTransportSecurity === 'string'
      ? config.strictTransportSecurity
      : DEFAULT_SECURITY_HEADERS.strictTransportSecurity as string;
  }
  
  // Permissions-Policy
  if (config.permissionsPolicy) {
    headers['Permissions-Policy'] = typeof config.permissionsPolicy === 'string'
      ? config.permissionsPolicy
      : DEFAULT_SECURITY_HEADERS.permissionsPolicy as string;
  }
  
  // Cache-Control
  if (config.cacheControl) {
    headers['Cache-Control'] = typeof config.cacheControl === 'string'
      ? config.cacheControl
      : DEFAULT_SECURITY_HEADERS.cacheControl as string;
  }
  
  return headers;
}

/**
 * Generate Content Security Policy header
 * 
 * @param options CSP options
 * @returns CSP header value
 */
export function generateCSP(options: {
  defaultSrc?: string[];
  scriptSrc?: string[];
  styleSrc?: string[];
  imgSrc?: string[];
  fontSrc?: string[];
  connectSrc?: string[];
  mediaSrc?: string[];
  objectSrc?: string[];
  frameSrc?: string[];
  workerSrc?: string[];
  manifestSrc?: string[];
  formAction?: string[];
  baseUri?: string[];
  reportTo?: string;
} = {}): string {
  const directives: string[] = [];
  
  // Default-Src
  if (options.defaultSrc) {
    directives.push(`default-src ${options.defaultSrc.join(' ')}`);
  } else {
    directives.push("default-src 'self'");
  }
  
  // Script-Src
  if (options.scriptSrc) {
    directives.push(`script-src ${options.scriptSrc.join(' ')}`);
  } else {
    directives.push("script-src 'self'");
  }
  
  // Style-Src
  if (options.styleSrc) {
    directives.push(`style-src ${options.styleSrc.join(' ')}`);
  } else {
    directives.push("style-src 'self'");
  }
  
  // Img-Src
  if (options.imgSrc) {
    directives.push(`img-src ${options.imgSrc.join(' ')}`);
  } else {
    directives.push("img-src 'self' data:");
  }
  
  // Font-Src
  if (options.fontSrc) {
    directives.push(`font-src ${options.fontSrc.join(' ')}`);
  } else {
    directives.push("font-src 'self'");
  }
  
  // Connect-Src
  if (options.connectSrc) {
    directives.push(`connect-src ${options.connectSrc.join(' ')}`);
  } else {
    directives.push("connect-src 'self'");
  }
  
  // Media-Src
  if (options.mediaSrc) {
    directives.push(`media-src ${options.mediaSrc.join(' ')}`);
  } else {
    directives.push("media-src 'self'");
  }
  
  // Object-Src
  if (options.objectSrc) {
    directives.push(`object-src ${options.objectSrc.join(' ')}`);
  } else {
    directives.push("object-src 'none'");
  }
  
  // Frame-Src
  if (options.frameSrc) {
    directives.push(`frame-src ${options.frameSrc.join(' ')}`);
  } else {
    directives.push("frame-src 'none'");
  }
  
  // Worker-Src
  if (options.workerSrc) {
    directives.push(`worker-src ${options.workerSrc.join(' ')}`);
  }
  
  // Manifest-Src
  if (options.manifestSrc) {
    directives.push(`manifest-src ${options.manifestSrc.join(' ')}`);
  }
  
  // Form-Action
  if (options.formAction) {
    directives.push(`form-action ${options.formAction.join(' ')}`);
  }
  
  // Base-Uri
  if (options.baseUri) {
    directives.push(`base-uri ${options.baseUri.join(' ')}`);
  }
  
  // Report-To
  if (options.reportTo) {
    directives.push(`report-to ${options.reportTo}`);
  }
  
  return directives.join('; ');
}

/**
 * Predefined security header configurations
 */
export const securityHeaderConfigs = {
  /**
   * Strict security headers for sensitive pages
   */
  strict: {
    contentSecurityPolicy: "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self'; font-src 'self'; connect-src 'self'; media-src 'self'; object-src 'none'; frame-src 'none'; base-uri 'self'; form-action 'self';",
    xssProtection: "1; mode=block",
    contentTypeOptions: "nosniff",
    frameOptions: "DENY",
    referrerPolicy: "no-referrer",
    strictTransportSecurity: "max-age=63072000; includeSubDomains; preload",
    permissionsPolicy: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
    cacheControl: "no-store, max-age=0"
  },
  
  /**
   * Moderate security headers for general pages
   */
  moderate: {
    contentSecurityPolicy: "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self'; media-src 'self'; object-src 'none'; frame-src 'self';",
    xssProtection: "1; mode=block",
    contentTypeOptions: "nosniff",
    frameOptions: "SAMEORIGIN",
    referrerPolicy: "strict-origin-when-cross-origin",
    strictTransportSecurity: "max-age=31536000; includeSubDomains",
    permissionsPolicy: "camera=(), microphone=(), geolocation=(self), interest-cohort=()",
    cacheControl: "no-cache, max-age=0"
  },
  
  /**
   * Relaxed security headers for public pages
   */
  relaxed: {
    contentSecurityPolicy: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data: https:; connect-src 'self' https:; media-src 'self' https:; object-src 'none'; frame-src 'self' https:;",
    xssProtection: "1; mode=block",
    contentTypeOptions: "nosniff",
    frameOptions: "SAMEORIGIN",
    referrerPolicy: "strict-origin-when-cross-origin",
    strictTransportSecurity: "max-age=31536000",
    permissionsPolicy: "camera=(self), microphone=(self), geolocation=(self), interest-cohort=()",
    cacheControl: "public, max-age=3600"
  }
};

/**
 * Add security headers to fetch options
 * 
 * @param options Fetch options
 * @param config Security header configuration
 * @returns Updated fetch options with security headers
 */
export function addSecurityHeadersToFetchOptions(
  options: RequestInit = {},
  config: SecurityHeadersConfig = DEFAULT_SECURITY_HEADERS
): RequestInit {
  // Generate security headers
  const securityHeaders = generateSecurityHeaders(config);
  
  // Create headers if they don't exist
  const headers = options.headers || {};
  
  // Add security headers
  const updatedHeaders = {
    ...headers,
    ...securityHeaders
  };
  
  // Return updated options
  return {
    ...options,
    headers: updatedHeaders
  };
}

/**
 * Example usage:
 * 
 * // Generate default security headers
 * const headers = generateSecurityHeaders();
 * 
 * // Generate custom security headers
 * const customHeaders = generateSecurityHeaders({
 *   contentSecurityPolicy: "default-src 'self'; script-src 'self' https://cdn.example.com;",
 *   frameOptions: "SAMEORIGIN",
 *   cacheControl: "public, max-age=3600"
 * });
 * 
 * // Generate custom CSP
 * const csp = generateCSP({
 *   defaultSrc: ["'self'"],
 *   scriptSrc: ["'self'", "https://cdn.example.com"],
 *   styleSrc: ["'self'", "'unsafe-inline'"],
 *   imgSrc: ["'self'", "data:", "https://images.example.com"],
 *   connectSrc: ["'self'", "https://api.example.com"]
 * });
 * 
 * // Use predefined security header configurations
 * const strictHeaders = generateSecurityHeaders(securityHeaderConfigs.strict);
 * const moderateHeaders = generateSecurityHeaders(securityHeaderConfigs.moderate);
 * const relaxedHeaders = generateSecurityHeaders(securityHeaderConfigs.relaxed);
 * 
 * // Add security headers to fetch options
 * fetch('/api/data', addSecurityHeadersToFetchOptions({
 *   method: 'POST',
 *   body: JSON.stringify({ data: 'example' })
 * }, securityHeaderConfigs.strict));
 */ 