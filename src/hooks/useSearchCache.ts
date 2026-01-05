// src/hooks/useSearchCache.ts
import { useState, useCallback } from 'react';
import { Product } from '../types/product';

interface SearchCacheEntry {
  query: string;
  results: Product[];
  timestamp: number;
}

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const MAX_CACHE_SIZE = 50;

export function useSearchCache() {
  const [cache, setCache] = useState<Map<string, SearchCacheEntry>>(new Map());

  const getCachedResults = useCallback((query: string): Product[] | null => {
    const normalizedQuery = query.toLowerCase().trim();
    const entry = cache.get(normalizedQuery);
    
    if (!entry) return null;
    
    // Check if cache entry is still valid
    if (Date.now() - entry.timestamp > CACHE_DURATION) {
      setCache(prev => {
        const newCache = new Map(prev);
        newCache.delete(normalizedQuery);
        return newCache;
      });
      return null;
    }
    
    return entry.results;
  }, [cache]);

  const setCachedResults = useCallback((query: string, results: Product[]) => {
    const normalizedQuery = query.toLowerCase().trim();
    
    setCache(prev => {
      const newCache = new Map(prev);
      
      // Remove oldest entries if cache is full
      if (newCache.size >= MAX_CACHE_SIZE) {
        const oldestKey = Array.from(newCache.keys())[0];
        newCache.delete(oldestKey);
      }
      
      newCache.set(normalizedQuery, {
        query: normalizedQuery,
        results,
        timestamp: Date.now()
      });
      
      return newCache;
    });
  }, []);

  const clearCache = useCallback(() => {
    setCache(new Map());
  }, []);

  return {
    getCachedResults,
    setCachedResults,
    clearCache,
    cacheSize: cache.size
  };
}