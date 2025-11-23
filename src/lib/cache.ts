/* eslint-disable @typescript-eslint/no-explicit-any */
// src/lib/cache.ts

interface CacheEntry<T> {
  value: T;
  expires: number;
}

const memoryCache = new Map<string, CacheEntry<any>>();

export function setCache<T>(key: string, value: T, ttlMs: number = 5 * 60 * 1000) {
  memoryCache.set(key, {
    value,
    expires: Date.now() + ttlMs,
  });
}

export function getCache<T>(key: string): T | null {
  const entry = memoryCache.get(key);

  if (!entry) return null;

  // expired
  if (Date.now() > entry.expires) {
    memoryCache.delete(key);
    return null;
  }

  return entry.value;
}

export function clearCache(key?: string) {
  if (key) memoryCache.delete(key);
  else memoryCache.clear();
}
