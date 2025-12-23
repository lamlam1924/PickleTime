// src/components/ProtectedRoute/ProtectedRoute.jsx
import { useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { getRoleConfig } from "@/config/roleConfig";

const ProtectedRoute = ({ allowedRoleIds = [], children }) => {
    const {
        isAuthenticated,
        token,
        roles,
        selectedRoleId,
    } = useSelector((state) => state.auth);

    const location = useLocation();

    // 1. Chưa hydrate xong redux-persist
    if (isAuthenticated === undefined) {
        return (
            <div className="flex items-center justify-center h-screen">
                <span className="loading loading-spinner loading-lg" />
            </div>
        );
    }

    if (import.meta?.env?.MODE !== "production") {
        console.debug("[ProtectedRoute] state", { isAuthenticated, hasToken: !!token, roles, selectedRoleId, allowedRoleIds, path: location.pathname });
    }

    // 2. Chưa đăng nhập
    if (!isAuthenticated || !token) {
        return (
            <Navigate
                to="/login"
                state={{ from: location }}
                replace
            />
        );
    }

    // 3. Không có role nào → coi như lỗi hệ thống
    if (!roles || roles.length === 0) {
        return <Navigate to="/login" replace />;
    }

    // 4. CHƯA CHỌN ROLE → đưa về trang chọn role, giữ deep-link bằng next
    if (!selectedRoleId) {
        if (roles.length > 1) {
            const next = encodeURIComponent(location.pathname + location.search);
            if (import.meta?.env?.MODE !== "production") {
                console.debug("[ProtectedRoute] no selectedRoleId, multiple roles → redirect to select-role", { next });
            }
            return <Navigate to={`/select-role?next=${next}`} replace />;
        }
        // Nếu chỉ có 1 role, để RoleSwitcher tự xử lý auto-chọn.
    }

    const effectiveRoleId = selectedRoleId || (roles.length === 1 ? roles[0] : null);

    // 5. Route có yêu cầu role cụ thể
    if (
        allowedRoleIds.length > 0 &&
        (!effectiveRoleId || !allowedRoleIds.includes(effectiveRoleId))
    ) {
        // Vai trò hiện tại không phù hợp route này → yêu cầu chọn lại role
        const next = encodeURIComponent(location.pathname + location.search);
        if (import.meta?.env?.MODE !== "production") {
            console.debug("[ProtectedRoute] role not allowed → redirect select-role", { effectiveRoleId, allowedRoleIds, next });
        }
        return <Navigate to={`/select-role?next=${next}`} replace />;
    }

    // 6. HỢP LỆ → render layout (children) nếu được truyền, nếu không thì dùng Outlet cho cấu trúc lồng route
    return children ? children : <Outlet />;
};

export default ProtectedRoute;
