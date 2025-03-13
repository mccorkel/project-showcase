import {
  initSessionManager,
  getSessionTimeout,
  getLockoutThreshold,
  getLockoutDuration,
  isAccountLockedOut,
  getRemainingLockoutTime,
  recordFailedLogin,
  resetFailedLoginCount,
  createSession,
  getCurrentSession,
  isSessionValid,
  updateLastActivity,
  extendSession,
  endSession
} from '../sessionManager';

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

describe('Session Manager', () => {
  // Setup and teardown
  beforeEach(() => {
    // Mock localStorage
    Object.defineProperty(window, 'localStorage', { value: localStorageMock });
    localStorageMock.clear();
    
    // Reset Date.now mock
    Date.now = originalDateNow;
    
    // Initialize session manager with default settings
    initSessionManager();
  });
  
  afterEach(() => {
    // Restore Date.now
    Date.now = originalDateNow;
  });
  
  describe('Configuration', () => {
    it('should initialize with default values', () => {
      expect(getSessionTimeout()).toBe(60 * 60 * 1000); // 60 minutes
      expect(getLockoutThreshold()).toBe(5); // 5 attempts
      expect(getLockoutDuration()).toBe(30 * 60 * 1000); // 30 minutes
    });
    
    it('should allow custom configuration', () => {
      initSessionManager({
        sessionTimeout: 30 * 60 * 1000, // 30 minutes
        lockoutThreshold: 3, // 3 attempts
        lockoutDuration: 15 * 60 * 1000 // 15 minutes
      });
      
      expect(getSessionTimeout()).toBe(30 * 60 * 1000);
      expect(getLockoutThreshold()).toBe(3);
      expect(getLockoutDuration()).toBe(15 * 60 * 1000);
    });
  });
  
  describe('Account Lockout', () => {
    it('should track failed login attempts', () => {
      const email = 'test@example.com';
      const ipAddress = '127.0.0.1';
      const userAgent = 'test-agent';
      
      // First attempt should not lock the account
      const firstAttempt = recordFailedLogin(email, ipAddress, userAgent);
      expect(firstAttempt).toBe(false);
      expect(isAccountLockedOut(email)).toBe(false);
      
      // Record more failed attempts
      recordFailedLogin(email, ipAddress, userAgent);
      recordFailedLogin(email, ipAddress, userAgent);
      recordFailedLogin(email, ipAddress, userAgent);
      
      // Fifth attempt should lock the account
      const fifthAttempt = recordFailedLogin(email, ipAddress, userAgent);
      expect(fifthAttempt).toBe(true);
      expect(isAccountLockedOut(email)).toBe(true);
    });
    
    it('should reset failed login count', () => {
      const email = 'test@example.com';
      const ipAddress = '127.0.0.1';
      const userAgent = 'test-agent';
      
      // Record failed attempts
      recordFailedLogin(email, ipAddress, userAgent);
      recordFailedLogin(email, ipAddress, userAgent);
      
      // Reset failed login count
      resetFailedLoginCount(email);
      
      // Account should not be locked
      expect(isAccountLockedOut(email)).toBe(false);
      
      // Next attempt should not lock the account
      const nextAttempt = recordFailedLogin(email, ipAddress, userAgent);
      expect(nextAttempt).toBe(false);
    });
    
    it('should calculate remaining lockout time', () => {
      const email = 'test@example.com';
      const ipAddress = '127.0.0.1';
      const userAgent = 'test-agent';
      
      // Mock Date.now to control time
      const now = Date.now();
      Date.now = jest.fn().mockReturnValue(now);
      
      // Lock the account
      for (let i = 0; i < 5; i++) {
        recordFailedLogin(email, ipAddress, userAgent);
      }
      
      // Account should be locked
      expect(isAccountLockedOut(email)).toBe(true);
      
      // Remaining time should be close to lockout duration
      const remainingTime = getRemainingLockoutTime(email);
      expect(remainingTime).toBeGreaterThan(0);
      expect(remainingTime).toBeLessThanOrEqual(getLockoutDuration());
      
      // Advance time by half the lockout duration
      Date.now = jest.fn().mockReturnValue(now + getLockoutDuration() / 2);
      
      // Remaining time should be about half the lockout duration
      const halfRemainingTime = getRemainingLockoutTime(email);
      expect(halfRemainingTime).toBeGreaterThan(0);
      expect(halfRemainingTime).toBeLessThanOrEqual(getLockoutDuration() / 2);
      
      // Advance time past the lockout duration
      Date.now = jest.fn().mockReturnValue(now + getLockoutDuration() + 1000);
      
      // Account should no longer be locked
      expect(isAccountLockedOut(email)).toBe(false);
      expect(getRemainingLockoutTime(email)).toBe(0);
    });
  });
  
  describe('Session Management', () => {
    it('should create and retrieve a session', () => {
      const userId = 'user-1';
      const userEmail = 'user@example.com';
      const userRole = 'admin';
      const ipAddress = '127.0.0.1';
      const userAgent = 'test-agent';
      
      // Create a session
      const session = createSession(userId, userEmail, userRole, ipAddress, userAgent);
      
      // Session should have the correct properties
      expect(session.userId).toBe(userId);
      expect(session.userEmail).toBe(userEmail);
      expect(session.userRole).toBe(userRole);
      expect(session.sessionId).toBeDefined();
      expect(session.expiresAt).toBeDefined();
      expect(session.lastActivity).toBeDefined();
      
      // Get the current session
      const currentSession = getCurrentSession();
      
      // Current session should match the created session
      expect(currentSession).not.toBeNull();
      expect(currentSession?.userId).toBe(userId);
      expect(currentSession?.userEmail).toBe(userEmail);
      expect(currentSession?.userRole).toBe(userRole);
      expect(currentSession?.sessionId).toBe(session.sessionId);
    });
    
    it('should validate session expiry', () => {
      const userId = 'user-1';
      const userEmail = 'user@example.com';
      const userRole = 'admin';
      const ipAddress = '127.0.0.1';
      const userAgent = 'test-agent';
      
      // Mock Date.now to control time
      const now = Date.now();
      Date.now = jest.fn().mockReturnValue(now);
      
      // Create a session
      createSession(userId, userEmail, userRole, ipAddress, userAgent);
      
      // Session should be valid
      expect(isSessionValid()).toBe(true);
      
      // Advance time past the session timeout
      Date.now = jest.fn().mockReturnValue(now + getSessionTimeout() + 1000);
      
      // Session should be invalid
      expect(isSessionValid()).toBe(false);
    });
    
    it('should update last activity', () => {
      const userId = 'user-1';
      const userEmail = 'user@example.com';
      const userRole = 'admin';
      const ipAddress = '127.0.0.1';
      const userAgent = 'test-agent';
      
      // Mock Date.now to control time
      const now = Date.now();
      Date.now = jest.fn().mockReturnValue(now);
      
      // Create a session
      createSession(userId, userEmail, userRole, ipAddress, userAgent);
      
      // Advance time
      const laterTime = now + 10 * 60 * 1000; // 10 minutes later
      Date.now = jest.fn().mockReturnValue(laterTime);
      
      // Update last activity
      updateLastActivity();
      
      // Get the current session
      const currentSession = getCurrentSession();
      
      // Last activity should be updated
      expect(currentSession).not.toBeNull();
      expect(currentSession?.lastActivity.getTime()).toBe(laterTime);
    });
    
    it('should extend session', () => {
      const userId = 'user-1';
      const userEmail = 'user@example.com';
      const userRole = 'admin';
      const ipAddress = '127.0.0.1';
      const userAgent = 'test-agent';
      
      // Mock Date.now to control time
      const now = Date.now();
      Date.now = jest.fn().mockReturnValue(now);
      
      // Create a session
      createSession(userId, userEmail, userRole, ipAddress, userAgent);
      
      // Get the original expiry time
      const originalSession = getCurrentSession();
      const originalExpiry = originalSession?.expiresAt.getTime();
      
      // Advance time
      const laterTime = now + 10 * 60 * 1000; // 10 minutes later
      Date.now = jest.fn().mockReturnValue(laterTime);
      
      // Extend the session
      const extended = extendSession();
      expect(extended).toBe(true);
      
      // Get the updated session
      const updatedSession = getCurrentSession();
      const updatedExpiry = updatedSession?.expiresAt.getTime();
      
      // Expiry time should be extended
      expect(updatedExpiry).toBeGreaterThan(originalExpiry!);
      expect(updatedExpiry).toBe(laterTime + getSessionTimeout());
    });
    
    it('should end session', () => {
      const userId = 'user-1';
      const userEmail = 'user@example.com';
      const userRole = 'admin';
      const ipAddress = '127.0.0.1';
      const userAgent = 'test-agent';
      
      // Create a session
      createSession(userId, userEmail, userRole, ipAddress, userAgent);
      
      // Session should exist
      expect(getCurrentSession()).not.toBeNull();
      
      // End the session
      endSession(ipAddress, userAgent);
      
      // Session should be null
      expect(getCurrentSession()).toBeNull();
    });
  });
}); 