import { useState, useEffect } from 'react';
import axiosInstance from '../useAxiosInstance';
import toast from 'react-hot-toast';

const useOwnerDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axiosInstance.get('/owner/profile/dashboard');
      console.log('Dashboard Response:', response.data);
      setDashboardData(response.data.data || response.data);
    } catch (error) {
      console.error('Error fetching dashboard:', error);
      const errorMessage = error.response?.data?.message || 'Không thể tải dữ liệu dashboard';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  return {
    dashboard: dashboardData,
    loading,
    error,
    refresh: fetchDashboard
  };
};

export default useOwnerDashboard;
