// src/pages/GoogleCallback.jsx
import { useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "../redux/slices/authSlice";
import { extractUserFromJwt } from "@/utils/jwt";

const GoogleCallback = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const done = useRef(false);

    useEffect(() => {
        if (done.current) return;
        done.current = true;

        const token = searchParams.get("token");
        if (!token) {
            console.warn("Google callback: missing token in URL");
            navigate("/login", { replace: true });
            return;
        }

        // Lưu token vào localStorage
        localStorage.setItem("accessToken", token);

        // Lấy thông tin user từ JWT
        const info = extractUserFromJwt(token);
        
        // Lấy roles từ JWT, nếu không có thì lấy từ query params
        let roles = info.roles || [];
        if (!roles.length) {
            const rolesParam = searchParams.get("roles");
            if (rolesParam) {
                try {
                    roles = JSON.parse(decodeURIComponent(rolesParam));
                } catch (e) {
                    console.warn("Failed to parse roles from query params:", e);
                }
            }
        }
        
        const user = { 
            userId: info.id || parseInt(searchParams.get("userId")), 
            email: info.email || searchParams.get("email"), 
            fullName: info.name || searchParams.get("fullName"), 
            roles 
        };
        
        dispatch(login({ token, user }));

        // Điều hướng đến trang chọn role
        navigate("/select-role", { replace: true });
    }, []);

    return (
        <div className="flex items-center justify-center min-h-screen">
            <span className="loading loading-spinner loading-lg"/>
        </div>
    );
};

export default GoogleCallback;
