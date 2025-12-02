/* eslint-disable @typescript-eslint/no-explicit-any */
// hooks/useProducts.ts
import { useEffect, useState } from "react";
import type { Product, Pagination } from "../types/product";
import { fetchProducts as fetchProductService } from "../services/productService";
import { MockProducts } from "../constants/mockData";

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
      // Call your service instead of rewriting logic
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
      setError(err.message || "Failed to load products");

      console.warn("⚠ Using mock products (API failed)");

      // ------------------------------------------
      // FALLBACK TO MOCK DATA
      // ------------------------------------------
      let filtered = [...MockProducts];

      if (opts.search) {
        filtered = filtered.filter(p =>
          p.name.toLowerCase().includes(opts.search!.toLowerCase())
        );
      }

      if (opts.category) {
        filtered = filtered.filter(p =>
          p.category?.toLowerCase() === opts.category!.toLowerCase()
        );
      }

      if (opts.minPrice !== undefined || opts.maxPrice !== undefined) {
        filtered = filtered.filter(
          p =>
            p.sellingPrice >= (opts.minPrice ?? 0) &&
            p.sellingPrice <= (opts.maxPrice ?? 999999)
        );
      }

      // Manual Pagination (client-side fallback)
      const pageSize = 20;
      const currentPage = opts.page ?? 1;  // ← FIXED
      const start = (currentPage - 1) * pageSize;

      const paginated = filtered.slice(start, start + pageSize);

      setProducts(paginated);

      setPagination({ 
        currentPage,
        limit: pageSize,
        totalPages: Math.ceil(filtered.length / pageSize),
        totalProducts: filtered.length,
        hasNextPage: currentPage < Math.ceil(filtered.length / pageSize),
        hasPrevPage: currentPage > 1,
      });

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