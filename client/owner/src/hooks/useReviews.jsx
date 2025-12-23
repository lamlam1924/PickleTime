import { useEffect, useState } from "react";
import axiosInstance from "./useAxiosInstance";
import toast from "react-hot-toast";

const useReviews = (facilityId) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [averageRating, setAverageRating] = useState(0);

  const fetchReviews = async () => {
    try {
      const response = await axiosInstance.get(`/reviews/${facilityId}`);
       const result = response.data;
       setReviews(result.reviews);
      setAverageRating(result.averageRating);
    } catch (err) {
      console.log(err, "error");
      toast.error(err.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchReviews();
  }, []);

  return { reviews, loading, averageRating };
};

export default useReviews;
