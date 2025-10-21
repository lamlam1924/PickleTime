import { useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "../redux/slices/authSlice";
import axiosInstance from "../hooks/useAxiosInstance";
import toast from "react-hot-toast";
import { persistor } from "../redux/store";

const GoogleCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const hasProcessed = useRef(false);

  useEffect(() => {
    const handleCallback = async () => {
      // Prevent double execution in StrictMode
      if (hasProcessed.current) return;
      hasProcessed.current = true;
      const token = searchParams.get("token");
      const role = searchParams.get("role");
      const userId = searchParams.get("userId");
      const email = searchParams.get("email");
      const userName = searchParams.get("userName");
      const fullName = searchParams.get("fullName");
      const error = searchParams.get("error");

      if (error) {
        toast.error(`Google login failed: ${error}`);
        navigate("/login");
        return;
      }

      if (!token || !role || !userId) {
        toast.error("Missing authentication data");
        navigate("/login");
        return;
      }

      try {
        // Set token in axios
        axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;

        // Build user object from URL params
        const user = {
          userId: parseInt(userId),
          email: email || "",
          userName: userName || "",
          fullName: fullName || ""
        };

        // Store in Redux
        dispatch(login({
          token,
          role: role.toLowerCase(),
          userId: parseInt(userId),
          user
        }));

        // Wait for persist
        await persistor.flush();

        toast.success("Google login successful!");

        // Redirect based on role
        const userRole = role.toLowerCase();
        if (userRole === "admin") {
          navigate("/admin", { replace: true });
        } else if (userRole === "manager" || userRole === "owner") {
          navigate("/owner", { replace: true });
        } else if (userRole === "customer" || userRole === "user") {
          navigate("/customer", { replace: true });
        } else {
          navigate("/", { replace: true });
        }
      } catch (error) {
        console.error("Error processing Google callback:", error);
        toast.error("Failed to complete login");
        navigate("/login");
      }
    };

    handleCallback();
  }, [searchParams, navigate, dispatch]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-base-200">
      <div className="text-center">
        <span className="loading loading-spinner loading-lg"></span>
        <p className="mt-4">Completing Google login...</p>
      </div>
    </div>
  );
};

export default GoogleCallback;
