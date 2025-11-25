/* eslint-disable @typescript-eslint/no-explicit-any */
// hooks/useProducts.ts
import { useState, useEffect } from "react";
import { Product, Pagination } from "../types/product";
import { apiFetch } from "../lib/api";
import { MockProducts} from "../constants/mockData";

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
      const params = new URLSearchParams();
      params.append("page", page.toString());
      params.append("limit", "20");

      if (search) params.append("search", search);
      if (category) params.append("category", category);
      if (minPrice) params.append("minPrice", minPrice.toString());
      if (maxPrice) params.append("maxPrice", maxPrice.toString());

      // Determine sort rules
      if (sortBy === "price-low-high") {
        params.append("sortBy", "price");
        params.append("sortOrder", "asc");
      } else if (sortBy === "price-high-low") {
        params.append("sortBy", "price");
        params.append("sortOrder", "desc");
      } else {
        params.append("sortBy", "createdAt");
        params.append("sortOrder", "desc");
      }

      const data = await apiFetch<{ products: Product[]; pagination: Pagination }>(
        `/products?${params.toString()}`
      );

      console.log("Products:", data);
      setProducts(data.products);
      setPagination(data.pagination);
    } catch (error: any) {
      setError(error.message || "An error occurred");

    /*  
      -----------------------------------------------
      🔥 FALLBACK TO MOCK DATA IF API REQUEST FAILS
      -----------------------------------------------
    */

     let filtered = [...MockProducts];
     console.log(filtered);

     //Apply search filter
     if(search){
      filtered =filtered.filter((p) => 
        p.name.toLowerCase().includes(search.toLowerCase())
      );
     }

     //Category filter
     if(category){
      filtered = filtered.filter((p) => 
        p.category?.toLowerCase().includes(category.toLowerCase())
      )
     }

     // Price range filter
      filtered = filtered.filter(
        (p) => p.sellingPrice >= minPrice && p.sellingPrice <= maxPrice
      );

      // Sorting
      if (sortBy === "price-low-high") {
        filtered.sort((a, b) => a.sellingPrice - b.sellingPrice);
      } else if (sortBy === "price-high-low") {
        filtered.sort((a, b) => b.sellingPrice - a.sellingPrice);
      } else {
        // newest → sort by createdAt
        filtered.sort(
          (a, b) =>
            new Date(b.createdAt || "").getTime() -
            new Date(a.createdAt || "").getTime()
        );
      }

      // Manual Pagination (client-side)
      const pageSize = 20;
      const start = (page - 1) * pageSize;
      const paginated = filtered.slice(start, start + pageSize);

      setProducts(paginated);

      setPagination({
        currentPage: page,
        limit: pageSize,
        totalPages: Math.ceil(filtered.length / pageSize),
        totalProducts: filtered.length,
      } as any);

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
