import {
  generateSecurityHeaders,
  generateCSP,
  securityHeaderConfigs,
  addSecurityHeadersToFetchOptions,
  DEFAULT_SECURITY_HEADERS
} from '../securityHeaders';

describe('Security Headers', () => {
  describe('Default Headers', () => {
    it('should generate default security headers', () => {
      const headers = generateSecurityHeaders();
      
      // Check that all default headers are present
      expect(headers['Content-Security-Policy']).toBeDefined();
      expect(headers['X-XSS-Protection']).toBeDefined();
      expect(headers['X-Content-Type-Options']).toBeDefined();
      expect(headers['X-Frame-Options']).toBeDefined();
      expect(headers['Referrer-Policy']).toBeDefined();
      expect(headers['Strict-Transport-Security']).toBeDefined();
      expect(headers['Permissions-Policy']).toBeDefined();
      expect(headers['Cache-Control']).toBeDefined();
      
      // Check specific values
      expect(headers['X-Content-Type-Options']).toBe('nosniff');
      expect(headers['X-Frame-Options']).toBe('DENY');
    });
  });
  
  describe('Custom Headers', () => {
    it('should generate custom security headers', () => {
      const customConfig = {
        contentSecurityPolicy: "default-src 'self'; script-src 'self' https://example.com;",
        xssProtection: "0",
        frameOptions: "SAMEORIGIN",
        cacheControl: "public, max-age=3600"
      };
      
      const headers = generateSecurityHeaders(customConfig);
      
      // Check that custom headers are present with correct values
      expect(headers['Content-Security-Policy']).toBe("default-src 'self'; script-src 'self' https://example.com;");
      expect(headers['X-XSS-Protection']).toBe("0");
      expect(headers['X-Frame-Options']).toBe("SAMEORIGIN");
      expect(headers['Cache-Control']).toBe("public, max-age=3600");
      
      // Check that other headers use default values
      expect(headers['X-Content-Type-Options']).toBe('nosniff');
      expect(headers['Referrer-Policy']).toBe('strict-origin-when-cross-origin');
    });
    
    it('should handle boolean values for headers', () => {
      const customConfig = {
        contentSecurityPolicy: true,
        xssProtection: true,
        frameOptions: false,
        cacheControl: true
      };
      
      const headers = generateSecurityHeaders(customConfig);
      
      // Headers with true should use default values
      expect(headers['Content-Security-Policy']).toBe(DEFAULT_SECURITY_HEADERS.contentSecurityPolicy as string);
      expect(headers['X-XSS-Protection']).toBe(DEFAULT_SECURITY_HEADERS.xssProtection as string);
      expect(headers['Cache-Control']).toBe(DEFAULT_SECURITY_HEADERS.cacheControl as string);
      
      // Headers with false should not be present
      expect(headers['X-Frame-Options']).toBeUndefined();
    });
  });
  
  describe('Content Security Policy', () => {
    it('should generate default CSP', () => {
      const csp = generateCSP();
      
      // Check that default directives are present
      expect(csp).toContain("default-src 'self'");
      expect(csp).toContain("script-src 'self'");
      expect(csp).toContain("style-src 'self'");
      expect(csp).toContain("img-src 'self' data:");
      expect(csp).toContain("font-src 'self'");
      expect(csp).toContain("connect-src 'self'");
      expect(csp).toContain("media-src 'self'");
      expect(csp).toContain("object-src 'none'");
      expect(csp).toContain("frame-src 'none'");
    });
    
    it('should generate custom CSP', () => {
      const csp = generateCSP({
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "https://example.com"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:", "https://images.example.com"],
        connectSrc: ["'self'", "https://api.example.com"],
        formAction: ["'self'"],
        baseUri: ["'self'"],
        reportTo: "csp-endpoint"
      });
      
      // Check that custom directives are present
      expect(csp).toContain("default-src 'self'");
      expect(csp).toContain("script-src 'self' https://example.com");
      expect(csp).toContain("style-src 'self' 'unsafe-inline'");
      expect(csp).toContain("img-src 'self' data: https://images.example.com");
      expect(csp).toContain("connect-src 'self' https://api.example.com");
      expect(csp).toContain("form-action 'self'");
      expect(csp).toContain("base-uri 'self'");
      expect(csp).toContain("report-to csp-endpoint");
    });
    
    it('should include optional directives only when specified', () => {
      const csp = generateCSP({
        workerSrc: ["'self'"],
        manifestSrc: ["'self'"]
      });
      
      // Check that optional directives are present
      expect(csp).toContain("worker-src 'self'");
      expect(csp).toContain("manifest-src 'self'");
    });
  });
  
  describe('Predefined Configurations', () => {
    it('should have strict configuration', () => {
      const headers = generateSecurityHeaders(securityHeaderConfigs.strict);
      
      // Check specific values for strict configuration
      expect(headers['X-Frame-Options']).toBe('DENY');
      expect(headers['Referrer-Policy']).toBe('no-referrer');
      expect(headers['Cache-Control']).toBe('no-store, max-age=0');
    });
    
    it('should have moderate configuration', () => {
      const headers = generateSecurityHeaders(securityHeaderConfigs.moderate);
      
      // Check specific values for moderate configuration
      expect(headers['X-Frame-Options']).toBe('SAMEORIGIN');
      expect(headers['Referrer-Policy']).toBe('strict-origin-when-cross-origin');
      expect(headers['Cache-Control']).toBe('no-cache, max-age=0');
    });
    
    it('should have relaxed configuration', () => {
      const headers = generateSecurityHeaders(securityHeaderConfigs.relaxed);
      
      // Check specific values for relaxed configuration
      expect(headers['X-Frame-Options']).toBe('SAMEORIGIN');
      expect(headers['Referrer-Policy']).toBe('strict-origin-when-cross-origin');
      expect(headers['Cache-Control']).toBe('public, max-age=3600');
      expect(headers['Content-Security-Policy']).toContain("'unsafe-inline'");
      expect(headers['Content-Security-Policy']).toContain("'unsafe-eval'");
    });
  });
  
  describe('Fetch Integration', () => {
    it('should add security headers to fetch options', () => {
      const options: RequestInit = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      };
      
      const updatedOptions = addSecurityHeadersToFetchOptions(options);
      
      // Check that headers are added
      expect((updatedOptions.headers as Record<string, string>)['Content-Security-Policy']).toBeDefined();
      expect((updatedOptions.headers as Record<string, string>)['X-XSS-Protection']).toBeDefined();
      expect((updatedOptions.headers as Record<string, string>)['X-Content-Type-Options']).toBeDefined();
      
      // Check that original headers are preserved
      expect((updatedOptions.headers as Record<string, string>)['Content-Type']).toBe('application/json');
    });
    
    it('should add security headers with custom configuration', () => {
      const options: RequestInit = {
        method: 'POST'
      };
      
      const updatedOptions = addSecurityHeadersToFetchOptions(options, securityHeaderConfigs.strict);
      
      // Check that strict headers are added
      expect((updatedOptions.headers as Record<string, string>)['X-Frame-Options']).toBe('DENY');
      expect((updatedOptions.headers as Record<string, string>)['Referrer-Policy']).toBe('no-referrer');
    });
    
    it('should work with empty options', () => {
      const updatedOptions = addSecurityHeadersToFetchOptions();
      
      // Check that headers are added
      expect((updatedOptions.headers as Record<string, string>)['Content-Security-Policy']).toBeDefined();
      expect((updatedOptions.headers as Record<string, string>)['X-XSS-Protection']).toBeDefined();
      expect((updatedOptions.headers as Record<string, string>)['X-Content-Type-Options']).toBeDefined();
    });
  });
}); 