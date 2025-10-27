import {useSelector} from "react-redux";
import {Navigate, Outlet, useLocation} from "react-router-dom";

export default function ProtectedRoute({children, requiredRole}) {
    const {isAuthenticated, role} = useSelector((state) => state?.auth);
    const location = useLocation();

    //  Khi Redux Persist chưa khôi phục state (rehydrate)
    if (isAuthenticated === undefined || role === undefined || isAuthenticated == null || role == null) {
        return (
            <div className="flex items-center justify-center h-screen">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        );
    }

    //  Nếu chưa đăng nhập
    if (!isAuthenticated) {
        return <Navigate to="/login" state={{from: location}} replace/>;
    }

    // console.log("ProtectedRoute:", {isAuthenticated, role, requiredRole});

    //  Chuẩn hoá role
    const normalizedRole = (() => {
        const r = role?.toLowerCase();
        if (r === "manager") return "owner";
        if (r === "user") return "customer"; // 👈 Thêm dòng này
        return r;
    })();

    //  Hỗ trợ 1 hoặc nhiều role
    const allowedRoles = Array.isArray(requiredRole)
        ? requiredRole.map(r => r?.toLowerCase())
        : requiredRole
            ? [requiredRole?.toLowerCase()]
            : [];


    //  Nếu role không nằm trong allowed list
    if (requiredRole && !allowedRoles.includes(normalizedRole)) {
        if (normalizedRole === "admin") {
            return <Navigate to="/admin" replace/>;
        } else if (normalizedRole === "owner") {
            return <Navigate to="/owner" replace/>;
        } else if (normalizedRole === "customer") {
            return <Navigate to="/" replace/>;
        } else {
            return <Navigate to="/" replace/>;
        }
    }

    //  Render nội dung (children hoặc <Outlet />)
    return children ?? <Outlet/>;

}
