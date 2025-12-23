import {Link, useNavigate} from "react-router-dom";
import Avatar from 'react-avatar';
import ThemeSwitcher from "../common/ThemeSwitcher.jsx";
import {useDispatch, useSelector} from "react-redux";
import {logout, setSelectedRole} from "@redux/slices/authSlice.js";
import {getRoleHomePath} from "@utils/rolePath.jsx";
import NotificationBell from "@components/common/NotificationBell.jsx";
import {Shield, Crown, User} from "lucide-react";
import {getCurrentRoleConfig} from "@/config/roleConfig.js"; // thêm dòng này
import useAssumeRole from "@/hooks/useAssumeRole";

const AuthenticatedNavbar = ({toggleSidebar}) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {user, selectedRoleId, roles = [], userId} = useSelector(state => state.auth);

    const currentRole = selectedRoleId === 1 ? "admin" :
        selectedRoleId === 2 ? "owner" :  // hoặc "manager"
            selectedRoleId === 3 ? "customer" : null;

    // Lọc bỏ role hiện tại
    const otherRoles = roles.filter(id => id !== selectedRoleId);

    const handleLogout = () => {
        dispatch(logout());
        navigate("/", {replace: true});
    };

    // Get a profile path based on the role
    const getProfilePath = () => {
        if (currentRole === "admin") return "/admin/profile";
        if (currentRole === "manager" || currentRole === "owner") return "/owner/profile";
        return "/customer/profile";
    };

    const getRoleLabel = () => {
        if (currentRole === "admin") return "Quản trị viên";
        if (currentRole === "manager" || currentRole === "owner") return "Chủ sân";
        return "Khách hàng";
    };

    const getRoleBadgeColor = () => {
        if (currentRole === "admin") return "badge-error";
        if (currentRole === "manager" || currentRole === "owner") return "badge-warning";
        return "badge-info";
    };
    const { assumeRole } = useAssumeRole();

    return (
        <div className="navbar bg-base-100 fixed top-0 z-50 shadow-md animate-slide-in-top">
            <div className="navbar-start">
                <button
                    className="btn btn-ghost lg:hidden"
                    onClick={toggleSidebar}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M4 6h16M4 12h8m-8 6h16"
                        />
                    </svg>
                </button>
                <Link
                    to={getRoleHomePath(currentRole)}
                    className="btn btn-ghost normal-case text-xl max-sm:p-0"
                >
                    <img
                        src="/logo.png"
                        alt="PickleTime"
                        className="h-10 w-10 mask mask-squircle"
                    />
                    PickleTime
                </Link>
            </div>

            {/* Center links chỉ cho customer */}
            {currentRole === "customer" && (
                <div className="navbar-center hidden lg:flex">
                    <ul className="menu menu-horizontal px-1 gap-1">
                        <li><Link to="/customer">Trang chủ</Link></li>
                        <li><Link to="/customer/turfs">Tìm sân</Link></li>
                        <li><Link to="/customer/turfs">Sân yêu thích</Link></li>
                        <li><Link to="/customer/booking-history">Lịch sử đặt sân</Link></li>
                        <li><Link to="/customer/become-owner" className="text-warning font-medium">Trở thành chủ
                            sân</Link></li>
                    </ul>
                </div>
            )}

            <div className="navbar-end gap-2">
                <ThemeSwitcher/>
                <NotificationBell userId={userId}/>
                {/* User Profile Dropdown */}
                <div className="dropdown dropdown-end">
                    <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
                        <div className="w-10 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                            <Avatar
                                name={user?.fullName || user?.userName || user?.email || "User"}
                                size="40"
                                round="100%"
                            />
                        </div>
                    </label>
                    <ul
                        tabIndex={0}
                        className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow-lg bg-base-100 rounded-box w-64 border border-base-300"
                    >
                        {/* User Info Header */}
                        <li className="menu-title px-4 py-3 bg-base-200 rounded-lg mb-2">
                            <div className="flex items-center gap-3">
                                <Avatar
                                    name={user?.fullName || user?.userName || user?.email || "User"}
                                    size="48"
                                    round="100%"
                                />
                                <div className="flex-1 min-w-0">
                                    <p className="font-bold text-[11px] truncate text-base-content">
                                        {user?.fullName || user?.userName || "User"}
                                    </p>
                                    <p className="text-[10px] opacity-70 truncate leading-tight">
                                        {user?.email || "No email"}
                                    </p>
                                    <div className={`badge ${getRoleBadgeColor()} badge-xs mt-1`}>
                                        {getRoleLabel()}
                                    </div>
                                </div>
                            </div>
                        </li>

                        {/* Profile Link */}
                        <li>
                            <Link to={getProfilePath()} className="gap-3 py-3">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                    />
                                </svg>
                                <span>Hồ sơ cá nhân</span>
                            </Link>
                        </li>

                        {/* Dashboard Link */}
                        <li>
                            <Link to={getRoleHomePath(currentRole)} className="gap-3 py-3">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                                    />
                                </svg>
                                <span>Dashboard</span>
                            </Link>
                        </li>

                        {/* Owner-specific links */}
                        {(currentRole === "manager" || currentRole === "owner") && (
                            <>
                                <li>
                                    <Link to="/owner/turfs" className="gap-3 py-3">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-5 w-5"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                            />
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                            />
                                        </svg>
                                        <span>Sân của tôi</span>
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/owner/bookings" className="gap-3 py-3">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-5 w-5"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                            />
                                        </svg>
                                        <span>Quản lý đặt sân</span>
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/owner/reviews" className="gap-3 py-3">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-5 w-5"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                                            />
                                        </svg>
                                        <span>Đánh giá</span>
                                    </Link>
                                </li>
                            </>
                        )}

                        <div className="divider my-1"></div>

                        {otherRoles.length > 0 && (
                            <>
                                <div className="divider my-2"/>
                                <li className="menu-title"><span className="text-xs opacity-70">Chuyển vai trò</span>
                                </li>
                                {otherRoles.map(id => {
                                    const r = getCurrentRoleConfig(id);
                                    const RoleIcon = r.icon === "Shield" ? Shield : r.icon === "Crown" ? Crown : User;
                                    return (
                                        <li key={id}>
                                                <button onClick={() => assumeRole(id)}
                                                    className="justify-between">
                                                <div className="flex items-center gap-3">
                                                    <RoleIcon size={19} className={r.color}/>
                                                    <span className="font-medium">{r.label}</span>
                                                </div>
                                                <div className="badge badge-outline badge-primary badge-sm">Chuyển</div>
                                            </button>
                                        </li>
                                    );
                                })}
                            </>
                        )}

                        <div className="divider my-1"></div>

                        {/* Logout */}
                        <li>
                            <button
                                onClick={handleLogout}
                                className="gap-3 py-3 text-error hover:bg-error/10 font-medium"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                                    />
                                </svg>
                                <span>Đăng xuất</span>
                            </button>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default AuthenticatedNavbar;
