import { useState, useEffect } from 'react';
import axiosInstance from '../useAxiosInstance';
import toast from 'react-hot-toast';

const useBookingHistory = (page = 1, pageSize = 10) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(page);
  const [hasMore, setHasMore] = useState(true);

  const fetchBookingHistory = async (pageNum = currentPage) => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/profile/booking-history', {
        params: { page: pageNum, pageSize }
      });
      const data = response.data.data || [];
      
      if (pageNum === 1) {
        setBookings(data);
      } else {
        setBookings(prev => [...prev, ...data]);
      }
      
      setHasMore(data.length === pageSize);
      setCurrentPage(pageNum);
    } catch (error) {
      console.error('Error fetching booking history:', error);
      toast.error('Không thể tải lịch sử đặt sân');
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const loadMore = () => {
    if (!loading && hasMore) {
      fetchBookingHistory(currentPage + 1);
    }
  };

  const refresh = () => {
    setCurrentPage(1);
    fetchBookingHistory(1);
  };

  useEffect(() => {
    fetchBookingHistory(1);
  }, []);

  return {
    bookings,
    loading,
    hasMore,
    currentPage,
    loadMore,
    refresh
  };
};

export default useBookingHistory;
