export const ROLE_CONFIG = {
    1: {
        id: 1,
        key: "admin",
        label: "Quản trị viên",
        badge: "badge-error",
        icon: "Shield",
        color: "text-error",
        homePath: "/admin",
        profilePath: "/admin/profile",
    },
    2: {
        id: 2,
        key: "owner",
        label: "Chủ sân",
        badge: "badge-warning",
        icon: "Crown",
        color: "text-warning",
        homePath: "/owner",
        profilePath: "/owner/profile",
    },
    3: {
        id: 3,
        key: "customer",
        label: "Khách hàng",
        badge: "badge-info",
        icon: "User",
        color: "text-info",
        homePath: "/customer",
        profilePath: "/customer/profile",
    },
};

// Helper functions – dùng khắp nơi
export const getRoleConfig = (roleId) => {
    return ROLE_CONFIG[roleId] || ROLE_CONFIG[3]; // fallback an toàn về customer
};

export const getCurrentRoleConfig = (selectedRoleId) => {
    return getRoleConfig(selectedRoleId);
};