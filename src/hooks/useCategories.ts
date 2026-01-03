/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { apiFetch } from "../lib/api";
import { Category } from "../types/categories";


export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);

        // apiFetch returns the 'data' part: { categories: [...] }
        const data = await apiFetch<{ categories: string[] }>("/api/ecommerce/categories");

        setCategories(data.categories.map(name => ({ name, productCount: 0 })));
      } catch (err: any) {
        console.error("Category fetch failed - using fallback categories:", err);

        setError(err.message);

      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);


  return { categories, loading, error };
}
