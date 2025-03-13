import {
  isHttps,
  generateHstsHeader,
  isAllowedHost,
  generateHttpsUrl,
  shouldEnforceHttps,
  DEFAULT_HTTPS_CONFIG,
  DEVELOPMENT_HTTPS_CONFIG
} from '../httpsEnforcement';

describe('HTTPS Enforcement', () => {
  describe('isHttps', () => {
    const originalLocation = window.location;
    
    beforeEach(() => {
      // Mock window.location
      delete (window as any).location;
      window.location = { ...originalLocation };
    });
    
    afterEach(() => {
      // Restore window.location
      window.location = originalLocation;
    });
    
    it('should return true for HTTPS protocol', () => {
      // Mock HTTPS protocol
      Object.defineProperty(window.location, 'protocol', {
        value: 'https:',
        writable: true
      });
      
      expect(isHttps()).toBe(true);
    });
    
    it('should return false for HTTP protocol', () => {
      // Mock HTTP protocol
      Object.defineProperty(window.location, 'protocol', {
        value: 'http:',
        writable: true
      });
      
      expect(isHttps()).toBe(false);
    });
  });
  
  describe('generateHstsHeader', () => {
    it('should generate HSTS header with default config', () => {
      const header = generateHstsHeader();
      
      expect(header).toBe('max-age=63072000; includeSubDomains; preload');
    });
    
    it('should generate HSTS header without subdomains', () => {
      const header = generateHstsHeader({
        ...DEFAULT_HTTPS_CONFIG,
        includeSubdomains: false
      });
      
      expect(header).toBe('max-age=63072000; preload');
    });
    
    it('should generate HSTS header without preload', () => {
      const header = generateHstsHeader({
        ...DEFAULT_HTTPS_CONFIG,
        preload: false
      });
      
      expect(header).toBe('max-age=63072000; includeSubDomains');
    });
    
    it('should generate HSTS header with custom max age', () => {
      const header = generateHstsHeader({
        ...DEFAULT_HTTPS_CONFIG,
        maxAge: 86400 // 1 day
      });
      
      expect(header).toBe('max-age=86400; includeSubDomains; preload');
    });
    
    it('should return empty string if HTTPS is not enabled', () => {
      const header = generateHstsHeader({
        ...DEFAULT_HTTPS_CONFIG,
        enabled: false
      });
      
      expect(header).toBe('');
    });
  });
  
  describe('isAllowedHost', () => {
    it('should return true for allowed hosts', () => {
      const config = {
        ...DEFAULT_HTTPS_CONFIG,
        allowedHosts: ['localhost', '127.0.0.1', 'example.com']
      };
      
      expect(isAllowedHost('localhost', config)).toBe(true);
      expect(isAllowedHost('127.0.0.1', config)).toBe(true);
      expect(isAllowedHost('example.com', config)).toBe(true);
    });
    
    it('should return false for disallowed hosts', () => {
      const config = {
        ...DEFAULT_HTTPS_CONFIG,
        allowedHosts: ['localhost', '127.0.0.1']
      };
      
      expect(isAllowedHost('example.com', config)).toBe(false);
      expect(isAllowedHost('test.com', config)).toBe(false);
    });
    
    it('should handle hosts with ports', () => {
      const config = {
        ...DEFAULT_HTTPS_CONFIG,
        allowedHosts: ['localhost', '127.0.0.1']
      };
      
      expect(isAllowedHost('localhost:3000', config)).toBe(true);
      expect(isAllowedHost('127.0.0.1:8080', config)).toBe(true);
      expect(isAllowedHost('example.com:443', config)).toBe(false);
    });
    
    it('should return false for empty host', () => {
      const config = {
        ...DEFAULT_HTTPS_CONFIG,
        allowedHosts: ['localhost', '127.0.0.1']
      };
      
      expect(isAllowedHost('', config)).toBe(false);
    });
  });
  
  describe('generateHttpsUrl', () => {
    it('should convert HTTP URL to HTTPS', () => {
      expect(generateHttpsUrl('http://example.com')).toBe('https://example.com');
      expect(generateHttpsUrl('http://example.com/path')).toBe('https://example.com/path');
      expect(generateHttpsUrl('http://example.com:80')).toBe('https://example.com:80');
    });
    
    it('should not modify HTTPS URL', () => {
      expect(generateHttpsUrl('https://example.com')).toBe('https://example.com');
      expect(generateHttpsUrl('https://example.com/path')).toBe('https://example.com/path');
      expect(generateHttpsUrl('https://example.com:443')).toBe('https://example.com:443');
    });
    
    it('should add HTTPS protocol to URL without protocol', () => {
      expect(generateHttpsUrl('example.com')).toBe('https://example.com');
      expect(generateHttpsUrl('example.com/path')).toBe('https://example.com/path');
      expect(generateHttpsUrl('example.com:443')).toBe('https://example.com:443');
    });
  });
  
  describe('shouldEnforceHttps', () => {
    it('should return true for non-allowed hosts with HTTPS enabled', () => {
      const config = {
        ...DEFAULT_HTTPS_CONFIG,
        allowedHosts: ['localhost', '127.0.0.1']
      };
      
      expect(shouldEnforceHttps('example.com', config)).toBe(true);
      expect(shouldEnforceHttps('test.com', config)).toBe(true);
    });
    
    it('should return false for allowed hosts', () => {
      const config = {
        ...DEFAULT_HTTPS_CONFIG,
        allowedHosts: ['localhost', '127.0.0.1']
      };
      
      expect(shouldEnforceHttps('localhost', config)).toBe(false);
      expect(shouldEnforceHttps('127.0.0.1', config)).toBe(false);
      expect(shouldEnforceHttps('localhost:3000', config)).toBe(false);
    });
    
    it('should return false if HTTPS is not enabled', () => {
      const config = {
        ...DEFAULT_HTTPS_CONFIG,
        enabled: false,
        allowedHosts: []
      };
      
      expect(shouldEnforceHttps('example.com', config)).toBe(false);
      expect(shouldEnforceHttps('test.com', config)).toBe(false);
    });
  });
  
  describe('Default Configurations', () => {
    it('should have correct default configuration', () => {
      expect(DEFAULT_HTTPS_CONFIG.enabled).toBe(true);
      expect(DEFAULT_HTTPS_CONFIG.includeSubdomains).toBe(true);
      expect(DEFAULT_HTTPS_CONFIG.preload).toBe(true);
      expect(DEFAULT_HTTPS_CONFIG.maxAge).toBe(63072000);
      expect(DEFAULT_HTTPS_CONFIG.allowedHosts).toEqual([]);
      expect(DEFAULT_HTTPS_CONFIG.redirectHttp).toBe(true);
      expect(DEFAULT_HTTPS_CONFIG.redirectStatusCode).toBe(301);
    });
    
    it('should have correct development configuration', () => {
      expect(DEVELOPMENT_HTTPS_CONFIG.enabled).toBe(false);
      expect(DEVELOPMENT_HTTPS_CONFIG.includeSubdomains).toBe(false);
      expect(DEVELOPMENT_HTTPS_CONFIG.preload).toBe(false);
      expect(DEVELOPMENT_HTTPS_CONFIG.maxAge).toBe(0);
      expect(DEVELOPMENT_HTTPS_CONFIG.allowedHosts).toEqual(['localhost', '127.0.0.1']);
      expect(DEVELOPMENT_HTTPS_CONFIG.redirectHttp).toBe(false);
      expect(DEVELOPMENT_HTTPS_CONFIG.redirectStatusCode).toBe(302);
    });
  });
}); 