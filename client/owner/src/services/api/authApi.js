/**
 * Auth API Service
 * All authentication-related API calls
 */

import axiosInstance from "../../hooks/useAxiosInstance";

export const authApi = {
  // Login
  login: async (credentials) => {
    const response = await axiosInstance.post("/auth/login", credentials);
    return response.data;
  },

  // Register
  register: async (userData) => {
    const response = await axiosInstance.post("/auth/register", userData);
    return response.data;
  },

  // Google Login
  googleLogin: async (googleToken) => {
    const response = await axiosInstance.post("/auth/google-login", { token: googleToken });
    return response.data;
  },

  // Logout
  logout: async () => {
    const response = await axiosInstance.post("/auth/logout");
    return response.data;
  },

  // Refresh Token
  refreshToken: async () => {
    const response = await axiosInstance.post("/auth/refresh");
    return response.data;
  },

  // Password Reset
  requestPasswordReset: async (email) => {
    const response = await axiosInstance.post("/auth/request-password-reset", { email });
    return response.data;
  },

  resetPassword: async (token, newPassword) => {
    const response = await axiosInstance.post("/auth/reset-password", {
      token,
      newPassword,
    });
    return response.data;
  },

  // Role Switching
  assumeRole: async (roleId) => {
    const response = await axiosInstance.post("/roles/assume-role", { roleId });
    return response.data;
  },

  // Owner Request
  submitOwnerRequest: async (requestData) => {
    const response = await axiosInstance.post("/owner/auth/ownerRequest", requestData);
    return response.data;
  },
};
