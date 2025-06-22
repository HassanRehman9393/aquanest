import { useEffect, useState, useCallback, useMemo } from 'react';

/**
 * Hook for optimizing component performance with debouncing and lazy loading
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

/**
 * Hook for lazy loading components based on intersection observer
 */
export function useLazyLoad(threshold = 0.1) {
  const [isVisible, setIsVisible] = useState(false);
  const [element, setElement] = useState<Element | null>(null);

  const observer = useMemo(
    () =>
      typeof window !== 'undefined'
        ? new IntersectionObserver(
            ([entry]) => {
              if (entry.isIntersecting) {
                setIsVisible(true);
              }
            },
            { threshold }
          )
        : null,
    [threshold]
  );

  useEffect(() => {
    if (!observer || !element) return;

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [observer, element]);

  const ref = useCallback((node: Element | null) => {
    setElement(node);
  }, []);

  return { ref, isVisible };
}

/**
 * Hook for performance monitoring
 */
export function usePerformanceMonitor(componentName: string) {
  useEffect(() => {
    const startTime = performance.now();
    
    return () => {
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      if (process.env.NODE_ENV === 'development' && duration > 100) {
        console.warn(`${componentName} took ${duration.toFixed(2)}ms to render`);
      }
    };
  }, [componentName]);
}

/**
 * Hook for optimizing re-renders with shallow comparison
 */
export function useShallowMemo<T extends Record<string, any>>(obj: T): T {
  return useMemo(() => obj, Object.values(obj));
}
