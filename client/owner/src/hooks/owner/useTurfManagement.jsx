import { useState } from "react";
import axiosInstance from "../useAxiosInstance";
import toast from "react-hot-toast";

const useTurfManagement = () => {
  const [turfs, setTurfs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTurfs = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get("/owner/profile/facilities");
      console.log("Facilities Response:", response.data);
      
      const facilities = response.data.data || response.data;
      
      // Transform backend FacilitySummaryDto to frontend turf format
      const transformedTurfs = facilities.map((facility) => ({
        _id: facility.facilityId,
        name: facility.facilityName,
        description: facility.description || "Cơ sở Pickleball chất lượng cao",
        location: `${facility.address}, ${facility.ward}, ${facility.district}, ${facility.province}` || "Chưa cập nhật",
        image: facility.imageUrl || "/placeholder-turf.jpg",
        pricePerHour: facility.averagePrice || 0,
        openTime: facility.openTime || "06:00",
        closeTime: facility.closeTime || "22:00",
        avgRating: facility.rating || 0,
        totalReviews: facility.totalReviews || 0,
        totalBookings: facility.totalBookings || 0,
        totalCourts: facility.totalCourts || 0,
        activeCourts: facility.activeCourts || 0,
        status: facility.status || "Active",
        sportTypes: ["Pickleball"], // Default since backend doesn't have this field
      }));
      
      setTurfs(transformedTurfs);
    } catch (err) {
      console.error("Error fetching facilities:", err);
      const errorMsg = err.response?.data?.message || "Failed to fetch facilities";
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const addTurf = async (newTurf) => {
    try {
      // TODO: Implement when backend endpoint is available
      toast.error("Add facility feature coming soon!");
      // const response = await axiosInstance.post("/owner/profile/facilities", newTurf);
      // const addedTurf = response.data.data || response.data;
      // setTurfs((prev) => [...prev, addedTurf]);
      // toast.success("Facility added successfully!");
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Failed to add facility";
      setError(errorMsg);
      toast.error(errorMsg);
    }
  };

  const editTurf = async (updatedTurf, turfId) => {
    try {
      // TODO: Implement when backend endpoint is available
      toast.error("Edit facility feature coming soon!");
      // const response = await axiosInstance.put(`/owner/profile/facilities/${turfId}`, updatedTurf);
      // const result = response.data.data || response.data;
      // await fetchTurfs(); // Refresh list
      // toast.success("Facility updated successfully!");
    } catch (error) {
      console.error("Error editing facility:", error);
      const errorMsg = error.response?.data?.message || "Failed to edit facility";
      toast.error(errorMsg);
    }
  };

  const deleteTurf = async (id) => {
    try {
      // TODO: Implement when backend endpoint is available
      toast.error("Delete facility feature coming soon!");
      // await axiosInstance.delete(`/owner/profile/facilities/${id}`);
      // setTurfs((prev) => prev.filter((turf) => turf._id !== id));
      // toast.success("Facility deleted successfully!");
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Failed to delete facility";
      setError(errorMsg);
      toast.error(errorMsg);
    }
  };

  return {
    turfs,
    isLoading,
    error,
    fetchTurfs,
    addTurf,
    editTurf,
    deleteTurf,
  };
};

export default useTurfManagement;
