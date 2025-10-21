# PickleTime - Setup & Run Guide

## 🚀 Quick Start

### Backend Setup (ASP.NET Core)

1. **Navigate to API folder:**
```bash
cd /Users/Documents/PickleTime/PickleTime.Api
```

2. **Update appsettings.json với Google credentials (nếu dùng Google Login):**
```json
{
  "Google": {
    "ClientId": "your-google-client-id.apps.googleusercontent.com",
    "ClientSecret": "your-google-client-secret"
  }
}
```

3. **Run Backend:**
```bash
dotnet run
```

Backend sẽ chạy ở: `http://localhost:5104`
Swagger UI: `http://localhost:5104/swagger`

---

### Frontend Setup (React + Vite)

1. **Navigate to owner folder:**
```bash
cd /Users/Documents/PickleTime/client/owner
```

2. **Install dependencies (nếu chưa):**
```bash
npm install
```

3. **Run Frontend:**
```bash
npm run dev
```

Frontend sẽ chạy ở: `http://localhost:5173`

---

## 🔧 Cấu hình đã sửa

### Backend Changes:
- ✅ Thêm Google Authentication package
- ✅ CORS cho phép `http://localhost:5173`
- ✅ Endpoints: `/api/auth/login`, `/api/auth/google-login`, `/api/auth/request-password-reset`, `/api/auth/reset-password`
- ✅ Owner endpoints: `/api/owner/profile/*`, `/owner/turf/*`, `/owner/bookings`, etc.

### Frontend Changes:
- ✅ `axiosInstance` baseURL: `http://localhost:5104/api`
- ✅ `withCredentials: true` cho CORS
- ✅ Login response handling: Backend trả về `{ token, message }`
- ✅ JWT decode để lấy role từ token payload
- ✅ Google Login với backend flow

---

## 📝 Test Login

### Test Normal Login:

**URL:** `http://localhost:5173/login`

**Test Credentials:**
```
Email: test@example.com
Password: 123456
```

**Backend Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "message": "Login successful"
}
```

**JWT Token Payload includes:**
- User ID
- Email
- Role (Admin/Manager/User)
- Expiration time

---

## 🔑 Roles trong hệ thống

1. **Admin** → Redirect to `/admin`
2. **Manager (Owner)** → Redirect to `/owner`
3. **Customer/User** → Redirect to `/customer`

Role được lấy từ JWT token claim:
- `role` hoặc
- `http://schemas.microsoft.com/ws/2008/06/identity/claims/role`

---

## 🐛 Troubleshooting

### Backend không chạy?
```bash
# Check port 5104
lsof -i :5104

# Rebuild project
dotnet clean
dotnet build
dotnet run
```

### Frontend không kết nối được backend?
1. Kiểm tra backend đang chạy ở `http://localhost:5104`
2. Kiểm tra CORS trong `Program.cs` - phải có `http://localhost:5173`
3. Mở Console trong browser (F12) để xem errors
4. Kiểm tra Network tab để xem request/response

### Google Login không hoạt động?
1. Thêm Google credentials vào `appsettings.json`
2. Configured redirect URI trong Google Console: `http://localhost:5104/signin-google`
3. Kiểm tra Package `Microsoft.AspNetCore.Authentication.Google` đã được install

### Login failed với "Invalid email or password"?
1. Kiểm tra user có tồn tại trong database không
2. Password phải được hash bằng BCrypt
3. Check `StatusId = 1` (Active)

---

## 📊 Database

**Connection String:**
```
Server=localhost;Database=PICKLEBALLBOOKING;User Id=sa;Password=123;TrustServerCertificate=True;
```

**Cần ensure:**
- SQL Server đang chạy
- Database `PICKLEBALLBOOKING` tồn tại
- Đã chạy migrations (nếu có)

---

## 🎯 API Endpoints Summary

### Public Endpoints:
- `POST /api/auth/login` - Login với email/password
- `POST /api/auth/google-login` - Login với Google
- `POST /api/auth/request-password-reset` - Request reset password
- `POST /api/auth/reset-password` - Confirm reset password

### Protected Endpoints (Owner):
- `GET /api/owner/profile/dashboard` - Owner dashboard stats
- `GET /api/owner/profile` - Get owner profile
- `PUT /api/owner/profile` - Update owner profile
- `GET /owner/bookings` - Get all bookings
- `POST /owner/turf/register` - Register new turf
- `GET /owner/turf/all` - Get all turfs
- `PUT /owner/turf/{id}` - Update turf
- `GET /owner/reviews/turfs-with-reviews` - Get reviews

**Note:** Protected endpoints cần `Authorization: Bearer {token}` header

---

## ✅ Current Status

- ✅ Backend build successful
- ✅ Frontend configured
- ✅ CORS setup correctly
- ✅ JWT authentication ready
- ✅ Google login integrated
- ✅ Password reset flow ready
- ✅ Owner endpoints implemented

## 🚦 Ready to test!

Run both services và test login tại `http://localhost:5173/login`
