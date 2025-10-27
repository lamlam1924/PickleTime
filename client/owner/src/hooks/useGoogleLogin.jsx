// src/hooks/useGoogleLogin.jsx
import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {useDispatch} from "react-redux";
import {login} from "../redux/slices/authSlice";
import axiosInstance from "./useAxiosInstance";
import toast from "react-hot-toast";
import {persistor} from "../redux/store";

const useGoogleLogin = () => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleGoogleCallback = async (credentialResponse) => {
    try {
      setLoading(true);

      if (!credentialResponse?.credential) {
        throw new Error("No credential received from Google");
      }

      // Send the Google credential token to backend
      const response = await axiosInstance.post("/auth/google-login", { 
        credential: credentialResponse.credential
      });
      const result = response.data;

      console.log("Google Login Response:", result);

      if (!result.token) {
        throw new Error("No token received from server");
      }

      toast.success(result.message || "Google login successful");
      
      // Construct user object from response
      const user = {
        userId: result.userId,
        email: result.email,
        userName: result.userName,
        fullName: result.fullName
      };
      
      // Normalize role
      const userRole = result.role.toLowerCase();
      
      console.log("User Role:", userRole);
      console.log("User ID:", result.userId);
      
      // Store token and user info in Redux
      dispatch(login({ 
        token: result.token,
        role: userRole,
        userId: result.userId,
        user: user
      }));
      
      // Set token in axios headers immediately
      axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${result.token}`;
      
      // Wait for Redux persist to flush to localStorage
      await persistor.flush();
      
      // Redirect based on role
      if(userRole === "admin") {
        navigate("/admin", { replace: true });
      } else if(userRole === "manager" || userRole === "owner") {
        navigate("/owner", { replace: true });
      } else if(userRole === "customer" || userRole === "user") {
        navigate("/customer", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    } catch (error) {
      console.error("Google login error:", error);
      toast.error(error.response?.data?.message || error.message || "Google login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return {
    handleGoogleCallback,
    loading
  };
};

export default useGoogleLogin;
