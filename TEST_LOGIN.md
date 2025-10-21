# Test Login và Fix 403 Error

## Vấn đề đã sửa:
1. ✅ JWT claim mapping - Added `JwtSecurityTokenHandler.DefaultInboundClaimTypeMap.Clear()`  
2. ✅ Role claim type - Added `RoleClaimType = ClaimTypes.Role` trong JWT validation
3. ✅ Frontend component - Added safe destructuring với default values
4. ✅ Error handling - Added better error display

## Các bước test:

### 1. Xóa token cũ trong browser
```javascript
// Mở Console (F12) và chạy:
localStorage.clear();
location.reload();
```

### 2. Login lại
- Truy cập: http://localhost:5173/login
- Đăng nhập với user có role "manager" (owner)
  - Email: manager1@pickleball.vn  
  - Password: (check trong database hoặc dùng bcrypt hash)

### 3. Kiểm tra token
```javascript
// Trong Console:
const auth = JSON.parse(localStorage.getItem('persist:root'));
const authData = JSON.parse(auth.auth);
console.log('Token:', authData.token);
console.log('Role:', authData.role);
console.log('User ID:', authData.userId);
```

### 4. Decode JWT token
```javascript
// Decode token payload:
const token = authData.token;
const payload = JSON.parse(atob(token.split('.')[1]));
console.log('JWT Payload:', payload);
console.log('Role claim:', payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']);
```

### 5. Test Dashboard API
```javascript
// Test với fetch:
const token = JSON.parse(JSON.parse(localStorage.getItem('persist:root')).auth).token;

fetch('http://localhost:5104/api/owner/profile/dashboard', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
})
.then(r => r.json())
.then(data => console.log('Dashboard data:', data))
.catch(err => console.error('Error:', err));
```

## Expected Results:
- ✅ Login successful với JWT token
- ✅ Role được lưu trong Redux: "manager"
- ✅ Dashboard API returns 200 OK với data
- ✅ No 403 Forbidden errors

## Nếu vẫn lỗi 403:
1. Check backend logs xem request có đến không
2. Check xem JWT token có được gửi trong Authorization header không
3. Verify role trong database: `SELECT * FROM Users WHERE Email = 'manager1@pickleball.vn'`
4. Verify role name: `SELECT * FROM Roles` (phải có role "manager" hoặc "Manager")

## Database Query để tạo user test:
```sql
-- Check existing users and roles
SELECT u.UserID, u.Email, u.UserName, r.RoleName 
FROM Users u 
INNER JOIN Roles r ON u.RoleID = r.RoleID
WHERE u.Email LIKE '%manager%';

-- If no manager exists, check what roles are available
SELECT * FROM Roles;
```
