/**
 * API Configuration
 * Centralized API endpoints and settings
 */

// Base API URL - Change based on environment
export const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5104/api";

// API Endpoints
export const API_ENDPOINTS = {
  // Auth
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    REFRESH: "/auth/refresh",
  },

  // Facilities
  FACILITIES: {
    BASE: "/facilities/all",
    BY_ID: (id) => `/facilities/${id}`,
    DETAIL: (id) => `/facilities/detail/${id}`,
    OPERATING_HOURS: (id) => `/facilities/${id}/operating-hours`,
    COURTS: (id) => `/facilities/${id}/courts`,
  },

  // Bookings
  BOOKINGS: {
    BASE: "/bookings",
    BY_ID: (id) => `/bookings/${id}`,
    AVAILABLE_SLOTS: "/bookings/available-slots",
    ENHANCED_AVAILABILITY: "/bookings/enhanced-availability",
    PRICING: "/bookings/pricing",
    MY_BOOKINGS: "/bookings/my-bookings",
    CANCEL: (id) => `/bookings/${id}/cancel`,
    CHECK_AVAILABILITY: "/bookings/check-availability",
  },

  // Courts
  COURTS: {
    BASE: "/courts",
    BY_ID: (id) => `/courts/${id}`,
    TIME_SLOTS: (id) => `/courts/${id}/time-slots`,
  },
};

// Request timeout
export const REQUEST_TIMEOUT = 30000; // 30 seconds

// Retry configuration
export const RETRY_CONFIG = {
  maxRetries: 3,
  retryDelay: 1000, // 1 second
};

export default {
  API_BASE_URL,
  API_ENDPOINTS,
  REQUEST_TIMEOUT,
  RETRY_CONFIG,
};
