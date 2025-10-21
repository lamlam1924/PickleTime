import { useState, useEffect } from "react";
import axiosInstance from "../useAxiosInstance";
import toast from "react-hot-toast";

export const useUserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get("/admin/users");
      const result = response.data;
      console.log("Fetched users:", result);
      setUsers(result.data || result.users || []);
      setError(null);
    } catch (err) {
      console.error("Error fetching users:", err);
      setError(err.response?.data?.message || "Failed to fetch users");
      toast.error(err.response?.data?.message || "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const getUserById = async (userId) => {
    try {
      const response = await axiosInstance.get(`/admin/users/${userId}`);
      const result = response.data;
      return result.data || result.user;
    } catch (err) {
      console.error("Error fetching user:", err);
      throw new Error(err.response?.data?.message || "Failed to fetch user");
    }
  };

  const updateUserStatus = async (userId, statusId) => {
    try {
      const response = await axiosInstance.put(`/admin/users/${userId}/status`, {
        statusId: statusId
      });
      const result = response.data;
      toast.success(result.message || "User status updated successfully");
      
      // Refresh user list
      await fetchUsers();
      return true;
    } catch (err) {
      console.error("Error updating user status:", err);
      toast.error(err.response?.data?.message || "Failed to update user status");
      throw new Error(err.response?.data?.message || "Failed to update user status");
    }
  };

  return {
    users,
    loading,
    error,
    fetchUsers,
    getUserById,
    updateUserStatus
  };
};

export default useUserManagement;
