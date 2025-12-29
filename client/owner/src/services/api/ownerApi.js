/**
 * Owner API Service
 * All owner-related API calls
 */

import axiosInstance from "../../hooks/useAxiosInstance";

export const ownerApi = {
  // Dashboard
  getDashboardStats: async () => {
    const response = await axiosInstance.get("/owner/dashboard");
    return response.data;
  },

  // Profile
  getProfile: async () => {
    const response = await axiosInstance.get("/owner/profile");
    return response.data;
  },

  updateProfile: async (data) => {
    const response = await axiosInstance.put("/owner/profile", data);
    return response.data;
  },

  // Facilities
  getFacilities: async () => {
    const response = await axiosInstance.get("/owner/facilities");
    return response.data;
  },

  createFacility: async (data) => {
    const response = await axiosInstance.post("/owner/facilities", data);
    return response.data;
  },

  updateFacility: async (id, data) => {
    const response = await axiosInstance.put(`/owner/facilities/${id}`, data);
    return response.data;
  },

  deleteFacility: async (id) => {
    const response = await axiosInstance.delete(`/owner/facilities/${id}`);
    return response.data;
  },

  // Bookings
  getBookings: async (params) => {
    const response = await axiosInstance.get("/owner/bookings", { params });
    return response.data;
  },

  getBookingById: async (id) => {
    const response = await axiosInstance.get(`/owner/bookings/${id}`);
    return response.data;
  },

  updateBookingStatus: async (id, status) => {
    const response = await axiosInstance.patch(`/owner/bookings/${id}/status`, { status });
    return response.data;
  },

  // Reviews
  getReviews: async (facilityId) => {
    const response = await axiosInstance.get("/owner/reviews", {
      params: { facilityId },
    });
    return response.data;
  },

  replyToReview: async (reviewId, reply) => {
    const response = await axiosInstance.post(`/owner/reviews/${reviewId}/reply`, { reply });
    return response.data;
  },

  // Transactions
  getTransactions: async (params) => {
    const response = await axiosInstance.get("/owner/transactions", { params });
    return response.data;
  },
};
