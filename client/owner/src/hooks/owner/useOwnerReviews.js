import { useState, useEffect } from 'react';
import axiosInstance from '../useAxiosInstance';
import toast from 'react-hot-toast';

const useOwnerReviews = (facilityId = null, pageSize = 10) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchReviews = async (page = 1, facility = facilityId) => {
    try {
      setLoading(true);
      const params = { page, pageSize };
      if (facility) params.facilityId = facility;
      
      const response = await axiosInstance.get('/owner/profile/reviews', { params });
      const newReviews = response.data.data;
      
      if (page === 1) {
        setReviews(newReviews);
      } else {
        setReviews(prev => [...prev, ...newReviews]);
      }
      
      setCurrentPage(page);
      setHasMore(newReviews.length === pageSize);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      toast.error('Không thể tải đánh giá');
    } finally {
      setLoading(false);
    }
  };

  const loadMore = () => {
    if (!loading && hasMore) {
      fetchReviews(currentPage + 1, facilityId);
    }
  };

  const refresh = (facility = facilityId) => {
    setCurrentPage(1);
    setHasMore(true);
    fetchReviews(1, facility);
  };

  useEffect(() => {
    fetchReviews(1, facilityId);
  }, [facilityId]);

  return {
    reviews,
    loading,
    hasMore,
    loadMore,
    refresh
  };
};

export default useOwnerReviews;
