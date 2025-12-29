# 🔄 LUỒNG BACKEND - FRONTEND

> Document mô tả cách Backend (ASP.NET Core) và Frontend (React) giao tiếp trong dự án PickleTime

---

## 1. KIẾN TRÚC TỔNG QUAN

### Backend: Clean Architecture

```
HTTP Request
    ↓
Controllers/           → Nhận HTTP request, gọi Service
    ↓
Application/
  ├── Services/        → Business logic
  └── Contracts/       → Interfaces + DTOs
    ↓
Infrastructure/
  └── Repositories/    → Truy vấn Database (EF Core)
    ↓
Domain/Entities/       → Entity models (database tables)
    ↓
SQL Server Database
```

**Dependency Flow:** Controllers → Services → Repositories → DbContext → Database

### Frontend: Layered Architecture

```
User Action
    ↓
Components/            → UI, handle events
    ↓
Hooks/                 → Business logic (useState, useEffect)
    ↓
Services/api/          → API calls (endpoint definitions)
    ↓
useAxiosInstance.js    → HTTP client (add token, handle errors)
    ↓
HTTP → Vite Proxy → Backend
```

**Dependency Flow:** Components → Hooks → API Services → Axios → Backend

---

## 2. VÍ DỤ: ĐĂNG NHẬP

### Frontend Flow

```jsx
// 1. Component: LoginForm.jsx
<form onSubmit={handleSubmit(onSubmit)}>
  <input {...register("email")} />
  <input {...register("password")} />
  <button type="submit">Đăng nhập</button>
</form>

// 2. Hook: useLoginForm.jsx
const onSubmit = async (data) => {
  const response = await authApi.login(data);  // ← Gọi API Service
  localStorage.setItem('accessToken', response.accessToken);
  dispatch(login(response));
  navigate('/dashboard');
};

// 3. API Service: authApi.js
export const authApi = {
  login: async (credentials) => {
    const response = await axiosInstance.post("/auth/login", credentials);
    return response.data;
  }
};

// 4. Axios Instance tự động thêm config:
// - baseURL: "/api" 
// - Authorization: Bearer <token> (cho protected routes)
```

**HTTP Request thực tế:**
```http
POST http://localhost:5174/api/auth/login
Content-Type: application/json

{"email": "user@ex.com", "password": "123"}
```

**Vite Proxy chuyển sang:**
```http
POST http://localhost:5104/api/auth/login
```

### Backend Flow

```csharp
// 1. Controller: AuthController.cs
[HttpPost("login")]
public async Task<IActionResult> Login([FromBody] LoginRequestDto request)
{
    var result = await _authService.LoginAsync(request);  // ← Gọi Service
    return Ok(result);
}

// 2. Service: AuthService.cs
public async Task<LoginResponseDto> LoginAsync(LoginRequestDto request)
{
    var user = await _userRepository.GetByEmailWithRolesAsync(request.Email);  // ← Gọi Repository
    
    // Verify password
    if (!BCrypt.Net.BCrypt.Verify(request.Password, user.PassWord))
        throw new UnauthorizedAccessException("Sai mật khẩu");
    
    // Generate JWT token
    var token = _jwtService.GenerateToken(user);
    
    return new LoginResponseDto { AccessToken = token, User = ... };
}

// 3. Repository: UserRepository.cs
public async Task<User?> GetByEmailWithRolesAsync(string email)
{
    return await _context.Users
        .Include(u => u.Role)
        .FirstOrDefaultAsync(u => u.Email == email);
}
```

**SQL được EF Core generate:**
```sql
SELECT u.*, r.* FROM Users u
LEFT JOIN Roles r ON u.RoleId = r.RoleId
WHERE u.Email = @email
```

**HTTP Response:**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "abc123...",
  "user": {
    "userId": 1,
    "email": "user@example.com",
    "fullName": "Nguyen Van A",
    "roleId": 2,
    "roleName": "Manager"
  }
}
```

---

## 3. VÍ DỤ: LẤY DANH SÁCH FACILITIES

### Frontend Flow

```jsx
// Component: TurfManagement.jsx
const { turfs, isLoading, fetchTurfs } = useTurfManagement();

useEffect(() => {
  fetchTurfs();  // Gọi khi component mount
}, []);

// Hook: useTurfManagement.jsx
const fetchTurfs = async () => {
  const response = await axiosInstance.get("/owner/profile/facilities");
  const facilities = response.data.data;
  setTurfs(transformData(facilities));
};
```

**HTTP Request:**
```http
GET http://localhost:5104/api/owner/profile/facilities
Authorization: Bearer <token>
```

### Backend Flow

```csharp
// Controller: OwnerProfileController.cs
[Authorize(Roles = "Manager")]  // ← Yêu cầu JWT token
[HttpGet("facilities")]
public async Task<IActionResult> GetOwnerFacilities()
{
    var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);  // ← Lấy UserId từ JWT
    var facilities = await _ownerProfileService.GetOwnerFacilitiesAsync(userId);
    return Ok(new { success = true, data = facilities });
}

// Service: OwnerProfileService.cs
public async Task<List<FacilitySummaryDto>> GetOwnerFacilitiesAsync(int userId)
{
    var facilities = await _facilityRepository.GetFacilitiesByOwnerIdAsync(userId);
    return _mapper.Map<List<FacilitySummaryDto>>(facilities);  // ← Entity → DTO
}

// Repository: FacilityRepository.cs
public async Task<List<Facility>> GetFacilitiesByOwnerIdAsync(int ownerId)
{
    return await _context.Facilities
        .Where(f => f.OwnerId == ownerId && !f.IsDeleted)
        .Include(f => f.Courts)
        .Include(f => f.FacilityImages)
        .ToListAsync();
}
```

**SQL Generated:**
```sql
SELECT f.*, c.*, fi.*
FROM Facilities f
LEFT JOIN Courts c ON f.FacilityId = c.FacilityId
LEFT JOIN FacilityImages fi ON f.FacilityId = fi.FacilityId
WHERE f.OwnerId = @ownerId AND f.IsDeleted = 0
```

---

## 4. VÍ DỤ: TẠO BOOKING

### Frontend Flow

```jsx
// Hook: useReservation.jsx
const handleBooking = async (bookingData) => {
  try {
    const result = await bookingApi.createBooking(bookingData);
    toast.success('Đặt sân thành công!');
    navigate('/bookings/success');
  } catch (error) {
    if (error.response?.status === 409) {
      toast.error('Sân đã được đặt trong khung giờ này');
    }
  }
};

// API Service: bookingApi.js
export const createBooking = async (data) => {
  const response = await axiosInstance.post('/bookings', {
    facilityId: data.facilityId,
    courtId: data.courtId,
    bookingDate: data.date,
    startTime: data.startTime,
    duration: data.duration
  });
  return response.data;
};
```

### Backend Flow

```csharp
// Controller: BookingsController.cs
[Authorize]
[HttpPost]
public async Task<IActionResult> CreateBooking([FromBody] CreateBookingDto dto)
{
    var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);
    var booking = await _bookingService.CreateBookingAsync(userId, dto);
    return Ok(new { success = true, data = booking });
}

// Service: BookingService.cs
public async Task<BookingDto> CreateBookingAsync(int userId, CreateBookingDto dto)
{
    // 1. Check availability
    var existingBookings = await _bookingRepository.GetBookingsByCourtAndDateAsync(...);
    if (!CheckTimeSlotAvailability(...))
        throw new InvalidOperationException("Khung giờ đã được đặt");
    
    // 2. Calculate pricing
    var pricing = CalculatePricing(court, dto.StartTime, dto.Duration);
    
    // 3. Create booking
    var booking = new Booking { ... };
    await _bookingRepository.AddAsync(booking);
    
    return _mapper.Map<BookingDto>(booking);
}
```

---

## 5. CẤU TRÚC THƯ MỤC

### Backend

```
PickleTime.Api/
├── Controllers/          → AuthController, FacilitiesController, BookingsController
├── Application/
│   ├── Contracts/        → Interfaces (IAuthService, IFacilityService) + DTOs
│   ├── Services/         → Business logic (AuthService, FacilityService)
│   └── Mapping/          → AutoMapper profiles
├── Domain/Entities/      → User, Facility, Court, Booking (database models)
├── Infrastructure/
│   ├── Data/             → PickleTimeDbContext (EF Core)
│   └── Repositories/     → UserRepository, FacilityRepository
└── Program.cs            → Dependency Injection, JWT config
```

### Frontend

```
client/owner/src/
├── components/           → UI components (admin/, owner/, customer/)
├── hooks/                → Custom hooks với business logic
│   ├── admin/            → useUserManagement, useTransactionManagement
│   ├── owner/            → useTurfManagement, useOwnerReviews
│   ├── customer/         → useBookingHistory
│   └── useAxiosInstance.js  → HTTP client config
├── services/api/         → API endpoint definitions
│   ├── authApi.js        → Login, register, google login
│   ├── facilityApi.js    → Get facilities, search
│   ├── bookingApi.js     → Create booking, get slots
│   ├── ownerApi.js       → Owner operations
│   └── adminApi.js       → Admin operations
├── redux/                → Global state (authSlice, bookingSlice)
├── pages/                → Route components
├── config/               → api.config.js (API_ENDPOINTS)
└── router.jsx            → React Router config
```

---

## 6. AXIOS CONFIGURATION

### useAxiosInstance.js

```javascript
const axiosInstance = axios.create({
  baseURL: "/api",              // Vite proxy: /api → http://localhost:5104/api
  withCredentials: true,
  timeout: 30000
});

// Request Interceptor: Tự động thêm token
axiosInstance.interceptors.request.use((config) => {
  const publicEndpoints = ['/auth/login', '/auth/register'];
  const isPublic = publicEndpoints.some(ep => config.url?.includes(ep));
  
  if (!isPublic) {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Response Interceptor: Handle errors
axiosInstance.interceptors.response.use(
  response => response,
  async error => {
    if (error.response?.status === 401) {
      // Token expired → Try refresh hoặc logout
      localStorage.removeItem('accessToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

### Vite Proxy (vite.config.js)

```javascript
export default defineConfig({
  server: {
    port: 5174,
    proxy: {
      '/api': {
        target: 'http://localhost:5104',
        changeOrigin: true
      }
    }
  }
});
```

---

## 7. AUTHENTICATION FLOW

### JWT Token Flow

```
1. Login → Backend verify credentials
2. Backend generate JWT token (payload: userId, email, role)
3. Frontend lưu token vào localStorage
4. Mọi request tiếp theo: Axios Interceptor tự động thêm "Authorization: Bearer <token>"
5. Backend validate token qua [Authorize] attribute
6. Backend extract Claims (UserId, Role) từ token
7. Controller dùng User.FindFirst(ClaimTypes.NameIdentifier) để lấy UserId
```

### Protected Routes

**Backend:**
```csharp
[Authorize]                      // Yêu cầu đăng nhập
[Authorize(Roles = "Manager")]   // Yêu cầu role Manager
[Authorize(Roles = "Admin,Manager")]  // Admin HOẶC Manager
```

**Frontend:**
```jsx
// Axios tự động thêm token
const data = await ownerApi.getDashboardStats();
```

---

## 8. ERROR HANDLING

### HTTP Status Codes

| Code | Nghĩa | Frontend xử lý |
|------|-------|----------------|
| 400 | Validation error | Hiện error message |
| 401 | Token invalid/expired | Refresh token hoặc logout |
| 403 | Không đủ quyền | "Bạn không có quyền truy cập" |
| 404 | Không tìm thấy | "Dữ liệu không tồn tại" |
| 409 | Business logic error | Hiện message cụ thể |
| 500 | Server error | "Lỗi hệ thống" |

### Backend Error Pattern

```csharp
try {
    var result = await _service.DoSomething();
    return Ok(result);
}
catch (InvalidOperationException ex) {
    return Conflict(new { success = false, message = ex.Message });
}
catch (UnauthorizedAccessException ex) {
    return Unauthorized(new { success = false, message = ex.Message });
}
catch (Exception ex) {
    return StatusCode(500, new { success = false, message = "Internal error" });
}
```

### Frontend Error Pattern

```jsx
try {
  const result = await api.doSomething();
  toast.success('Thành công!');
} catch (error) {
  if (error.response) {
    toast.error(error.response.data.message);
  } else if (error.request) {
    toast.error('Không thể kết nối server');
  }
}
```

---

## 9. DATA FLOW SUMMARY

### Request Direction (Frontend → Backend)

```
Component
  ↓ event handler
Hook
  ↓ call API function
API Service (facilityApi.js)
  ↓ axiosInstance.get/post
Axios Instance
  ↓ add token interceptor
HTTP Request
  ↓ Vite proxy
Backend Controller
  ↓ validate + get UserId from JWT
Backend Service
  ↓ business logic
Backend Repository
  ↓ EF Core query
Database
```

### Response Direction (Backend → Frontend)

```
Database
  ↓ raw data
Entity (Domain model)
  ↓ AutoMapper
DTO (Data Transfer Object)
  ↓ ASP.NET serialize
JSON response
  ↓ HTTP
Axios Instance
  ↓ interceptor check errors
API Service
  ↓ return data
Hook
  ↓ setState
Component re-render
```

---

## 10. KEY POINTS

### Backend (ASP.NET Core)
- **Clean Architecture**: Controllers → Services → Repositories → Database
- **Entity Framework Core**: ORM để query database
- **AutoMapper**: Entity → DTO (không expose Entity ra ngoài)
- **JWT Authentication**: Validate token qua [Authorize] attribute
- **Dependency Injection**: Đăng ký services trong Program.cs

### Frontend (React)
- **Layered Architecture**: Components → Hooks → API Services → Axios
- **Custom Hooks**: Encapsulate business logic (useState, useEffect)
- **API Service Layer**: Centralize endpoint definitions
- **Axios Interceptors**: Tự động add token, handle errors
- **Redux**: Global state cho auth, booking, etc.

### Communication
- **Frontend → Backend**: JSON qua HTTP (POST/GET/PUT/DELETE)
- **Authentication**: JWT token trong Authorization header
- **Proxy**: Vite proxy để avoid CORS (/api → http://localhost:5104/api)
- **Error Handling**: Axios interceptor + try-catch pattern

---

**Last Updated:** December 28, 2025
