import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axiosInstance from "@hooks/useAxiosInstance.js";
import { setSelectedRole, updateToken } from "@/redux/slices/authSlice";
import { getRoleConfig } from "@/config/roleConfig";
import { persistor } from "@/redux/store";
import toast from "react-hot-toast";

export default function useAssumeRole() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const assumeRole = useCallback(async (roleId, options = {}) => {
    const { next, silent } = options;
    
    try {
      console.log("[useAssumeRole] Starting - roleId:", roleId, "options:", options);
      console.log("[useAssumeRole] Token in localStorage:", !!localStorage.getItem("accessToken"));
      
      // Gọi API select-role để lấy token mới với role đã chọn
      const res = await axiosInstance.post("/auth/select-role", { roleId });
      console.log("[useAssumeRole] API response:", res.data);
      
      const newToken = res.data?.accessToken || res.data?.token;
      
      // Cập nhật token mới vào localStorage
      if (newToken) {
        localStorage.setItem("accessToken", newToken);
        // Cập nhật token trong Redux state
        dispatch(updateToken(newToken));
        console.log("[useAssumeRole] Token updated");
      } else {
        console.warn("[useAssumeRole] No new token received from API");
      }

      // Cập nhật selectedRoleId trong Redux
      dispatch(setSelectedRole(roleId));
      
      // Lưu role đã chọn để lần sau có thể suggest
      localStorage.setItem("lastSelectedRole", String(roleId));

      // Đợi Redux persist flush xuống localStorage
      await persistor.flush();

      // Debug logging
      console.log("[useAssumeRole] After dispatch - roleId:", roleId, "newToken:", !!newToken);

      // Hiển thị thông báo thành công (nếu không silent)
      if (!silent) {
        const cfg = getRoleConfig(roleId);
        toast.success(`Đã chuyển sang vai trò ${cfg.label}`);
      }

      // Thêm delay nhỏ để đảm bảo state đã được sync hoàn toàn
      await new Promise(resolve => setTimeout(resolve, 100));

      // Điều hướng đến trang đích
      if (typeof next === "string" && next.length > 0) {
        // Nếu có tham số next, điều hướng đến đó
        const target = decodeURIComponent(next);
        console.log("[useAssumeRole] Navigate to next:", target);
        navigate(target, { replace: true });
      } else {
        // Nếu không có next, điều hướng đến trang home của role
        const cfg = getRoleConfig(roleId);
        console.log("[useAssumeRole] Navigate to homePath:", cfg.homePath);
        navigate(cfg.homePath || "/", { replace: true });
      }
      
    } catch (error) {
      console.error("[useAssumeRole] Error:", error);
      console.error("[useAssumeRole] Error response:", error.response?.data);
      console.error("[useAssumeRole] Error status:", error.response?.status);
      
      // Xử lý lỗi
      if (error.response?.status === 403) {
        toast.error("Bạn không có quyền truy cập vai trò này");
      } else if (error.response?.status === 401) {
        toast.error("Phiên đăng nhập đã hết hạn");
        navigate("/login", { replace: true });
      } else {
        if (!silent) {
          toast.error(error.response?.data?.message || "Không thể chuyển vai trò. Vui lòng thử lại.");
        }
      }
      throw error; // Re-throw để RoleSwitcherPage có thể xử lý
    }
  }, [dispatch, navigate]);

  return { assumeRole };
}
