import {
  generateRateLimitKey,
  checkRateLimit,
  resetRateLimit,
  createRateLimitHeaders,
  createRateLimiter,
  rateLimitConfigs
} from '../rateLimiting';

// Mock Date.now() to control time
const originalDateNow = Date.now;

describe('Rate Limiting', () => {
  // Setup and teardown
  beforeEach(() => {
    // Reset Date.now mock
    Date.now = originalDateNow;
  });
  
  afterEach(() => {
    // Restore Date.now
    Date.now = originalDateNow;
  });
  
  describe('Key Generation', () => {
    it('should generate a key with all components', () => {
      const key = generateRateLimitKey('user-123', '127.0.0.1', '/api/data', {
        maxRequests: 100,
        windowMs: 60000,
        includeUserId: true,
        includeIp: true,
        includeEndpoint: true
      });
      
      expect(key).toBe('user:user-123:ip:127.0.0.1:endpoint:/api/data');
    });
    
    it('should generate a key without user ID', () => {
      const key = generateRateLimitKey('user-123', '127.0.0.1', '/api/data', {
        maxRequests: 100,
        windowMs: 60000,
        includeUserId: false,
        includeIp: true,
        includeEndpoint: true
      });
      
      expect(key).toBe('ip:127.0.0.1:endpoint:/api/data');
    });
    
    it('should generate a key without IP', () => {
      const key = generateRateLimitKey('user-123', '127.0.0.1', '/api/data', {
        maxRequests: 100,
        windowMs: 60000,
        includeUserId: true,
        includeIp: false,
        includeEndpoint: true
      });
      
      expect(key).toBe('user:user-123:endpoint:/api/data');
    });
    
    it('should generate a key without endpoint', () => {
      const key = generateRateLimitKey('user-123', '127.0.0.1', '/api/data', {
        maxRequests: 100,
        windowMs: 60000,
        includeUserId: true,
        includeIp: true,
        includeEndpoint: false
      });
      
      expect(key).toBe('user:user-123:ip:127.0.0.1');
    });
    
    it('should handle null user ID', () => {
      const key = generateRateLimitKey(null, '127.0.0.1', '/api/data', {
        maxRequests: 100,
        windowMs: 60000,
        includeUserId: true,
        includeIp: true,
        includeEndpoint: true
      });
      
      expect(key).toBe('ip:127.0.0.1:endpoint:/api/data');
    });
  });
  
  describe('Rate Limiting', () => {
    it('should not limit requests within the limit', () => {
      const config = {
        maxRequests: 5,
        windowMs: 60000, // 1 minute
        includeUserId: true,
        includeIp: true,
        includeEndpoint: true
      };
      
      // Make 5 requests (within the limit)
      for (let i = 0; i < 5; i++) {
        const result = checkRateLimit('user-123', '127.0.0.1', '/api/data', config);
        
        expect(result.limited).toBe(false);
        expect(result.remaining).toBe(5 - i - 1);
      }
    });
    
    it('should limit requests over the limit', () => {
      const config = {
        maxRequests: 5,
        windowMs: 60000, // 1 minute
        includeUserId: true,
        includeIp: true,
        includeEndpoint: true
      };
      
      // Make 6 requests (over the limit)
      for (let i = 0; i < 6; i++) {
        const result = checkRateLimit('user-123', '127.0.0.1', '/api/data', config);
        
        if (i < 5) {
          expect(result.limited).toBe(false);
          expect(result.remaining).toBe(5 - i - 1);
        } else {
          expect(result.limited).toBe(true);
          expect(result.remaining).toBe(0);
        }
      }
    });
    
    it('should reset rate limits', () => {
      const config = {
        maxRequests: 5,
        windowMs: 60000, // 1 minute
        includeUserId: true,
        includeIp: true,
        includeEndpoint: true
      };
      
      // Make 5 requests (within the limit)
      for (let i = 0; i < 5; i++) {
        checkRateLimit('user-123', '127.0.0.1', '/api/data', config);
      }
      
      // Next request should be limited
      const limitedResult = checkRateLimit('user-123', '127.0.0.1', '/api/data', config);
      expect(limitedResult.limited).toBe(true);
      
      // Reset the rate limit
      resetRateLimit('user-123', '127.0.0.1', '/api/data', config);
      
      // Next request should not be limited
      const resetResult = checkRateLimit('user-123', '127.0.0.1', '/api/data', config);
      expect(resetResult.limited).toBe(false);
      expect(resetResult.remaining).toBe(4);
    });
    
    it('should expire rate limits after the window', () => {
      const config = {
        maxRequests: 5,
        windowMs: 60000, // 1 minute
        includeUserId: true,
        includeIp: true,
        includeEndpoint: true
      };
      
      // Mock Date.now to control time
      const now = Date.now();
      Date.now = jest.fn().mockReturnValue(now);
      
      // Make 5 requests (within the limit)
      for (let i = 0; i < 5; i++) {
        checkRateLimit('user-123', '127.0.0.1', '/api/data', config);
      }
      
      // Next request should be limited
      const limitedResult = checkRateLimit('user-123', '127.0.0.1', '/api/data', config);
      expect(limitedResult.limited).toBe(true);
      
      // Advance time past the window
      Date.now = jest.fn().mockReturnValue(now + 61000); // 61 seconds later
      
      // Next request should not be limited
      const expiredResult = checkRateLimit('user-123', '127.0.0.1', '/api/data', config);
      expect(expiredResult.limited).toBe(false);
      expect(expiredResult.remaining).toBe(4);
    });
  });
  
  describe('Headers', () => {
    it('should create rate limit headers', () => {
      const rateLimitInfo = {
        remaining: 42,
        resetAt: 1609459200000 // 2021-01-01T00:00:00.000Z
      };
      
      const headers = createRateLimitHeaders(rateLimitInfo);
      
      expect(headers['X-RateLimit-Remaining']).toBe('42');
      expect(headers['X-RateLimit-Reset']).toBe('1609459200');
    });
  });
  
  describe('Rate Limiter', () => {
    it('should create a rate limiter with custom config', () => {
      const config = {
        maxRequests: 10,
        windowMs: 30000 // 30 seconds
      };
      
      const rateLimiter = createRateLimiter(config);
      
      // Make 10 requests (within the limit)
      for (let i = 0; i < 10; i++) {
        const result = rateLimiter('user-123', '127.0.0.1', '/api/data');
        
        expect(result.limited).toBe(false);
        expect(result.headers['X-RateLimit-Remaining']).toBe((10 - i - 1).toString());
      }
      
      // Next request should be limited
      const limitedResult = rateLimiter('user-123', '127.0.0.1', '/api/data');
      expect(limitedResult.limited).toBe(true);
      expect(limitedResult.headers['X-RateLimit-Remaining']).toBe('0');
    });
  });
  
  describe('Predefined Configs', () => {
    it('should have login rate limit config', () => {
      expect(rateLimitConfigs.login).toBeDefined();
      expect(rateLimitConfigs.login.maxRequests).toBe(5);
      expect(rateLimitConfigs.login.windowMs).toBe(60 * 1000); // 1 minute
      expect(rateLimitConfigs.login.includeUserId).toBe(false);
      expect(rateLimitConfigs.login.includeIp).toBe(true);
      expect(rateLimitConfigs.login.includeEndpoint).toBe(true);
    });
    
    it('should have password reset rate limit config', () => {
      expect(rateLimitConfigs.passwordReset).toBeDefined();
      expect(rateLimitConfigs.passwordReset.maxRequests).toBe(3);
      expect(rateLimitConfigs.passwordReset.windowMs).toBe(60 * 60 * 1000); // 1 hour
      expect(rateLimitConfigs.passwordReset.includeUserId).toBe(false);
      expect(rateLimitConfigs.passwordReset.includeIp).toBe(true);
      expect(rateLimitConfigs.passwordReset.includeEndpoint).toBe(true);
    });
    
    it('should have API rate limit config', () => {
      expect(rateLimitConfigs.api).toBeDefined();
      expect(rateLimitConfigs.api.maxRequests).toBe(100);
      expect(rateLimitConfigs.api.windowMs).toBe(60 * 1000); // 1 minute
      expect(rateLimitConfigs.api.includeUserId).toBe(true);
      expect(rateLimitConfigs.api.includeIp).toBe(true);
      expect(rateLimitConfigs.api.includeEndpoint).toBe(true);
    });
    
    it('should have public API rate limit config', () => {
      expect(rateLimitConfigs.publicApi).toBeDefined();
      expect(rateLimitConfigs.publicApi.maxRequests).toBe(30);
      expect(rateLimitConfigs.publicApi.windowMs).toBe(60 * 1000); // 1 minute
      expect(rateLimitConfigs.publicApi.includeUserId).toBe(false);
      expect(rateLimitConfigs.publicApi.includeIp).toBe(true);
      expect(rateLimitConfigs.publicApi.includeEndpoint).toBe(true);
    });
  });
}); 