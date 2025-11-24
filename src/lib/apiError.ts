/* eslint-disable @typescript-eslint/no-explicit-any */
// src/lib/apiError.ts
export interface ApiErrorData {
  status?: number;
  code?: string;
  message: string;
  details?: any;
  rateLimit?: {
    limit: string | null;
    remaining: string | null;
    reset: string | null;
  }
}

//Convert unknown fetch/axios/api errors into clean ApiErrorData.

export function parseApiError(err: any): ApiErrorData {
  if (!err) {
    return { message: "Unknown error occurred" };
  }

  // Already an ApiError (from apiFetch)
  if (err.message && err.status !== undefined) {
    return {
      status: err.status,
      code: err.code,
      message: err.message,
      details: err.details,
      rateLimit: err.rateLimit,
    };
  }

  // Network or unexpected errors
  return {
    message: err.message || "Network error occurred. Check your internet connection.",
    status: 0,
  };
}
