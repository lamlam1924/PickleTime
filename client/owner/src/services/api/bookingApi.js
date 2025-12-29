/**
 * Booking API Service
 * All booking-related API calls
 */

import axiosInstance from "../../hooks/useAxiosInstance";
import { API_ENDPOINTS } from "../../config/api.config";

/**
 * Get available time slots for a facility on a specific date
 * @param {Object} params - Query parameters
 * @param {number} params.facilityId - Facility ID
 * @param {string} params.date - Date in YYYY-MM-DD format
 * @param {number} [params.courtId] - Optional court ID filter
 * @returns {Promise<Array>} Available time slots
 */
export const getAvailableTimeSlots = async ({ facilityId, date, courtId }) => {
  const response = await axiosInstance.get(API_ENDPOINTS.BOOKINGS.AVAILABLE_SLOTS, {
    params: { facilityId, date, courtId },
  });
  return response.data;
};

/**
 * Get enhanced availability with dynamic slots, pricing tiers, and discounts
 * @param {Object} params - Query parameters
 * @param {number} params.facilityId - Facility ID
 * @param {string} params.date - Date in YYYY-MM-DD format
 * @param {number} [params.courtId] - Optional court ID filter
 * @returns {Promise<Object>} Enhanced availability data
 */
export const getEnhancedAvailability = async ({ facilityId, date, courtId }) => {
  const response = await axiosInstance.get(API_ENDPOINTS.BOOKINGS.ENHANCED_AVAILABILITY, {
    params: { facilityId, date, courtId },
  });
  return response.data;
};

/**
 * Calculate pricing for a booking
 * @param {Object} params - Pricing parameters
 * @param {number} params.courtId - Court ID
 * @param {string} params.date - Booking date (YYYY-MM-DD)
 * @param {string} params.startTime - Start time (HH:mm:ss)
 * @param {number} params.durationHours - Duration in hours
 * @returns {Promise<Object>} Pricing details
 */
export const calculatePricing = async ({ courtId, date, startTime, durationHours }) => {
  const response = await axiosInstance.get(API_ENDPOINTS.BOOKINGS.PRICING, {
    params: { courtId, date, startTime, durationHours },
  });
  return response.data;
};

/**
 * Create a new booking
 * @param {Object} bookingData - Booking information
 * @param {number} bookingData.courtId - Court ID
 * @param {string} bookingData.bookingDate - Date (YYYY-MM-DD)
 * @param {string} bookingData.startTime - Start time (HH:mm:ss)
 * @param {number} bookingData.durationHours - Duration in hours
 * @param {string} [bookingData.customerName] - Customer name
 * @param {string} [bookingData.customerPhone] - Customer phone
 * @param {string} [bookingData.customerEmail] - Customer email
 * @param {string} [bookingData.notes] - Additional notes
 * @returns {Promise<Object>} Created booking details
 */
export const createBooking = async (bookingData) => {
  const response = await axiosInstance.post(API_ENDPOINTS.BOOKINGS.BASE, bookingData);
  return response.data;
};

/**
 * Get booking by ID
 * @param {number} bookingId - Booking ID
 * @returns {Promise<Object>} Booking details
 */
export const getBookingById = async (bookingId) => {
  const response = await axiosInstance.get(API_ENDPOINTS.BOOKINGS.BY_ID(bookingId));
  return response.data;
};

/**
 * Get current user's bookings
 * @param {Object} params - Query parameters
 * @param {string} [params.status] - Filter by status
 * @param {number} [params.page] - Page number
 * @param {number} [params.pageSize] - Items per page
 * @returns {Promise<Object>} Paginated bookings list
 */
export const getMyBookings = async (params = {}) => {
  const response = await axiosInstance.get(API_ENDPOINTS.BOOKINGS.MY_BOOKINGS, { params });
  return response.data;
};

/**
 * Cancel a booking
 * @param {number} bookingId - Booking ID
 * @param {string} [reason] - Cancellation reason
 * @returns {Promise<Object>} Cancellation result
 */
export const cancelBooking = async (bookingId, reason = "") => {
  const response = await axiosInstance.post(API_ENDPOINTS.BOOKINGS.CANCEL(bookingId), {
    reason,
  });
  return response.data;
};

/**
 * Check if time slots are still available
 * @param {Object} params - Availability check parameters
 * @param {number} params.courtId - Court ID
 * @param {string} params.date - Date (YYYY-MM-DD)
 * @param {string} params.startTime - Start time (HH:mm:ss)
 * @param {string} params.endTime - End time (HH:mm:ss)
 * @returns {Promise<Object>} Availability status
 */
export const checkAvailability = async ({ courtId, date, startTime, endTime }) => {
  const response = await axiosInstance.get(API_ENDPOINTS.BOOKINGS.CHECK_AVAILABILITY, {
    params: { courtId, date, startTime, endTime },
  });
  return response.data;
};

const bookingApi = {
  getAvailableTimeSlots,
  getEnhancedAvailability,
  calculatePricing,
  createBooking,
  getBookingById,
  getMyBookings,
  cancelBooking,
  checkAvailability,
};

export default bookingApi;
