import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import useAxiosInstance from '../useAxiosInstance';

export const useUserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const axios = useAxiosInstance();
  const token = useSelector((state) => state.auth.token);

  // Fetch all users
  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        setUsers(response.data.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch users');
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  // Get user by ID
  const getUserById = async (userId) => {
    try {
      const response = await axios.get(`/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        return response.data.data;
      }
      throw new Error('Failed to fetch user details');
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Failed to fetch user');
    }
  };

  // Update user status
  const updateUserStatus = async (userId, statusId) => {
    try {
      const response = await axios.put(
        `/users/${userId}/status`, 
        { statusId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (response.data.success) {
        // Refresh user list
        await fetchUsers();
        return true;
      }
      throw new Error('Failed to update status');
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Failed to update status');
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return {
    users,
    loading,
    error,
    fetchUsers,
    getUserById,
    updateUserStatus
  };
};
