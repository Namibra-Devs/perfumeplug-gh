import { getCache, setCache } from "./cache";

// src/lib/api.ts
export const BASE = import.meta.env.VITE_API_URL || 'https://pos-api-pm1f.onrender.com';
export const TENANT = import.meta.env.VITE_TENANT_DOMAIN || 'perfumeplug-gh.onrender.com';

export async function apiFetch<T = Record<string, unknown>>(
  path: string,
  opts: RequestInit = {},
  includeAuth = false,
  cacheKey?: string,      
  cacheDuration = 0
): Promise<T> {

  // Try cache first
  if (cacheKey && cacheDuration > 0) {
    const cached = getCache<T>(cacheKey);
    if (cached) return cached;
  }
  
  const headers = new Headers({
    'X-Frontend-Domain': TENANT,
    ...(opts.headers as Record<string,string> || {}),
  });

  if (!(headers.get('Content-Type'))) {
    headers.set('Content-Type', 'application/json');
  }

  if (includeAuth) {
    const token = typeof window !== 'undefined' ? localStorage.getItem('customerToken') : null;
    if (token) headers.set('Authorization', `Bearer ${token}`);
  }

  const res = await fetch(`${BASE}${path}`, { ...opts, headers });
  // Capture rate-limit headers for optional use
  const rateLimit = {
    limit: res.headers.get('X-RateLimit-Limit'),
    remaining: res.headers.get('X-RateLimit-Remaining'),
    reset: res.headers.get('X-RateLimit-Reset'),
  };

  const body = await res.json().catch(() => null);

  if (!res.ok) {
    // API uses structured error
    const msg = body?.error?.message || `Request failed with status ${res.status}`;
    type ApiError = Error & {
      status?: number;
      code?: string;
      details?: unknown;
      rateLimit?: {
        limit: string | null;
        remaining: string | null;
        reset: string | null;
      };
    };
    const err = new Error(msg) as ApiError;
    err.status = res.status;
    err.code = body?.error?.code;
    err.details = body?.error?.details;
    err.rateLimit = rateLimit;
    throw err;
  }

   // After successful fetch:
  if (cacheKey && cacheDuration > 0) {
    setCache(cacheKey, body?.data ?? body, cacheDuration);
  }

  // Most success payloads are { success: true, data: { ... } }
  return body?.data ?? body;
}