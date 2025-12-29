import { useState } from "react";
import api from "@/services/api";

const useAdvancedSearch = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [results, setResults] = useState(null);

  const search = async (filters) => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.post("/facilities/advanced-search", filters);
      setResults(response.data);
      return response.data;
    } catch (err) {
      setError(err.message || "Failed to search facilities");
      console.error("Search error:", err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setResults(null);
    setError(null);
  };

  return {
    search,
    loading,
    error,
    results,
    reset,
  };
};

export default useAdvancedSearch;
