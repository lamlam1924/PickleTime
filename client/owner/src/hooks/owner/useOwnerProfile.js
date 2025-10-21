import { useState, useEffect } from 'react';
import axiosInstance from '../useAxiosInstance';
import toast from 'react-hot-toast';

const useOwnerProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/owner/profile');
      setProfile(response.data.data);
    } catch (error) {
      console.error('Error fetching owner profile:', error);
      toast.error('Không thể tải thông tin hồ sơ');
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (data) => {
    try {
      setUpdating(true);
      const response = await axiosInstance.put('/owner/profile', data);
      setProfile(response.data.data);
      toast.success('✅ Cập nhật thông tin thành công!');
      return { success: true };
    } catch (error) {
      console.error('Error updating owner profile:', error);
      const errorMessage = error.response?.data?.message || 'Có lỗi xảy ra khi cập nhật';
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setUpdating(false);
    }
  };

  const changePassword = async (data) => {
    try {
      setUpdating(true);
      await axiosInstance.put('/owner/profile/password', data);
      toast.success('✅ Đổi mật khẩu thành công!');
      return { success: true };
    } catch (error) {
      console.error('Error changing password:', error);
      const errorMessage = error.response?.data?.message || 'Có lỗi xảy ra';
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setUpdating(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return {
    profile,
    loading,
    updating,
    updateProfile,
    changePassword,
    refreshProfile: fetchProfile
  };
};

export default useOwnerProfile;
