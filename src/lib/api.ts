import { getCache, setCache } from "./cache";

// src/lib/api.ts
export const BASE = import.meta.env.VITE_API_URL || 'https://pos-api-wwyf.onrender.com';
export const TENANT = import.meta.env.VITE_TENANT_DOMAIN || 'www.perfume-plug.com';

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
    // Extract error message from API response
    // Backend returns: { success: false, message: "Error message", error?: "details" }
    let msg = `Request failed with status ${res.status}`;
    
    if (body) {
      // Try different possible error message locations
      if (body.message) {
        msg = body.message;
      } else if (body.error?.message) {
        msg = body.error.message;
      } else if (typeof body.error === 'string') {
        msg = body.error;
      } else if (body.data?.message) {
        msg = body.data.message;
      }
    }

    type ApiError = Error & {
      status?: number;
      code?: string;
      details?: unknown;
      rateLimit?: {
        limit: string | null;
        remaining: string | null;
        reset: string | null;
      };
      response?: unknown;
    };
    
    const err = new Error(msg) as ApiError;
    err.status = res.status;
    err.code = body?.code || body?.error?.code;
    err.details = body?.error?.details || body?.details;
    err.rateLimit = rateLimit;
    err.response = body; // Include full response for debugging
    throw err;
  }

   // After successful fetch:
  if (cacheKey && cacheDuration > 0) {
    setCache(cacheKey, body?.data ?? body, cacheDuration);
  }

  // Most success payloads are { success: true, data: { ... } }
  return body?.data ?? body;
}