import { useState, useEffect } from 'react';
import axiosInstance from '../useAxiosInstance';
import toast from 'react-hot-toast';

const useOwnerRevenue = (periodType = 'monthly', count = 12) => {
  const [revenue, setRevenue] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRevenue = async (type = periodType, periods = count) => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/owner/profile/revenue', {
        params: { periodType: type, count: periods }
      });
      setRevenue(response.data.data);
    } catch (error) {
      console.error('Error fetching revenue:', error);
      toast.error('Không thể tải dữ liệu doanh thu');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRevenue();
  }, []);

  return {
    revenue,
    loading,
    fetchRevenue,
    refresh: () => fetchRevenue()
  };
};

export default useOwnerRevenue;
