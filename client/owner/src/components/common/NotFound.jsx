import React from "react";
import { Link, useNavigate } from "react-router-dom";

const NotFound = () => {
    const navigate = useNavigate();

    const handleGoBack = () => {
        if (window.history.length > 1) navigate(-1);
        else navigate("/");
    };

    return (
        <div className="min-h-screen bg-base-200 flex items-center justify-center">
            <div className="text-center">
                <h1 className="text-9xl font-bold text-primary">404</h1>
                <p className="text-2xl font-semibold mt-4 mb-8">
                    Rất tiếc! Không tìm thấy trang
                </p>
                <p className="text-lg mb-8">
                    Trang bạn đang tìm không tồn tại hoặc đã bị di chuyển.
                </p>
                <button onClick={handleGoBack} className="btn btn-primary">
                    Quay lại
                </button>
            </div>
        </div>
    );
};

export default NotFound;
