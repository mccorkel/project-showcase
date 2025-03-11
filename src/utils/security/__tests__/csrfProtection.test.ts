import {
  generateCSRFToken,
  getCSRFToken,
  validateCSRFToken,
  refreshCSRFToken,
  clearCSRFToken,
  addCSRFTokenToFetchOptions
} from '../csrfProtection';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  
  return {
    getItem: (key: string): string | null => {
      return store[key] || null;
    },
    setItem: (key: string, value: string): void => {
      store[key] = value;
    },
    removeItem: (key: string): void => {
      delete store[key];
    },
    clear: (): void => {
      store = {};
    },
    getAllKeys: (): string[] => {
      return Object.keys(store);
    }
  };
})();

// Mock Date.now() to control time
const originalDateNow = Date.now;

describe('CSRF Protection', () => {
  // Setup and teardown
  beforeEach(() => {
    // Mock localStorage
    Object.defineProperty(window, 'localStorage', { value: localStorageMock });
    localStorageMock.clear();
    
    // Reset Date.now mock
    Date.now = originalDateNow;
  });
  
  afterEach(() => {
    // Restore Date.now
    Date.now = originalDateNow;
  });
  
  describe('Token Generation and Retrieval', () => {
    it('should generate a new CSRF token', () => {
      const token = generateCSRFToken();
      
      // Token should be a non-empty string
      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.length).toBeGreaterThan(0);
      
      // Token should be stored in localStorage
      const storedToken = localStorage.getItem('csrf_token');
      expect(storedToken).toBeDefined();
      
      // Stored token should contain the generated token
      const parsedToken = JSON.parse(storedToken!);
      expect(parsedToken.token).toBe(token);
      
      // Expiry should be in the future
      expect(parsedToken.expiresAt).toBeGreaterThan(Date.now());
    });
    
    it('should retrieve an existing token', () => {
      // Generate a token
      const generatedToken = generateCSRFToken();
      
      // Get the token
      const retrievedToken = getCSRFToken();
      
      // Retrieved token should match the generated token
      expect(retrievedToken).toBe(generatedToken);
    });
    
    it('should generate a new token if none exists', () => {
      // Clear localStorage
      localStorage.clear();
      
      // Get a token (should generate a new one)
      const token = getCSRFToken();
      
      // Token should be a non-empty string
      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.length).toBeGreaterThan(0);
      
      // Token should be stored in localStorage
      const storedToken = localStorage.getItem('csrf_token');
      expect(storedToken).toBeDefined();
    });
    
    it('should generate a new token if the existing one is expired', () => {
      // Generate a token
      const originalToken = generateCSRFToken();
      
      // Mock Date.now to simulate token expiration
      const now = Date.now();
      Date.now = jest.fn().mockReturnValue(now + 5 * 60 * 60 * 1000); // 5 hours later
      
      // Get a token (should generate a new one)
      const newToken = getCSRFToken();
      
      // New token should be different from the original
      expect(newToken).not.toBe(originalToken);
    });
  });
  
  describe('Token Validation', () => {
    it('should validate a valid token', () => {
      // Generate a token
      const token = generateCSRFToken();
      
      // Validate the token
      const isValid = validateCSRFToken(token);
      
      // Token should be valid
      expect(isValid).toBe(true);
    });
    
    it('should reject an invalid token', () => {
      // Generate a token
      generateCSRFToken();
      
      // Validate a different token
      const isValid = validateCSRFToken('invalid-token');
      
      // Token should be invalid
      expect(isValid).toBe(false);
    });
    
    it('should reject a token if none is stored', () => {
      // Clear localStorage
      localStorage.clear();
      
      // Validate a token
      const isValid = validateCSRFToken('some-token');
      
      // Token should be invalid
      expect(isValid).toBe(false);
    });
    
    it('should reject an expired token', () => {
      // Generate a token
      const token = generateCSRFToken();
      
      // Mock Date.now to simulate token expiration
      const now = Date.now();
      Date.now = jest.fn().mockReturnValue(now + 5 * 60 * 60 * 1000); // 5 hours later
      
      // Validate the token
      const isValid = validateCSRFToken(token);
      
      // Token should be invalid
      expect(isValid).toBe(false);
    });
  });
  
  describe('Token Management', () => {
    it('should refresh a token', () => {
      // Generate a token
      generateCSRFToken();
      
      // Get the original expiry
      const originalTokenData = JSON.parse(localStorage.getItem('csrf_token')!);
      const originalExpiry = originalTokenData.expiresAt;
      
      // Mock Date.now to advance time
      const now = Date.now();
      Date.now = jest.fn().mockReturnValue(now + 60 * 60 * 1000); // 1 hour later
      
      // Refresh the token
      const refreshed = refreshCSRFToken();
      
      // Refresh should succeed
      expect(refreshed).toBe(true);
      
      // Get the new expiry
      const newTokenData = JSON.parse(localStorage.getItem('csrf_token')!);
      const newExpiry = newTokenData.expiresAt;
      
      // New expiry should be later than the original
      expect(newExpiry).toBeGreaterThan(originalExpiry);
    });
    
    it('should generate a new token if none exists when refreshing', () => {
      // Clear localStorage
      localStorage.clear();
      
      // Refresh the token
      const refreshed = refreshCSRFToken();
      
      // Refresh should succeed
      expect(refreshed).toBe(true);
      
      // Token should be stored in localStorage
      const storedToken = localStorage.getItem('csrf_token');
      expect(storedToken).toBeDefined();
    });
    
    it('should clear a token', () => {
      // Generate a token
      generateCSRFToken();
      
      // Token should be stored in localStorage
      expect(localStorage.getItem('csrf_token')).toBeDefined();
      
      // Clear the token
      clearCSRFToken();
      
      // Token should be removed from localStorage
      expect(localStorage.getItem('csrf_token')).toBeNull();
    });
  });
  
  describe('Fetch Integration', () => {
    it('should add a CSRF token to fetch options', () => {
      // Generate a token
      const token = generateCSRFToken();
      
      // Create fetch options
      const options: RequestInit = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      };
      
      // Add CSRF token to options
      const updatedOptions = addCSRFTokenToFetchOptions(options);
      
      // Options should include the token
      expect(updatedOptions.headers).toBeDefined();
      expect((updatedOptions.headers as Record<string, string>)['X-CSRF-Token']).toBe(token);
      
      // Original headers should be preserved
      expect((updatedOptions.headers as Record<string, string>)['Content-Type']).toBe('application/json');
    });
    
    it('should create headers if none exist', () => {
      // Generate a token
      const token = generateCSRFToken();
      
      // Create fetch options without headers
      const options: RequestInit = {
        method: 'POST'
      };
      
      // Add CSRF token to options
      const updatedOptions = addCSRFTokenToFetchOptions(options);
      
      // Options should include the token
      expect(updatedOptions.headers).toBeDefined();
      expect((updatedOptions.headers as Record<string, string>)['X-CSRF-Token']).toBe(token);
    });
    
    it('should work with empty options', () => {
      // Generate a token
      const token = generateCSRFToken();
      
      // Add CSRF token to empty options
      const updatedOptions = addCSRFTokenToFetchOptions();
      
      // Options should include the token
      expect(updatedOptions.headers).toBeDefined();
      expect((updatedOptions.headers as Record<string, string>)['X-CSRF-Token']).toBe(token);
    });
  });
}); 