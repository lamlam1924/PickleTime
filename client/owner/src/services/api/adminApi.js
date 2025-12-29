/**
 * Admin API Service
 * All admin-related API calls
 */

import axiosInstance from "../../hooks/useAxiosInstance";

export const adminApi = {
  // Dashboard
  getDashboardStats: async () => {
    const response = await axiosInstance.get("/admin/dashboard");
    return response.data;
  },

  // User Management
  getUsers: async (params) => {
    const response = await axiosInstance.get("/admin/users", { params });
    return response.data;
  },

  getUserById: async (id) => {
    const response = await axiosInstance.get(`/admin/users/${id}`);
    return response.data;
  },

  updateUserStatus: async (id, status) => {
    const response = await axiosInstance.patch(`/admin/users/${id}/status`, { status });
    return response.data;
  },

  deleteUser: async (id) => {
    const response = await axiosInstance.delete(`/admin/users/${id}`);
    return response.data;
  },

  // Owner Management
  getOwners: async (params) => {
    const response = await axiosInstance.get("/admin/owners", { params });
    return response.data;
  },

  getOwnerRequests: async () => {
    const response = await axiosInstance.get("/admin/owner-requests");
    return response.data;
  },

  approveOwnerRequest: async (id, data) => {
    const response = await axiosInstance.post(`/admin/owner-requests/${id}/approve`, data);
    return response.data;
  },

  rejectOwnerRequest: async (id, reason) => {
    const response = await axiosInstance.post(`/admin/owner-requests/${id}/reject`, { reason });
    return response.data;
  },

  // Facility Management
  getAllFacilities: async (params) => {
    const response = await axiosInstance.get("/admin/facilities", { params });
    return response.data;
  },

  approveFacility: async (id) => {
    const response = await axiosInstance.patch(`/admin/facilities/${id}/approve`);
    return response.data;
  },

  rejectFacility: async (id, reason) => {
    const response = await axiosInstance.patch(`/admin/facilities/${id}/reject`, { reason });
    return response.data;
  },

  // Transactions
  getAllTransactions: async (params) => {
    const response = await axiosInstance.get("/admin/transactions", { params });
    return response.data;
  },

  getTransactionStats: async (period) => {
    const response = await axiosInstance.get("/admin/transactions/stats", {
      params: { period },
    });
    return response.data;
  },
};
