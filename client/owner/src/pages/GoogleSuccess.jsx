import {useEffect} from "react";
import {useSearchParams, useNavigate} from "react-router-dom";
import useGoogleLogin from "@hooks/useGoogleLogin";

const GoogleSuccess = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    // Mount the hook to trigger its useEffect for auto-callback
    const {loading} = useGoogleLogin();

    useEffect(() => {
        // Validate params exist, if not redirect to login page
        const email = searchParams.get("email");
        const googleId = searchParams.get("googleId");

        if (!email || !googleId) {
            navigate("/login");
        }
    }, [searchParams, navigate]);

    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
                <div className="loading loading-spinner loading-lg"></div>
                <p className="mt-4">
                    {loading ? "Đang hoàn tất đăng nhập Google..." : "Đang xử lý..."}
                </p>
            </div>
        </div>
    );
};

export default GoogleSuccess;
