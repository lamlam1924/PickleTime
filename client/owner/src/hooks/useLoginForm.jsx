import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useState } from "react";
import axiosInstance from "./useAxiosInstance";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import {login} from "../redux/slices/authSlice";
import { useNavigate } from "react-router-dom";

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
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
 
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
      const result = await response.data;
      
      console.log("Normal Login Response:", result);
      console.log("UserId:", result.userId);
      console.log("Role:", result.role);
      console.log("Token:", result.token);
      
      // Get user role and redirect appropriately
      const userRole = result.role?.toLowerCase();
      
      // Prepare user object for Redux
      const userInfo = {
        userId: result.userId,
        userName: result.userName,
        email: result.email,
        fullName: result.fullName,
        role: result.role
      };
      
      toast.success(result.message);
      dispatch(login({ 
        userId: result.userId, 
        token: result.token, 
        role: result.role,
        user: userInfo 
      }));
      axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${result.token}`;
      
      console.log("Redirecting to role:", userRole);
      
      // Redirect based on role
      if (userRole === 'admin') {
        navigate("/admin", { replace: true });
      } else if (userRole === 'manager') {
        navigate("/owner", { replace: true });
      } else if (userRole === 'customer') {
        navigate("/customer", { replace: true });
      } else {
        // Default fallback
        navigate("/", { replace: true });
      }
    } catch (error) {
      console.log(error, 'error');
      if (error.response) {
        toast.error(error.response?.data?.message || "Login failed");
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
