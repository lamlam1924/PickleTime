import axios from "axios";

const API_HTTP = "http://localhost:5104";
const API_HTTPS = "https://localhost:7178";

const axiosInstance = axios.create({
  // baseURL: "https://turf-spot-be.vercel.app",
  // baseURL: "http://localhost:5104",
  baseURL: "https://localhost:7178",
});

axiosInstance.interceptors.request.use((config) => {
  let token = null;
  try {
    const persistedUser = localStorage.getItem("persist:user");
    if (persistedUser) {
      const parsedUser = JSON.parse(persistedUser);
      if (parsedUser.auth) {
        const parsedAuth = JSON.parse(parsedUser.auth);
        token = parsedAuth.token;
      }
    }
  } catch (error) {
    console.error("Error parsing persisted user data:", error);
  }

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    delete config.headers.Authorization;
  }

  return config;
});

export default axiosInstance;
