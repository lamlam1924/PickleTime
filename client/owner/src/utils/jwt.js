export function parseJwt(token) {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return {};
    // Base64URL decode
    const payload = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const decoded = atob(payload);
    const json = decodeURIComponent(
      decoded
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(json);
  } catch {
    try {
      // Fallback simple atob parse
      return JSON.parse(atob(token.split('.')[1] || '')) || {};
    } catch {
      return {};
    }
  }
}

export function extractUserFromJwt(token) {
  const p = parseJwt(token);

  // Roles: ưu tiên claim tùy biến 'roles' (CSV roleId), sau đó mới tới role name claims
  let roleIds = [];
  if (typeof p.roles === 'string' && p.roles.length) {
    roleIds = p.roles
      .split(',')
      .map(s => Number(s.trim()))
      .filter(n => Number.isFinite(n) && n > 0);
  }

  // Thu thập thêm từ các claim role name nếu cần (ít ưu tiên hơn)
  if (!roleIds.length) {
    const roleNames = []
      .concat(p.role || [])
      .concat(p['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || [])
      .flat()
      .filter(Boolean);
    // Giữ nguyên tên nếu không convert được, để caller có thể fallback tiếp
    roleIds = roleNames.map(r => Number(r)).filter(n => Number.isFinite(n) && n > 0);
  }

  const id =
    p.sub ||
    p.uid ||
    p['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'] ||
    null;

  const email =
    p.email ||
    p['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'] ||
    null;

  const name =
    p.name ||
    p['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] ||
    p.given_name ||
    null;

  return { id, email, name, roles: Array.from(new Set(roleIds)) };
}
