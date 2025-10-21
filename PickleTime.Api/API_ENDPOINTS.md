# PickleTime API Endpoints

## Authentication Endpoints

### 1. Login với Email/Password
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "yourpassword"
}
```

**Response:**
```json
{
  "token": "jwt-token-here",
  "message": "Login successful"
}
```

---

### 2. Login với Google
```http
POST /api/auth/google-login
Content-Type: application/json

{
  "email": "user@gmail.com",
  "name": "User Name",
  "googleId": "google-id-here"
}
```

**Response:**
```json
{
  "token": "jwt-token-here",
  "message": "Google login successful"
}
```

---

### 3. Request Password Reset
```http
POST /api/auth/request-password-reset
Content-Type: application/json

{
  "email": "user@example.com"
}
```

**Response:**
```json
{
  "message": "If your email exists in our system, you will receive a password reset link."
}
```

---

### 4. Reset Password
```http
POST /api/auth/reset-password
Content-Type: application/json

{
  "token": "reset-token-from-email",
  "newPassword": "newpassword123",
  "confirmPassword": "newpassword123"
}
```

**Response:**
```json
{
  "message": "Password reset successfully."
}
```

---

## Owner Profile Endpoints
**Requires Authentication:** `Bearer {token}` in Authorization header  
**Role Required:** Manager/Owner

### 1. Get Owner Dashboard
```http
GET /api/owner/profile/dashboard
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "totalRevenue": 50000,
    "monthlyRevenue": 15000,
    "totalBookings": 150,
    "totalFacilities": 5,
    "bookingsPerFacility": [...],
    "revenueOverTime": [...]
  }
}
```

---

### 2. Get Owner Profile
```http
GET /api/owner/profile
Authorization: Bearer {token}
```

---

### 3. Update Owner Profile
```http
PUT /api/owner/profile
Authorization: Bearer {token}
Content-Type: application/json

{
  "fullName": "Updated Name",
  "phone": "0123456789",
  "address": "New Address"
}
```

---

### 4. Get All Facilities
```http
GET /api/owner/profile/facilities
Authorization: Bearer {token}
```

---

### 5. Get Facility Details
```http
GET /api/owner/profile/facilities/{facilityId}
Authorization: Bearer {token}
```

---

### 6. Get Revenue by Period
```http
GET /api/owner/profile/revenue?periodType=monthly&count=12
Authorization: Bearer {token}
```

**Query Parameters:**
- `periodType`: "monthly" or "daily"
- `count`: number of periods to return

---

### 7. Get Facility Reviews
```http
GET /api/owner/profile/reviews?facilityId={id}&page=1&pageSize=10
Authorization: Bearer {token}
```

---

### 8. Change Password
```http
PUT /api/owner/profile/password
Authorization: Bearer {token}
Content-Type: application/json

{
  "currentPassword": "oldpassword",
  "newPassword": "newpassword123",
  "confirmPassword": "newpassword123"
}
```

---

### 9. Get Owner Bookings
```http
GET /owner/bookings
Authorization: Bearer {token}
```

**Response:**
```json
[
  {
    "bookingId": 1,
    "turfName": "Court A",
    "customerName": "John Doe",
    "bookingDate": "2025-10-20",
    "startTime": "10:00:00",
    "endTime": "12:00:00",
    "totalAmount": 500,
    "status": "Confirmed",
    "paymentStatus": "Paid"
  }
]
```

---

### 10. Register New Turf
```http
POST /owner/turf/register
Authorization: Bearer {token}
Content-Type: multipart/form-data

{
  "name": "New Turf",
  "description": "Description here",
  "location": "Address here",
  "pricePerHour": 1000,
  "image": [file],
  "openTime": "06:00 AM",
  "closeTime": "10:00 PM",
  "sportTypes": ["Pickleball", "Tennis"]
}
```

---

### 11. Get All Owner Turfs
```http
GET /owner/turf/all
Authorization: Bearer {token}
```

---

### 12. Update Turf
```http
PUT /owner/turf/{id}
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Updated Turf Name",
  "description": "Updated description",
  "pricePerHour": 1200
}
```

---

### 13. Get Turfs with Reviews
```http
GET /owner/reviews/turfs-with-reviews
Authorization: Bearer {token}
```

**Response:**
```json
[
  {
    "facilityId": 1,
    "name": "Court A",
    "location": "Address",
    "averageRating": 4.5,
    "totalReviews": 10,
    "reviews": [...]
  }
]
```

---

## Notes

### Authentication
- All protected endpoints require `Authorization: Bearer {token}` header
- Token expires after 60 minutes (configurable in appsettings.json)
- Owner endpoints require Manager/manager role

### CORS
- Configured for: `http://localhost:3000`, `http://localhost:5173`, `http://localhost:5174`
- Modify in `Program.cs` if needed

### Database
- Connection string in `appsettings.json`
- Default: `Server=localhost;Database=PICKLEBALLBOOKING;User Id=sa;Password=123;TrustServerCertificate=True;`

### Google Login Setup
- Requires `Google:ClientId` and `Google:ClientSecret` in appsettings
- Callback path: `/signin-google`

### Password Reset
- Currently uses 6-digit token
- **TODO:** Implement proper token storage with expiration in User entity
- Add fields: `PasswordResetToken` and `PasswordResetTokenExpiry`
