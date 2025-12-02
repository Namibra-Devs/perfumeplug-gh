// src/services/productService.ts
import { apiFetch } from '../lib/api';
import { parseApiError } from '../lib/apiError';
import type { Product, Pagination } from '../types/product';

export interface FetchProductsOptions {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export async function fetchProducts(opts: FetchProductsOptions = {}) {
  try {
    const params = new URLSearchParams();
    if (opts.page) params.set('page', String(opts.page));
    if (opts.limit) params.set('limit', String(opts.limit));
    if (opts.search) params.set('search', opts.search);
    if (opts.category) params.set('category', opts.category);
    if (opts.minPrice !== undefined) params.set('minPrice', String(opts.minPrice));
    if (opts.maxPrice !== undefined) params.set('maxPrice', String(opts.maxPrice));
    if (opts.sortBy) params.set('sortBy', opts.sortBy);
    if (opts.sortOrder) params.set('sortOrder', opts.sortOrder);

    const path = `/api/v1/products${params.toString() ? `?${params.toString()}` : ''}`;
    return await apiFetch<{ products: Product[]; pagination?: Pagination }>(path);
  } catch (err) {
    throw parseApiError(err);
  }
}

export async function getProduct(productId: string) {
  try {
    return await apiFetch<{ product: Product }>(`/api/v1/products/${productId}`);
  } catch (err) {
    throw parseApiError(err);
  }
}

export async function searchProducts(query: string, limit = 50) {
   try {
    const params = new URLSearchParams({ search: query, limit: String(limit) });
    const data = await apiFetch<{ products: Product[] }>(`/api/v1/products?${params.toString()}`);
    return data.products;
  } catch (err) {
    throw parseApiError(err);
  }
}

// 