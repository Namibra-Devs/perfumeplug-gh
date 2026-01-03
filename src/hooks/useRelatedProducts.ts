// src/hooks/useRelatedProducts.ts
import { useEffect, useState } from "react";
import type { Product } from "../types/product";
import { fetchProducts } from "../services/productService";

export interface UseRelatedProductsOptions {
  productId: string;
  category?: string;
  limit?: number;
}

export function useRelatedProducts(options: UseRelatedProductsOptions) {
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadRelatedProducts = async () => {
    if (!options.productId) {
      setRelatedProducts([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Strategy 1: If we have a category, fetch products from the same category
      if (options.category) {
        const data = await fetchProducts({
          category: options.category,
          limit: (options.limit || 8) + 1, // +1 to account for current product
        });

        // Filter out the current product and limit results
        const filtered = data.products
          .filter(p => p._id !== options.productId)
          .slice(0, options.limit || 8);

        setRelatedProducts(filtered);
      } else {
        // Strategy 2: If no category, fetch recent products
        const data = await fetchProducts({
          limit: (options.limit || 8) + 1,
          sortBy: 'newest'
        });

        // Filter out the current product and limit results
        const filtered = data.products
          .filter(p => p._id !== options.productId)
          .slice(0, options.limit || 8);

        setRelatedProducts(filtered);
      }

    } catch (err: any) {
      console.error("Failed to load related products:", err.message);
      setError(err.message || "Failed to load related products");
      setRelatedProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRelatedProducts();
  }, [options.productId, options.category, options.limit]);

  return {
    relatedProducts,
    loading,
    error,
    refetch: loadRelatedProducts,
  };
}