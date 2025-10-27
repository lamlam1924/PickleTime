import { useState, useEffect } from 'react';
import axiosInstance from '../useAxiosInstance';
import toast from 'react-hot-toast';

const useProfile = () => {
  const [profile, setProfile] = useState(null);
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/profile');
      setProfile(response.data.data);
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Không thể tải thông tin hồ sơ');
    } finally {
      setLoading(false);
    }
  };

  const fetchStatistics = async () => {
    try {
      const response = await axiosInstance.get('/profile/statistics');
      setStatistics(response.data.data);
    } catch (error) {
      console.error('Error fetching statistics:', error);
    }
  };

  const updateProfile = async (data) => {
    try {
      setUpdating(true);
      const response = await axiosInstance.put('/profile', data);
      setProfile(response.data.data);
      toast.success('Cập nhật thông tin thành công!');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Có lỗi xảy ra khi cập nhật thông tin';
      toast.error(message);
      return { success: false, error: message };
    } finally {
      setUpdating(false);
    }
  };

  const changePassword = async (data) => {
    try {
      setUpdating(true);
      await axiosInstance.put('/profile/password', data);
      toast.success('Đổi mật khẩu thành công!');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Có lỗi xảy ra khi đổi mật khẩu';
      toast.error(message);
      return { success: false, error: message };
    } finally {
      setUpdating(false);
    }
  };

  const deactivateAccount = async (password) => {
    try {
      setUpdating(true);
      await axiosInstance.delete('/profile', { data: { password } });
      toast.success(' Tài khoản đã được vô hiệu hóa');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Có lỗi xảy ra';
      toast.error(message);
      return { success: false, error: message };
    } finally {
      setUpdating(false);
    }
  };

  useEffect(() => {
    fetchProfile();
    fetchStatistics();
  }, []);

  return {
    profile,
    statistics,
    loading,
    updating,
    updateProfile,
    changePassword,
    deactivateAccount,
    refreshProfile: fetchProfile,
    refreshStatistics: fetchStatistics
  };
};

export default useProfile;
