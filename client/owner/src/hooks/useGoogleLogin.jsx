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

      // Gửi credential token lên backend
      const response = await axiosInstance.post("/auth/google-login", { 
        credential: credentialResponse.credential
      });
      const result = response.data;

      if (!result.token) {
        throw new Error("No token received from server");
      }

      // Lưu token vào localStorage
      localStorage.setItem("accessToken", result.token);

      // Lấy roles từ response của backend
      const userRoles = Array.isArray(result.roles)
        ? result.roles.map(r => r.roleId).filter(Boolean)
        : [];

      // Tạo user object
      const user = {
        userId: result.userId,
        email: result.email,
        fullName: result.fullName || result.userName,
        roles: userRoles
      };

      // Dispatch login action
      dispatch(login({ 
        token: result.token,
        user: user
      }));

      // Đợi Redux persist lưu xong
      await persistor.flush();

      toast.success(result.message || "Đăng nhập Google thành công");

      // Điều hướng đến trang chọn role (tương tự login thường)
      navigate("/select-role", { replace: true });
      
    } catch (error) {
      console.error("Google login error:", error);
      const message = error.response?.data?.message || error.message || "Đăng nhập Google thất bại. Vui lòng thử lại.";
      toast.error(message);
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
