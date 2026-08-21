import { useCallback, useEffect, useState } from "react";
import { ApiError } from "../api/client";
import { getPilgrimInfo } from "../services/pilgrimInfoService";
import { PilgrimInfoCategory } from "../types/chat";

export function usePilgrimInfo() {
  const [categories, setCategories] = useState<PilgrimInfoCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getPilgrimInfo();
      setCategories(response.categories);
    } catch (err) {
      setError(err as ApiError);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { categories, loading, error, reload: load };
}
