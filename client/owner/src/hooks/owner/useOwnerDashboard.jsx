import { useState, useEffect } from "react";
import axiosInstance from "../useAxiosInstance";

const useOwnerDashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    totalBookings: 0,
    totalReviews: 0,
    totalRevenue: 0,
    totalTurfs: 0,
    bookingsPerTurf: [],
    revenueOverTime: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get("/owner/profile/dashboard");
        const apiData = response.data.data || response.data;
        
        console.log("Raw API Response:", apiData);
        
        // Backend returns PascalCase, map to camelCase for frontend
        setDashboardData({
          totalBookings: apiData.TotalBookings || apiData.totalBookings || 0,
          totalReviews: apiData.TotalReviews || apiData.totalReviews || 0,
          totalRevenue: apiData.TotalRevenue || apiData.totalRevenue || 0,
          totalTurfs: apiData.TotalFacilities || apiData.totalFacilities || 0,
          bookingsPerTurf: apiData.BookingsPerFacility || apiData.bookingsPerFacility || [],
          revenueOverTime: apiData.RevenueOverTime || apiData.revenueOverTime || [],
        });
        setLoading(false);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        console.error("Error response:", err.response?.data);
        setError(err.response?.data?.message || "Failed to fetch dashboard data");
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return { dashboardData, loading, error };
};

export default useOwnerDashboard;
