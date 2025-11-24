/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useToast } from "./useToast";
import { apiFetch } from "../lib/api";
import { Category, GetCategoriesResponse } from "../types/categories";


export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const toast = useToast();

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);

        // apiFetch returns ONLY data.data
        const data = await apiFetch<GetCategoriesResponse>("/categories");

        setCategories(data.data.categories);
      } catch (err: any) {
        setError(err.message);
        toast.error("Failed to load categories");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [toast]);

  return { categories, loading, error };
}
