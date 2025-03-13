/**
 * Caching Utility
 * 
 * This utility provides functions to help with caching data
 * to improve performance in the application.
 */

/**
 * Cache entry with expiration
 */
interface CacheEntry<T> {
  value: T;
  expiry: number | null;
}

/**
 * In-memory cache for storing data
 */
class MemoryCache {
  private cache: Map<string, CacheEntry<any>> = new Map();
  
  /**
   * Set a value in the cache
   * 
   * @param key Cache key
   * @param value Value to cache
   * @param ttl Time to live in milliseconds (null for no expiration)
   */
  set<T>(key: string, value: T, ttl: number | null = 60 * 60 * 1000): void {
    const expiry = ttl ? Date.now() + ttl : null;
    this.cache.set(key, { value, expiry });
  }
  
  /**
   * Get a value from the cache
   * 
   * @param key Cache key
   * @returns Cached value or null if not found or expired
   */
  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    
    if (!entry) {
      return null;
    }
    
    // Check if entry has expired
    if (entry.expiry && entry.expiry < Date.now()) {
      this.cache.delete(key);
      return null;
    }
    
    return entry.value as T;
  }
  
  /**
   * Check if a key exists in the cache and is not expired
   * 
   * @param key Cache key
   * @returns Whether the key exists and is not expired
   */
  has(key: string): boolean {
    const entry = this.cache.get(key);
    
    if (!entry) {
      return false;
    }
    
    // Check if entry has expired
    if (entry.expiry && entry.expiry < Date.now()) {
      this.cache.delete(key);
      return false;
    }
    
    return true;
  }
  
  /**
   * Delete a value from the cache
   * 
   * @param key Cache key
   */
  delete(key: string): void {
    this.cache.delete(key);
  }
  
  /**
   * Clear all values from the cache
   */
  clear(): void {
    this.cache.clear();
  }
  
  /**
   * Get all keys in the cache
   * 
   * @returns Array of cache keys
   */
  keys(): string[] {
    return Array.from(this.cache.keys());
  }
  
  /**
   * Clean expired entries from the cache
   * 
   * @returns Number of entries removed
   */
  cleanExpired(): number {
    const now = Date.now();
    let count = 0;
    
    // Use Array.from to convert the iterator to an array for compatibility with older JS targets
    Array.from(this.cache.entries()).forEach(([key, entry]) => {
      if (entry.expiry && entry.expiry < now) {
        this.cache.delete(key);
        count++;
      }
    });
    
    return count;
  }
}

// Create a singleton instance of the memory cache
export const memoryCache = new MemoryCache();

/**
 * Local storage cache for storing data
 */
export class LocalStorageCache {
  private prefix: string;
  
  /**
   * Create a new local storage cache
   * 
   * @param prefix Prefix for cache keys
   */
  constructor(prefix: string = 'app_cache_') {
    this.prefix = prefix;
  }
  
  /**
   * Set a value in the cache
   * 
   * @param key Cache key
   * @param value Value to cache
   * @param ttl Time to live in milliseconds (null for no expiration)
   */
  set<T>(key: string, value: T, ttl: number | null = 60 * 60 * 1000): void {
    const expiry = ttl ? Date.now() + ttl : null;
    const cacheKey = this.prefix + key;
    
    try {
      const item = JSON.stringify({
        value,
        expiry
      });
      
      localStorage.setItem(cacheKey, item);
    } catch (error) {
      console.error('Error setting cache item:', error);
    }
  }
  
  /**
   * Get a value from the cache
   * 
   * @param key Cache key
   * @returns Cached value or null if not found or expired
   */
  get<T>(key: string): T | null {
    const cacheKey = this.prefix + key;
    
    try {
      const item = localStorage.getItem(cacheKey);
      
      if (!item) {
        return null;
      }
      
      const entry = JSON.parse(item) as CacheEntry<T>;
      
      // Check if entry has expired
      if (entry.expiry && entry.expiry < Date.now()) {
        localStorage.removeItem(cacheKey);
        return null;
      }
      
      return entry.value;
    } catch (error) {
      console.error('Error getting cache item:', error);
      return null;
    }
  }
  
  /**
   * Check if a key exists in the cache and is not expired
   * 
   * @param key Cache key
   * @returns Whether the key exists and is not expired
   */
  has(key: string): boolean {
    return this.get(key) !== null;
  }
  
  /**
   * Delete a value from the cache
   * 
   * @param key Cache key
   */
  delete(key: string): void {
    const cacheKey = this.prefix + key;
    localStorage.removeItem(cacheKey);
  }
  
  /**
   * Clear all values from the cache with this prefix
   */
  clear(): void {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      
      if (key && key.startsWith(this.prefix)) {
        localStorage.removeItem(key);
      }
    }
  }
  
  /**
   * Get all keys in the cache with this prefix
   * 
   * @returns Array of cache keys (without prefix)
   */
  keys(): string[] {
    const keys: string[] = [];
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      
      if (key && key.startsWith(this.prefix)) {
        keys.push(key.substring(this.prefix.length));
      }
    }
    
    return keys;
  }
  
  /**
   * Clean expired entries from the cache
   * 
   * @returns Number of entries removed
   */
  cleanExpired(): number {
    let count = 0;
    const now = Date.now();
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      
      if (key && key.startsWith(this.prefix)) {
        try {
          const item = localStorage.getItem(key);
          
          if (item) {
            const entry = JSON.parse(item) as CacheEntry<any>;
            
            if (entry.expiry && entry.expiry < now) {
              localStorage.removeItem(key);
              count++;
            }
          }
        } catch (error) {
          // If we can't parse the item, remove it
          localStorage.removeItem(key);
          count++;
        }
      }
    }
    
    return count;
  }
}

// Create a singleton instance of the local storage cache
export const localStorageCache = new LocalStorageCache();

/**
 * Memoize a function to cache its results
 * 
 * @param fn Function to memoize
 * @param getKey Function to generate a cache key from arguments
 * @param ttl Time to live in milliseconds (null for no expiration)
 * @returns Memoized function
 */
export function memoize<T extends (...args: any[]) => any>(
  fn: T,
  getKey: (...args: Parameters<T>) => string = (...args) => JSON.stringify(args),
  ttl: number | null = 60 * 60 * 1000
): (...args: Parameters<T>) => ReturnType<T> {
  return (...args: Parameters<T>): ReturnType<T> => {
    const key = getKey(...args);
    const cached = memoryCache.get<ReturnType<T>>(key);
    
    if (cached !== null) {
      return cached;
    }
    
    const result = fn(...args);
    
    // Handle promises
    if (result instanceof Promise) {
      return result.then(value => {
        memoryCache.set(key, value, ttl);
        return value;
      }) as ReturnType<T>;
    }
    
    memoryCache.set(key, result, ttl);
    return result;
  };
}

/**
 * Example usage:
 * 
 * // Use memory cache
 * memoryCache.set('user', userData, 30 * 60 * 1000); // Cache for 30 minutes
 * const user = memoryCache.get('user');
 * 
 * // Use local storage cache
 * localStorageCache.set('preferences', userPreferences);
 * const preferences = localStorageCache.get('preferences');
 * 
 * // Memoize a function
 * const expensiveCalculation = memoize(
 *   (a, b) => {
 *     console.log('Calculating...');
 *     return a + b;
 *   },
 *   (a, b) => `sum_${a}_${b}`,
 *   5 * 60 * 1000 // Cache for 5 minutes
 * );
 * 
 * expensiveCalculation(1, 2); // Logs "Calculating..." and returns 3
 * expensiveCalculation(1, 2); // Returns 3 from cache without logging
 */ 