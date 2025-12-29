/**
 * API Services Index
 * Central export for all API services
 */

export { default as axiosInstance } from "../../hooks/useAxiosInstance";
export { default as facilityApi } from "./facilityApi";
export { default as bookingApi } from "./bookingApi";
export { ownerApi } from "./ownerApi";
export { adminApi } from "./adminApi";
export { authApi } from "./authApi";

// Named exports for convenience
export * from "./facilityApi";
export * from "./bookingApi";
export * from "./ownerApi";
export * from "./adminApi";
export * from "./authApi";

