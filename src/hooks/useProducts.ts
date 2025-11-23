/* eslint-disable @typescript-eslint/no-explicit-any */
// hooks/useProducts.ts
import { useState, useEffect } from "react";
import { Product, Pagination } from "../types/product";
import { TENANT } from "../lib/api";

export interface UseProductsOptions {
  page?: number;
  category?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: string;  // "newest" | "price-low-high" | "price-high-low"
}

interface UseProductsResult {
  products: Product[];
  loading: boolean;
  error: string | null;
  pagination: Pagination | null;
  fetchProducts: (opts?: UseProductsOptions) => Promise<void>;
}

export function useProducts(options: UseProductsOptions = {}): UseProductsResult {
  const [products, setProducts] = useState<Product[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async (opts: UseProductsOptions = {}) => {
    setLoading(true);
    setError(null);

    const {
      page = 1,
      category = "",
      search = "",
      minPrice = 0,
      maxPrice = 10000,
      sortBy = "newest",
    } = opts;

    try {
      const url = new URL(`https://api.yourpos.com/api/v1/ecommerce/products`);

      url.searchParams.append("page", page.toString());
      url.searchParams.append("limit", "20");

      if (search) url.searchParams.append("search", search);
      if (category) url.searchParams.append("category", category);
      if (minPrice) url.searchParams.append("minPrice", minPrice.toString());
      if (maxPrice) url.searchParams.append("maxPrice", maxPrice.toString());

      // Determine sort rules
      if (sortBy === "price-low-high") {
        url.searchParams.append("sortBy", "price");
        url.searchParams.append("sortOrder", "asc");
      } else if (sortBy === "price-high-low") {
        url.searchParams.append("sortBy", "price");
        url.searchParams.append("sortOrder", "desc");
      } else {
        url.searchParams.append("sortBy", "createdAt");
        url.searchParams.append("sortOrder", "desc");
      }

      const response = await fetch(url.toString(), {
        headers: {
          "X-Tenant-Domain": TENANT,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }

      const data = await response.json();
      console.log("Products:", data);
      setProducts(data.data.products);
      setPagination(data.data.pagination);
    } catch (error: any) {
      setError(error.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(options);
  }, [options]);

  return {
    products,
    loading,
    error,
    pagination,
    fetchProducts,
  };
}
