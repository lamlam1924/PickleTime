import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import * as yup from "yup";
import axiosInstance from "./useAxiosInstance";
import {useState} from "react";
import toast from "react-hot-toast";
import {useNavigate} from "react-router-dom";
import {useDispatch} from "react-redux";
import {login} from "../redux/slices/authSlice";
import { extractUserFromJwt } from "@/utils/jwt";
import {persistor} from "../redux/store";

const loginSchema = yup.object().shape({
    email: yup.string().required("Nhập email").email("Email không hợp lệ"),
    password: yup.string().required("Nhập mật khẩu").min(6, "Mật khẩu ít nhất 6 ký tự"),
});

const useLoginForm = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const {
        register,
        handleSubmit,        // ← Lấy nguyên hàm handleSubmit
        formState: {errors},
    } = useForm({resolver: yupResolver(loginSchema)});

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            const res = await axiosInstance.post("/auth/login", data);
            const token = res.data?.token || res.data?.accessToken;
            
            if (!token) {
                throw new Error("Không nhận được token từ server");
            }

            // Lưu token vào localStorage
            localStorage.setItem("accessToken", token);

            // Lấy thông tin user từ JWT
            const info = extractUserFromJwt(token);
            
            // Lấy roles từ response của backend (ưu tiên) hoặc từ JWT
            const backendRoles = Array.isArray(res.data?.roles)
                ? res.data.roles.map(r => r.roleId).filter(Boolean)
                : [];
            
            const userRoles = backendRoles.length > 0 ? backendRoles : (info.roles || []);

            const user = {
                userId: info.id,
                email: info.email,
                fullName: info.name,
                roles: userRoles
            };

            // Dispatch login action
            dispatch(login({ token, user }));

            // Điều hướng đến trang chọn role
            // RoleSwitcherPage sẽ tự động xử lý:
            // - Nếu 1 role: tự động chọn và redirect
            // - Nếu nhiều role: hiển thị UI cho user chọn
            navigate("/select-role", { replace: true });
            
        } catch (error) {
            console.error("Login error:", error);
            const message = error.response?.data?.message || "Đăng nhập thất bại. Vui lòng thử lại.";
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    // ← CHỈ TRUYỀN HÀM handleSubmit, KHÔNG GỌI LUÔN
    return {
        register,
        handleSubmit,        // ← ĐÚNG: là hàm
        onSubmit,            // ← Có thể bỏ nếu không dùng ngoài
        errors,
        loading,
    };
};

export default useLoginForm;