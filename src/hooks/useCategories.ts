// src/hooks/useCategories.ts
import { useEffect, useState } from "react";
import { fetchCategories } from "../services/productService";

export interface CategoryData {
  id: string;
  name: string;
  count: number;
}

export function useCategories() {
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCategories = async () => {
      setLoading(true);
      setError(null);

      try {
        const categoriesData = await fetchCategories();
        setCategories(categoriesData);
        
        // Debug: Log categories fetched from API
        console.log(`useCategories: Fetched ${categoriesData.length} categories from API:`, categoriesData.map(c => c.id));
      } catch (err: any) {
        console.error('Categories loading error:', err);
        setError(err.message || "Failed to load categories");
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, []);

  return {
    categories,
    loading,
    error,
  };
}