import { useState, useEffect } from "react";
import axiosInstance from "../useAxiosInstance";

const useOwnerReviews = () => {
  const [turfs, setTurfs] = useState([]);
  const [selectedTurf, setSelectedTurf] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTurfs();
  }, []);

  const fetchTurfs = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("/owner/profile/turfs-with-reviews");
      const result = response.data.data || response.data;
      setTurfs(result || []);
      if (result && result.length > 0) {
        setSelectedTurf(result[0].id);
      }
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch turfs and reviews");
      setTurfs([]);
      setLoading(false);
    }
  };

  return { turfs, selectedTurf, setSelectedTurf, loading, error };
};

export default useOwnerReviews;
