import { useState, useEffect } from 'react';
import axiosInstance from '../useAxiosInstance';
import toast from 'react-hot-toast';

const useOwnerFacilities = () => {
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFacilities = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/owner/profile/facilities');
      setFacilities(response.data.data);
    } catch (error) {
      console.error('Error fetching facilities:', error);
      toast.error('Không thể tải danh sách cơ sở');
    } finally {
      setLoading(false);
    }
  };

  const getFacilityDetails = async (facilityId) => {
    try {
      const response = await axiosInstance.get(`/owner/profile/facilities/${facilityId}`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching facility details:', error);
      toast.error('Không thể tải thông tin cơ sở');
      return null;
    }
  };

  useEffect(() => {
    fetchFacilities();
  }, []);

  return {
    facilities,
    loading,
    getFacilityDetails,
    refresh: fetchFacilities
  };
};

export default useOwnerFacilities;
