import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axiosInstance from "./useAxiosInstance";
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { login } from "../redux/slices/authSlice";
import { useDispatch } from "react-redux";
import { persistor } from "../redux/store";

const loginSchema = yup.object().shape({
  email: yup
    .string()
    .required("Enter your email")
    .matches(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/gm,
      "Enter a valid email"
    ),
  password: yup
    .string()
    .required("Enter your password")
    .min(6, "Password must be at least 6 characters long"),
});

const useLoginForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await axiosInstance.post("/auth/login", data);
      const result = response.data;
      
      console.log("Login Response:", result);
      
      if (!result.token) {
        throw new Error("No token received from server");
      }
      
      toast.success(result.message || "Login successful");
      
      // Use data directly from backend response (already has user info)
      const userRole = result.role?.toLowerCase();
      const userId = result.userId;
      
      console.log("User Role:", userRole);
      console.log("User ID:", userId);
      console.log("User Info:", {
        userName: result.userName,
        email: result.email,
        fullName: result.fullName
      });
      
      // Store token and user info in Redux
      dispatch(login({ 
        token: result.token,
        role: userRole,
        userId: userId,
        user: {
          userName: result.userName,
          email: result.email,
          fullName: result.fullName
        }
      }));
      
      // Set token in axios headers immediately
      axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${result.token}`;
      
      // Wait for Redux persist to flush to localStorage
      await persistor.flush();
      
      // Redirect based on role
      if (userRole === 'admin') {
        navigate("/admin", { replace: true });
      } else if (userRole === 'manager' || userRole === 'owner') {
        navigate("/owner", { replace: true });
      } else if (userRole === 'customer' || userRole === 'user') {
        navigate("/customer", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    } catch (error) {
      console.error('Login error:', error);
      if (error.response) {
        toast.error(error.response?.data?.message || "Login failed");
      } else if (error.message) {
        toast.error(error.message);
      } else {
        toast.error("Network error. Please check your connection.");
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    register,
    handleSubmit,
    errors,
    onSubmit,
    loading,
  };
};

export default useLoginForm;
