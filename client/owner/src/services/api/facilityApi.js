/**
 * Facility API Service
 * All facility-related API calls
 */

import axiosInstance from "../../hooks/useAxiosInstance";
import { API_ENDPOINTS } from "../../config/api.config";

/**
 * Get all facilities with optional filters
 * @param {Object} params - Query parameters (province, district, etc.)
 * @returns {Promise<Array>} List of facilities
 */
export const getAllFacilities = async (params = {}) => {
  const response = await axiosInstance.get(API_ENDPOINTS.FACILITIES.BASE, { params });
  return response.data;
};

/**
 * Get facility by ID with full details
 * @param {number} facilityId - Facility ID
 * @returns {Promise<Object>} Facility details with courts, images, reviews, operating hours
 */
export const getFacilityById = async (facilityId) => {
  const response = await axiosInstance.get(API_ENDPOINTS.FACILITIES.DETAIL(facilityId));
  return response.data;
};

/**
 * Get facility operating hours
 * @param {number} facilityId - Facility ID
 * @returns {Promise<Array>} Operating hours for each day of week
 */
export const getFacilityOperatingHours = async (facilityId) => {
  const response = await axiosInstance.get(API_ENDPOINTS.FACILITIES.OPERATING_HOURS(facilityId));
  return response.data;
};

/**
 * Get courts of a facility
 * @param {number} facilityId - Facility ID
 * @returns {Promise<Array>} List of courts
 */
export const getFacilityCourts = async (facilityId) => {
  const response = await axiosInstance.get(API_ENDPOINTS.FACILITIES.COURTS(facilityId));
  return response.data;
};

const facilityApi = {
  getAllFacilities,
  getFacilityById,
  getFacilityOperatingHours,
  getFacilityCourts,
};

export default facilityApi;
