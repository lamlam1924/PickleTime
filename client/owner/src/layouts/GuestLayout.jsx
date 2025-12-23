import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import GuestNavbar from "../components/layout/GuestNavbar";

const GuestLayout = () => {
  const { isAuthenticated, roles = [], selectedRoleId } = useSelector((s) => s.auth);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Không redirect nếu đang ở trang select-role
    if (location.pathname === "/select-role") return;
    
    if (!isAuthenticated) return;
    if (!roles || roles.length === 0) return;
    
    // Nếu đã chọn role rồi, không cần làm gì (user sẽ được ProtectedRoute xử lý)
    if (selectedRoleId) return;
    
    // Nếu có nhiều role mà chưa chọn, redirect về trang chọn role
    if (roles.length > 1) {
      // Danh sách các path không hợp lệ để làm "next" parameter
      const invalidNextPaths = ["/login", "/signup", "/select-role", "/", "/reset-password", "/forgot-password"];
      const isAuthPath = location.pathname.startsWith("/auth/");
      
      // Chỉ thêm next nếu là path hợp lệ và không phải auth path
      const shouldAddNext = 
        !invalidNextPaths.includes(location.pathname) && 
        !isAuthPath &&
        location.pathname !== "/";
      
      if (shouldAddNext) {
        const next = encodeURIComponent(location.pathname + location.search);
        navigate(`/select-role?next=${next}`, { replace: true });
      } else {
        navigate("/select-role", { replace: true });
      }
    }
  }, [isAuthenticated, roles, selectedRoleId, location.pathname, location.search, navigate]);

  return (
    <div className="flex flex-col min-h-screen ">
      <GuestNavbar />
      <main className="flex-grow pt-16 ">
        <Outlet />
      </main>
    </div>
  );
};

export default GuestLayout;
