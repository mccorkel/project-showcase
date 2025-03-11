/**
 * Lazy Loading Utility
 * 
 * This utility provides functions to help with lazy loading components
 * and implementing code splitting in the application.
 */

import React, { lazy, Suspense } from 'react';

/**
 * Creates a lazy-loaded component with a fallback loading state
 * 
 * @param importFunc Function that imports the component
 * @param fallback Fallback component to show while loading
 * @returns Lazy-loaded component wrapped in Suspense
 */
export function lazyLoad<T extends React.ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>,
  fallback: React.ReactNode = <DefaultLoadingFallback />
): React.FC<React.ComponentProps<T>> {
  const LazyComponent = lazy(importFunc);
  
  return (props: React.ComponentProps<T>) => (
    <Suspense fallback={fallback}>
      <LazyComponent {...props} />
    </Suspense>
  );
}

/**
 * Default loading fallback component
 */
export function DefaultLoadingFallback(): JSX.Element {
  return (
    <div className="flex items-center justify-center h-full w-full min-h-[200px]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );
}

/**
 * Creates a lazy-loaded route component
 * 
 * @param importFunc Function that imports the component
 * @returns Lazy-loaded component for use in routes
 */
export function lazyLoadRoute<T extends React.ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>
): React.FC<React.ComponentProps<T>> {
  return lazyLoad(importFunc, <RouteLoadingFallback />);
}

/**
 * Route loading fallback component
 */
export function RouteLoadingFallback(): JSX.Element {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mb-4"></div>
      <p className="text-gray-600">Loading page...</p>
    </div>
  );
}

/**
 * Creates a lazy-loaded modal component
 * 
 * @param importFunc Function that imports the component
 * @returns Lazy-loaded component for use in modals
 */
export function lazyLoadModal<T extends React.ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>
): React.FC<React.ComponentProps<T>> {
  return lazyLoad(importFunc, <ModalLoadingFallback />);
}

/**
 * Modal loading fallback component
 */
export function ModalLoadingFallback(): JSX.Element {
  return (
    <div className="flex items-center justify-center h-full w-full min-h-[300px]">
      <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500 mb-2"></div>
      <p className="text-gray-600 text-sm">Loading...</p>
    </div>
  );
}

/**
 * Prefetches a component to improve perceived performance
 * 
 * @param importFunc Function that imports the component
 */
export function prefetchComponent<T extends React.ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>
): void {
  // Start loading the component in the background
  importFunc().catch(() => {
    // Silently catch any errors during prefetching
    // This is just a performance optimization, so we don't want to
    // surface errors to the user if prefetching fails
  });
}

/**
 * Example usage:
 * 
 * // Define lazy-loaded components
 * const LazyDashboard = lazyLoadRoute(() => import('../pages/Dashboard'));
 * const LazyProfileModal = lazyLoadModal(() => import('../components/ProfileModal'));
 * 
 * // Use in routes
 * <Route path="/dashboard" element={<LazyDashboard />} />
 * 
 * // Prefetch on hover or other trigger
 * const handleHover = () => {
 *   prefetchComponent(() => import('../pages/Dashboard'));
 * };
 */ 