/**
 * Session Management Utility
 * 
 * This utility provides functions to manage user sessions, including
 * session timeouts and account lockouts.
 */

import { logLogin, logLogout, AuditResourceType } from './auditLogger';

// Session storage keys
const SESSION_TOKEN_KEY = 'session_token';
const SESSION_EXPIRY_KEY = 'session_expiry';
const LAST_ACTIVITY_KEY = 'last_activity';
const SESSION_ID_KEY = 'session_id';
const USER_ID_KEY = 'user_id';
const USER_EMAIL_KEY = 'user_email';
const USER_ROLE_KEY = 'user_role';
const FAILED_LOGIN_COUNT_KEY = 'failed_login_count';
const ACCOUNT_LOCKOUT_EXPIRY_KEY = 'account_lockout_expiry';

// Default session timeout in milliseconds (60 minutes)
const DEFAULT_SESSION_TIMEOUT = 60 * 60 * 1000;

// Default account lockout threshold (5 failed attempts)
const DEFAULT_LOCKOUT_THRESHOLD = 5;

// Default account lockout duration in milliseconds (30 minutes)
const DEFAULT_LOCKOUT_DURATION = 30 * 60 * 1000;

// Interface for session configuration
export interface SessionConfig {
  sessionTimeout?: number;
  lockoutThreshold?: number;
  lockoutDuration?: number;
}

// Interface for session information
export interface SessionInfo {
  sessionId: string;
  userId: string;
  userEmail: string;
  userRole: string;
  expiresAt: Date;
  lastActivity: Date;
}

// Interface for login result
export interface LoginResult {
  success: boolean;
  message: string;
  sessionInfo?: SessionInfo;
}

/**
 * Initialize the session manager with configuration
 * 
 * @param config Session configuration
 */
export function initSessionManager(config?: SessionConfig): void {
  // Store configuration in localStorage
  if (config?.sessionTimeout) {
    localStorage.setItem('session_timeout', config.sessionTimeout.toString());
  }
  if (config?.lockoutThreshold) {
    localStorage.setItem('lockout_threshold', config.lockoutThreshold.toString());
  }
  if (config?.lockoutDuration) {
    localStorage.setItem('lockout_duration', config.lockoutDuration.toString());
  }
}

/**
 * Get the session timeout value
 * 
 * @returns Session timeout in milliseconds
 */
export function getSessionTimeout(): number {
  const timeout = localStorage.getItem('session_timeout');
  return timeout ? parseInt(timeout) : DEFAULT_SESSION_TIMEOUT;
}

/**
 * Get the lockout threshold value
 * 
 * @returns Lockout threshold (number of failed attempts)
 */
export function getLockoutThreshold(): number {
  const threshold = localStorage.getItem('lockout_threshold');
  return threshold ? parseInt(threshold) : DEFAULT_LOCKOUT_THRESHOLD;
}

/**
 * Get the lockout duration value
 * 
 * @returns Lockout duration in milliseconds
 */
export function getLockoutDuration(): number {
  const duration = localStorage.getItem('lockout_duration');
  return duration ? parseInt(duration) : DEFAULT_LOCKOUT_DURATION;
}

/**
 * Check if a user account is locked out
 * 
 * @param email User email
 * @returns Whether the account is locked out
 */
export function isAccountLockedOut(email: string): boolean {
  const lockoutExpiry = localStorage.getItem(`${ACCOUNT_LOCKOUT_EXPIRY_KEY}_${email}`);
  if (!lockoutExpiry) {
    return false;
  }
  
  const expiryTime = parseInt(lockoutExpiry);
  return expiryTime > Date.now();
}

/**
 * Get the remaining lockout time for an account
 * 
 * @param email User email
 * @returns Remaining lockout time in milliseconds, or 0 if not locked out
 */
export function getRemainingLockoutTime(email: string): number {
  const lockoutExpiry = localStorage.getItem(`${ACCOUNT_LOCKOUT_EXPIRY_KEY}_${email}`);
  if (!lockoutExpiry) {
    return 0;
  }
  
  const expiryTime = parseInt(lockoutExpiry);
  const remaining = expiryTime - Date.now();
  return remaining > 0 ? remaining : 0;
}

/**
 * Record a failed login attempt
 * 
 * @param email User email
 * @param ipAddress User IP address
 * @param userAgent User agent
 * @returns Whether the account is now locked out
 */
export function recordFailedLogin(email: string, ipAddress: string, userAgent: string): boolean {
  // Check if account is already locked out
  if (isAccountLockedOut(email)) {
    // Log the failed login attempt
    logLogin('unknown', email, ipAddress, userAgent, false, 'Account is locked out');
    return true;
  }
  
  // Get current failed login count
  const countKey = `${FAILED_LOGIN_COUNT_KEY}_${email}`;
  const currentCount = localStorage.getItem(countKey);
  const failedCount = currentCount ? parseInt(currentCount) + 1 : 1;
  
  // Update failed login count
  localStorage.setItem(countKey, failedCount.toString());
  
  // Log the failed login attempt
  logLogin('unknown', email, ipAddress, userAgent, false, `Failed login attempt ${failedCount}`);
  
  // Check if account should be locked out
  if (failedCount >= getLockoutThreshold()) {
    const lockoutExpiry = Date.now() + getLockoutDuration();
    localStorage.setItem(`${ACCOUNT_LOCKOUT_EXPIRY_KEY}_${email}`, lockoutExpiry.toString());
    
    // Log the account lockout
    logLogin('unknown', email, ipAddress, userAgent, false, `Account locked out after ${failedCount} failed attempts`);
    
    return true;
  }
  
  return false;
}

/**
 * Reset failed login count for an account
 * 
 * @param email User email
 */
export function resetFailedLoginCount(email: string): void {
  localStorage.removeItem(`${FAILED_LOGIN_COUNT_KEY}_${email}`);
  localStorage.removeItem(`${ACCOUNT_LOCKOUT_EXPIRY_KEY}_${email}`);
}

/**
 * Create a new session for a user
 * 
 * @param userId User ID
 * @param userEmail User email
 * @param userRole User role
 * @param ipAddress User IP address
 * @param userAgent User agent
 * @returns Session information
 */
export function createSession(
  userId: string,
  userEmail: string,
  userRole: string,
  ipAddress: string,
  userAgent: string
): SessionInfo {
  // Generate a session ID
  const sessionId = `session-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
  
  // Calculate expiry time
  const expiresAt = new Date(Date.now() + getSessionTimeout());
  
  // Create session information
  const sessionInfo: SessionInfo = {
    sessionId,
    userId,
    userEmail,
    userRole,
    expiresAt,
    lastActivity: new Date()
  };
  
  // Store session information in localStorage
  localStorage.setItem(SESSION_ID_KEY, sessionId);
  localStorage.setItem(USER_ID_KEY, userId);
  localStorage.setItem(USER_EMAIL_KEY, userEmail);
  localStorage.setItem(USER_ROLE_KEY, userRole);
  localStorage.setItem(SESSION_EXPIRY_KEY, expiresAt.getTime().toString());
  localStorage.setItem(LAST_ACTIVITY_KEY, Date.now().toString());
  
  // Reset failed login count
  resetFailedLoginCount(userEmail);
  
  // Log the successful login
  logLogin(userId, userEmail, ipAddress, userAgent, true);
  
  return sessionInfo;
}

/**
 * Get the current session information
 * 
 * @returns Session information or null if no session exists
 */
export function getCurrentSession(): SessionInfo | null {
  const sessionId = localStorage.getItem(SESSION_ID_KEY);
  const userId = localStorage.getItem(USER_ID_KEY);
  const userEmail = localStorage.getItem(USER_EMAIL_KEY);
  const userRole = localStorage.getItem(USER_ROLE_KEY);
  const expiryTime = localStorage.getItem(SESSION_EXPIRY_KEY);
  const lastActivity = localStorage.getItem(LAST_ACTIVITY_KEY);
  
  if (!sessionId || !userId || !userEmail || !userRole || !expiryTime || !lastActivity) {
    return null;
  }
  
  return {
    sessionId,
    userId,
    userEmail,
    userRole,
    expiresAt: new Date(parseInt(expiryTime)),
    lastActivity: new Date(parseInt(lastActivity))
  };
}

/**
 * Check if the current session is valid
 * 
 * @returns Whether the session is valid
 */
export function isSessionValid(): boolean {
  const session = getCurrentSession();
  if (!session) {
    return false;
  }
  
  // Check if session has expired
  if (session.expiresAt.getTime() < Date.now()) {
    return false;
  }
  
  // Check if session has been inactive for too long
  const lastActivity = new Date(parseInt(localStorage.getItem(LAST_ACTIVITY_KEY) || '0'));
  const inactiveTime = Date.now() - lastActivity.getTime();
  if (inactiveTime > getSessionTimeout()) {
    return false;
  }
  
  return true;
}

/**
 * Update the last activity timestamp for the current session
 */
export function updateLastActivity(): void {
  if (isSessionValid()) {
    localStorage.setItem(LAST_ACTIVITY_KEY, Date.now().toString());
  }
}

/**
 * Extend the current session
 * 
 * @returns Whether the session was extended
 */
export function extendSession(): boolean {
  if (!isSessionValid()) {
    return false;
  }
  
  // Calculate new expiry time
  const expiresAt = new Date(Date.now() + getSessionTimeout());
  
  // Update session expiry
  localStorage.setItem(SESSION_EXPIRY_KEY, expiresAt.getTime().toString());
  
  // Update last activity
  updateLastActivity();
  
  return true;
}

/**
 * End the current session
 * 
 * @param ipAddress User IP address
 * @param userAgent User agent
 */
export function endSession(ipAddress: string, userAgent: string): void {
  const session = getCurrentSession();
  if (session) {
    // Log the logout
    logLogout(session.userId, session.userEmail, ipAddress, userAgent, session.sessionId);
  }
  
  // Clear session information from localStorage
  localStorage.removeItem(SESSION_ID_KEY);
  localStorage.removeItem(USER_ID_KEY);
  localStorage.removeItem(USER_EMAIL_KEY);
  localStorage.removeItem(USER_ROLE_KEY);
  localStorage.removeItem(SESSION_EXPIRY_KEY);
  localStorage.removeItem(LAST_ACTIVITY_KEY);
}

/**
 * Attempt to log in a user
 * 
 * @param email User email
 * @param password User password
 * @param ipAddress User IP address
 * @param userAgent User agent
 * @returns Login result
 */
export async function login(
  email: string,
  password: string,
  ipAddress: string,
  userAgent: string
): Promise<LoginResult> {
  // Check if account is locked out
  if (isAccountLockedOut(email)) {
    const remainingTime = getRemainingLockoutTime(email);
    const minutes = Math.ceil(remainingTime / (60 * 1000));
    
    return {
      success: false,
      message: `Account is locked out. Please try again in ${minutes} minute${minutes === 1 ? '' : 's'}.`
    };
  }
  
  try {
    // In a real implementation, this would be an API call to authenticate the user
    // For example:
    // const response = await Auth.signIn(email, password);
    // const userId = response.attributes.sub;
    // const userRole = await getUserRole(userId);
    
    // For now, we'll simulate a successful login for 'admin@example.com' with password 'password'
    if (email === 'admin@example.com' && password === 'password') {
      const userId = 'user-1';
      const userRole = 'admin';
      
      // Create a new session
      const sessionInfo = createSession(userId, email, userRole, ipAddress, userAgent);
      
      return {
        success: true,
        message: 'Login successful',
        sessionInfo
      };
    }
    
    // Simulate a failed login for any other credentials
    const isLockedOut = recordFailedLogin(email, ipAddress, userAgent);
    if (isLockedOut) {
      const remainingTime = getRemainingLockoutTime(email);
      const minutes = Math.ceil(remainingTime / (60 * 1000));
      
      return {
        success: false,
        message: `Account is locked out. Please try again in ${minutes} minute${minutes === 1 ? '' : 's'}.`
      };
    }
    
    return {
      success: false,
      message: 'Invalid email or password'
    };
  } catch (error) {
    console.error('Error during login:', error);
    
    // Record failed login
    recordFailedLogin(email, ipAddress, userAgent);
    
    return {
      success: false,
      message: 'An error occurred during login. Please try again.'
    };
  }
}

/**
 * Log out the current user
 * 
 * @param ipAddress User IP address
 * @param userAgent User agent
 */
export function logout(ipAddress: string, userAgent: string): void {
  endSession(ipAddress, userAgent);
}

/**
 * Set up session timeout monitoring
 * 
 * @param onTimeout Callback function to execute when session times out
 * @param checkInterval Interval in milliseconds to check session validity (default: 1 minute)
 * @returns Cleanup function to stop monitoring
 */
export function setupSessionTimeoutMonitoring(
  onTimeout: () => void,
  checkInterval: number = 60 * 1000
): () => void {
  // Set up interval to check session validity
  const intervalId = setInterval(() => {
    if (!isSessionValid()) {
      // Session has timed out
      onTimeout();
      
      // Clear session information
      const session = getCurrentSession();
      if (session) {
        endSession('unknown', 'session-timeout');
      }
    }
  }, checkInterval);
  
  // Set up activity listeners
  const activityEvents = ['mousedown', 'keydown', 'touchstart', 'scroll'];
  const activityHandler = () => {
    updateLastActivity();
  };
  
  // Add activity listeners
  activityEvents.forEach(event => {
    window.addEventListener(event, activityHandler);
  });
  
  // Return cleanup function
  return () => {
    clearInterval(intervalId);
    activityEvents.forEach(event => {
      window.removeEventListener(event, activityHandler);
    });
  };
} 