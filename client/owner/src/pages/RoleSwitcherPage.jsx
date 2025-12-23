// src/pages/RoleSwitcherPage.jsx
import React, { useEffect, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setSelectedRole } from "../redux/slices/authSlice";
import { Shield, Crown, User, LogIn } from "lucide-react";
import { motion } from "framer-motion";
import { getRoleConfig } from "@/config/roleConfig";
import useAssumeRole from "@/hooks/useAssumeRole";

const uiRole = {
    1: { name: "Quản trị viên", icon: Shield, color: "text-error", bg: "bg-red-50", border: "border-error/30", ring: "ring-error/20" },
    2: { name: "Chủ sân", icon: Crown, color: "text-warning", bg: "bg-yellow-50", border: "border-warning/30", ring: "ring-warning/20" },
    3: { name: "Khách hàng", icon: User, color: "text-info", bg: "bg-blue-50", border: "border-info/30", ring: "ring-info/20" },
};

const RoleCard = ({ roleId, onClick }) => {
    const role = uiRole[roleId] || uiRole[3];
    const Icon = role.icon;
    return (
        <motion.div whileHover={{ y: -10, scale: 1.03 }} whileTap={{ scale: 0.97 }} className="group cursor-pointer" onClick={onClick}>
            <div className={`card bg-base-100 border-2 ${role.border} shadow-xl hover:shadow-2xl ring-4 ${role.ring} ring-opacity-0 hover:ring-opacity-100 transition-all duration-300 transform-gpu min-w-[320px]`}>
                <div className="card-body items-center text-center p-10">
                    <div className={`w-24 h-24 rounded-full ${role.bg} flex items-center justify-center mb-6 ring-8 ring-white/60 shadow-2xl group-hover:scale-110 transition-transform duration-300`}>
                        <Icon size={48} className={`${role.color} drop-shadow-lg`} />
                    </div>
                    <h3 className="text-2xl font-bold mb-2">{role.name}</h3>
                    <p className="text-base-content/70 mb-6">Đăng nhập với vai trò này</p>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="flex items-center gap-3 text-primary font-semibold text-lg">
                            <LogIn size={22} />
                            <span>Tiếp tục</span>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

const RoleSwitcherPage = () => {
    const { roles, user } = useSelector((s) => s.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [params] = useSearchParams();
    const rawNext = params.get("next");
    
    // Filter out invalid next paths (login, signup, select-role, google callback, etc.)
    // Also filter out paths that start with /auth/ (authentication related pages)
    const invalidPaths = ["/login", "/signup", "/select-role", "/"];
    const next = rawNext && 
                 !invalidPaths.includes(rawNext) && 
                 !rawNext.startsWith("/auth/")
        ? rawNext 
        : null;
    
    const { assumeRole } = useAssumeRole();

    useEffect(() => {
        // Kiểm tra nếu không có roles hoặc chưa đăng nhập
        if (!roles || roles.length === 0) {
            navigate("/login", { replace: true });
            return;
        }
        
        // Auto-select nếu CHỈ có 1 role
        if (roles.length === 1) {
            assumeRole(roles[0], { next, silent: true }).catch(err => {
                console.error("[RoleSwitcherPage] Auto-select failed:", err);
                // Nếu auto-select fail, redirect về login
                navigate("/login", { replace: true });
            });
        }
    }, [roles, navigate, assumeRole, next]);

    // Đang loading (chưa có roles hoặc đang auto-redirect)
    if (!roles || roles.length === 0 || roles.length === 1) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <span className="loading loading-spinner loading-lg" />
            </div>
        );
    }

    // Hiển thị UI chọn role cho trường hợp nhiều role
    return (
        <div className="min-h-screen bg-gradient-to-br from-base-200 via-primary/5 to-base-200 flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-7xl">
                <div className="text-center mb-16">
                    <h1 className="text-6xl font-bold mb-4">Chào mừng trở lại!</h1>
                    <p className="text-2xl">
                        Xin chào {" "}
                        <span className="font-bold text-primary">{user?.fullName || user?.email || "bạn"}</span>
                    </p>
                    <p className="text-lg mt-4">Vui lòng chọn vai trò để tiếp tục</p>
                </div>

                <div className="flex justify-center">
                    <div className="flex flex-wrap justify-center gap-16">
                        {roles.map((roleId, index) => (
                            <motion.div 
                                key={roleId} 
                                initial={{ opacity: 0, y: 50 }} 
                                animate={{ opacity: 1, y: 0 }} 
                                transition={{ delay: index * 0.15 }}
                            >
                                <RoleCard 
                                    roleId={roleId} 
                                    onClick={() => assumeRole(roleId, { next }).catch(err => {
                                        console.error("[RoleSwitcherPage] Manual select failed:", err);
                                    })} 
                                />
                            </motion.div>
                        ))}
                    </div>
                </div>

                <div className="text-center mt-20">
                    Bạn đang có {" "}
                    <strong className="text-primary">{roles.length}</strong>{" "}
                    vai trò trong hệ thống PickleTime
                </div>
            </motion.div>
        </div>
    );
};

export default RoleSwitcherPage;
