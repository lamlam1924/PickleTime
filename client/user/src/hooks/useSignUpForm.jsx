import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axiosInstance from "./useAxiosInstance";
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {login} from "../redux/slices/authSlice"

const registerSchema = yup.object().shape({
  name: yup.string().required("Name is required"),
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
  confirmPassword: yup
    .string()
    .required("Enter your password")
    .oneOf([yup.ref("password"), null], "Passwords must match"),
});

const useSignUpForm = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(registerSchema),
  });

  const onSubmit = async (data) => {

    setLoading(true);
    try {
      const payload = {
        email: data.email,
        password: data.password,
        confirmPassword: data.confirmPassword,
        firstName: data.name,
        lastName: "",
        phoneNumber: data.phone || undefined
      };
      const response = await axiosInstance.post(
        "/api/auth/register",
        payload
      );
      const result = await response.data;
      toast.success(result.message);
      dispatch(login(result.token));
      navigate("/auth", { replace: true });
      axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${result.token}`;
    } catch (error) {
      if (error.response) {
        toast.error(error.response?.data?.message);
      }
    }finally{
      setLoading(false);
    }
  };

  return { register, handleSubmit, errors, onSubmit, loading };
};

export default useSignUpForm;
