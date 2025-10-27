// src/utils/rolePath.js
export function getRoleHomePath(role) {
    if (!role) return "/";

    const normalized = role.toLowerCase();

    const map = {
        admin: "/admin",
        owner: "/owner",
        manager: "/owner",
        customer: "/customer",
        user: "/customer",
    };

    return map[normalized] || "/";
}
