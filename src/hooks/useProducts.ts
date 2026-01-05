/* eslint-disable @typescript-eslint/no-explicit-any */
// hooks/useProducts.ts
import { useEffect, useState } from "react";
import type { Product, Pagination } from "../types/product";
import { fetchProducts as fetchProductService } from "../services/productService";

export interface UseProductsOptions {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: string;
}

export function useProducts(options: UseProductsOptions = {}) {
  const [products, setProducts] = useState<Product[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProducts = async (opts: UseProductsOptions = {}) => {
    setLoading(true);
    setError(null);

    try {
      const data = await fetchProductService({
        page: opts.page,
        limit: opts.limit ?? 20,
        search: opts.search,
        category: opts.category,
        minPrice: opts.minPrice,
        maxPrice: opts.maxPrice,
        sortBy: opts.sortBy,
      });

      setProducts(data.products);
      setPagination(data.pagination ?? null);

    } catch (err: any) {
      console.error('Products loading error:', err);
      
      // Provide more specific error messages
      let errorMessage = "Failed to load products";
      
      if (err.message?.includes('network') || err.message?.includes('fetch')) {
        errorMessage = "Network error. Please check your connection and try again.";
      } else if (err.message?.includes('404')) {
        errorMessage = "Products not found. The requested resource may not exist.";
      } else if (err.message?.includes('500')) {
        errorMessage = "Server error. Please try again later.";
      } else if (err.message?.includes('timeout')) {
        errorMessage = "Request timed out. Please try again.";
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      setProducts([]);
      setPagination(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts(options);
  }, [JSON.stringify(options)]);

  return {
    products,
    loading,
    error,
    pagination,
    refetch: loadProducts,
  };
}