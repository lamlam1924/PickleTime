import axios from "axios";

const axiosInstance = axios.create({
  // Dùng proxy Vite để tránh CORS khi dev
  baseURL: "/api",
  withCredentials: true,
});

axiosInstance.interceptors.request.use((config) => {
  // Skip token for public endpoints
  const publicEndpoints = [
    '/auth/login',
    '/auth/register',
    '/auth/google-login',
    '/auth/request-password-reset',
    '/auth/reset-password'
  ];
  
  const isPublicEndpoint = publicEndpoints.some(endpoint => 
    config.url?.includes(endpoint)
  );

  if (isPublicEndpoint) {
    console.log("Public endpoint:", config.url, "- skipping token");
    return config;
  }

  // First check if token already set in headers (e.g., from login)
  if (config.headers.Authorization) {
    console.log("Request to:", config.url, "with token: Present (from headers)");
    return config;
  }

  // Prefer accessToken from localStorage, then fall back to persisted redux
  let token = null;
  const lsToken = localStorage.getItem("accessToken");
  if (lsToken) {
    token = lsToken;
  }

  try {
    if (!token) {
      const persistedUser = localStorage.getItem("persist:root");
      if (persistedUser) {
        const parsedUser = JSON.parse(persistedUser);
        if (parsedUser.auth) {
          const parsedAuth = JSON.parse(parsedUser.auth);
          token = parsedAuth.token;
        }
      }
    }
  } catch (error) {
    console.error("Error parsing persisted user data:", error);
  }

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log("Request to:", config.url, "with token: Present");
  } else {
    console.warn("No token found for request:", config.url);
  }

  return config;
});

export default axiosInstance;


 