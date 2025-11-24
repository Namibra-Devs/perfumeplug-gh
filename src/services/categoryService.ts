// src/services/categoryService.ts
import { apiFetch } from '../lib/api';
import { parseApiError } from '../lib/apiError';

export async function getCategories() {
  try {
    return await apiFetch<{ categories: Array<{ _id?: string; name: string; productCount?: number }> }>('/categories');
  } catch (err) {
    throw parseApiError(err);
  }
}
