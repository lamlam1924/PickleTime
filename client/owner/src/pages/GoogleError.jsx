import {useSearchParams, Link} from "react-router-dom";

const GoogleError = () => {
    const [searchParams] = useSearchParams();
    const message = searchParams.get("message") || "Đăng nhập bằng Google không thành công.";

    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="card w-full max-w-md bg-base-100 shadow-xl">
                <div className="card-body text-center">
                    <div className="text-error text-6xl mb-4">⚠️</div>
                    <h2 className="card-title justify-center text-error">Đăng nhập thất bại</h2>
                    <p className="text-base-content/70">{message}</p>
                    <div className="card-actions justify-center mt-6">
                        <Link to="/login" className="btn btn-primary">
                            Thử lại
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GoogleError;
