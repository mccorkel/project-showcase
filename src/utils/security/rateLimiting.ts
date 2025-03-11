/**
 * Rate Limiting Utility
 * 
 * This utility provides functions to help with rate limiting API requests
 * to prevent abuse and brute force attacks.
 */

/**
 * Rate limit configuration
 */
interface RateLimitConfig {
  /**
   * Maximum number of requests allowed in the time window
   */
  maxRequests: number;
  
  /**
   * Time window in milliseconds
   */
  windowMs: number;
  
  /**
   * Whether to include the user ID in the rate limit key
   */
  includeUserId?: boolean;
  
  /**
   * Whether to include the IP address in the rate limit key
   */
  includeIp?: boolean;
  
  /**
   * Whether to include the endpoint path in the rate limit key
   */
  includeEndpoint?: boolean;
}

/**
 * Rate limit entry
 */
interface RateLimitEntry {
  /**
   * Number of requests made
   */
  count: number;
  
  /**
   * Timestamp when the window resets
   */
  resetAt: number;
}

/**
 * Default rate limit configuration
 */
const DEFAULT_CONFIG: RateLimitConfig = {
  maxRequests: 100,
  windowMs: 60 * 60 * 1000, // 1 hour
  includeUserId: true,
  includeIp: true,
  includeEndpoint: true
};

/**
 * In-memory store for rate limit entries
 */
class RateLimitStore {
  private store: Map<string, RateLimitEntry> = new Map();
  
  /**
   * Get a rate limit entry
   * 
   * @param key Rate limit key
   * @returns Rate limit entry or null if not found
   */
  get(key: string): RateLimitEntry | null {
    const entry = this.store.get(key);
    
    if (!entry) {
      return null;
    }
    
    // Check if the entry has expired
    if (entry.resetAt < Date.now()) {
      this.store.delete(key);
      return null;
    }
    
    return entry;
  }
  
  /**
   * Set a rate limit entry
   * 
   * @param key Rate limit key
   * @param entry Rate limit entry
   */
  set(key: string, entry: RateLimitEntry): void {
    this.store.set(key, entry);
  }
  
  /**
   * Increment a rate limit entry
   * 
   * @param key Rate limit key
   * @param windowMs Time window in milliseconds
   * @returns Updated rate limit entry
   */
  increment(key: string, windowMs: number): RateLimitEntry {
    const entry = this.get(key);
    
    if (!entry) {
      // Create a new entry
      const newEntry: RateLimitEntry = {
        count: 1,
        resetAt: Date.now() + windowMs
      };
      
      this.set(key, newEntry);
      return newEntry;
    }
    
    // Increment the existing entry
    entry.count += 1;
    this.set(key, entry);
    
    return entry;
  }
  
  /**
   * Reset a rate limit entry
   * 
   * @param key Rate limit key
   */
  reset(key: string): void {
    this.store.delete(key);
  }
  
  /**
   * Clean expired entries
   * 
   * @returns Number of entries removed
   */
  cleanExpired(): number {
    const now = Date.now();
    let count = 0;
    
    for (const [key, entry] of this.store.entries()) {
      if (entry.resetAt < now) {
        this.store.delete(key);
        count++;
      }
    }
    
    return count;
  }
}

// Create a singleton instance of the rate limit store
const rateLimitStore = new RateLimitStore();

// Set up a cleanup interval
setInterval(() => {
  rateLimitStore.cleanExpired();
}, 60 * 60 * 1000); // Clean up every hour

/**
 * Generate a rate limit key
 * 
 * @param userId User ID
 * @param ip IP address
 * @param endpoint Endpoint path
 * @param config Rate limit configuration
 * @returns Rate limit key
 */
export function generateRateLimitKey(
  userId: string | null,
  ip: string,
  endpoint: string,
  config: RateLimitConfig = DEFAULT_CONFIG
): string {
  const parts: string[] = [];
  
  if (config.includeUserId && userId) {
    parts.push(`user:${userId}`);
  }
  
  if (config.includeIp) {
    parts.push(`ip:${ip}`);
  }
  
  if (config.includeEndpoint) {
    parts.push(`endpoint:${endpoint}`);
  }
  
  return parts.join(':');
}

/**
 * Check if a request is rate limited
 * 
 * @param userId User ID
 * @param ip IP address
 * @param endpoint Endpoint path
 * @param config Rate limit configuration
 * @returns Whether the request is rate limited and rate limit information
 */
export function checkRateLimit(
  userId: string | null,
  ip: string,
  endpoint: string,
  config: RateLimitConfig = DEFAULT_CONFIG
): {
  limited: boolean;
  remaining: number;
  resetAt: number;
  key: string;
} {
  // Generate a key for the rate limit
  const key = generateRateLimitKey(userId, ip, endpoint, config);
  
  // Get the current entry or create a new one
  const entry = rateLimitStore.increment(key, config.windowMs);
  
  // Check if the request is rate limited
  const limited = entry.count > config.maxRequests;
  
  // Calculate remaining requests
  const remaining = Math.max(0, config.maxRequests - entry.count);
  
  return {
    limited,
    remaining,
    resetAt: entry.resetAt,
    key
  };
}

/**
 * Reset a rate limit
 * 
 * @param userId User ID
 * @param ip IP address
 * @param endpoint Endpoint path
 * @param config Rate limit configuration
 */
export function resetRateLimit(
  userId: string | null,
  ip: string,
  endpoint: string,
  config: RateLimitConfig = DEFAULT_CONFIG
): void {
  const key = generateRateLimitKey(userId, ip, endpoint, config);
  rateLimitStore.reset(key);
}

/**
 * Create rate limit headers
 * 
 * @param rateLimitInfo Rate limit information
 * @returns Headers for the rate limit
 */
export function createRateLimitHeaders(
  rateLimitInfo: {
    remaining: number;
    resetAt: number;
  }
): Record<string, string> {
  return {
    'X-RateLimit-Remaining': rateLimitInfo.remaining.toString(),
    'X-RateLimit-Reset': Math.ceil(rateLimitInfo.resetAt / 1000).toString()
  };
}

/**
 * Create a rate limiter function for API endpoints
 * 
 * @param config Rate limit configuration
 * @returns Rate limiter function
 */
export function createRateLimiter(
  config: Partial<RateLimitConfig> = {}
): (userId: string | null, ip: string, endpoint: string) => {
  limited: boolean;
  headers: Record<string, string>;
} {
  // Merge with default config
  const mergedConfig: RateLimitConfig = {
    ...DEFAULT_CONFIG,
    ...config
  };
  
  return (userId: string | null, ip: string, endpoint: string) => {
    const rateLimitInfo = checkRateLimit(userId, ip, endpoint, mergedConfig);
    
    return {
      limited: rateLimitInfo.limited,
      headers: createRateLimitHeaders(rateLimitInfo)
    };
  };
}

/**
 * Create rate limit configurations for different endpoints
 */
export const rateLimitConfigs = {
  /**
   * Rate limit for login attempts (5 per minute)
   */
  login: {
    maxRequests: 5,
    windowMs: 60 * 1000, // 1 minute
    includeUserId: false,
    includeIp: true,
    includeEndpoint: true
  },
  
  /**
   * Rate limit for password reset requests (3 per hour)
   */
  passwordReset: {
    maxRequests: 3,
    windowMs: 60 * 60 * 1000, // 1 hour
    includeUserId: false,
    includeIp: true,
    includeEndpoint: true
  },
  
  /**
   * Rate limit for API requests (100 per minute)
   */
  api: {
    maxRequests: 100,
    windowMs: 60 * 1000, // 1 minute
    includeUserId: true,
    includeIp: true,
    includeEndpoint: true
  },
  
  /**
   * Rate limit for public API requests (30 per minute)
   */
  publicApi: {
    maxRequests: 30,
    windowMs: 60 * 1000, // 1 minute
    includeUserId: false,
    includeIp: true,
    includeEndpoint: true
  }
};

/**
 * Create rate limiters for different endpoints
 */
export const rateLimiters = {
  login: createRateLimiter(rateLimitConfigs.login),
  passwordReset: createRateLimiter(rateLimitConfigs.passwordReset),
  api: createRateLimiter(rateLimitConfigs.api),
  publicApi: createRateLimiter(rateLimitConfigs.publicApi)
};

/**
 * Example usage:
 * 
 * // Check if a login request is rate limited
 * const loginRateLimit = rateLimiters.login(null, '127.0.0.1', '/api/login');
 * 
 * if (loginRateLimit.limited) {
 *   // Return a 429 Too Many Requests response
 *   return {
 *     status: 429,
 *     headers: loginRateLimit.headers,
 *     body: { error: 'Too many login attempts. Please try again later.' }
 *   };
 * }
 * 
 * // Check if an API request is rate limited
 * const apiRateLimit = rateLimiters.api('user-123', '127.0.0.1', '/api/data');
 * 
 * if (apiRateLimit.limited) {
 *   // Return a 429 Too Many Requests response
 *   return {
 *     status: 429,
 *     headers: apiRateLimit.headers,
 *     body: { error: 'Rate limit exceeded. Please try again later.' }
 *   };
 * }
 */ 