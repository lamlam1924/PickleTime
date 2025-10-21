# ✅ IMPLEMENTATION SUMMARY - Owner Dashboard (Cách 2)

## 🎯 Mục tiêu đã hoàn thành

Implement **Owner Dashboard** theo **Cách 2** - Backend aggregate data, Frontend chỉ hiển thị.

---

## 📊 Dashboard Features

### **8 Stat Cards:**

#### **4 Cards chính:**
1. 📅 **Tổng đặt sân** - `totalBookings`
2. ⭐ **Tổng đánh giá** - `totalReviews`  
3. 💰 **Tổng doanh thu** - `totalRevenue` (₫)
4. 🏟️ **Tổng sân** - `totalCourts`

#### **4 Cards phụ (có màu sắc):**
5. ✅ **Hoàn thành** - `completedBookings` (màu success/20)
6. ⏳ **Đang chờ** - `pendingBookings` (màu warning/20)
7. ❌ **Đã hủy** - `cancelledBookings` (màu error/20)
8. 🏢 **Số cơ sở** - `totalFacilities` (màu info/20)

---

### **2 Charts thực:**

#### **1️⃣ Bar Chart - "Đặt sân theo cơ sở"**
- **Dữ liệu:** `bookingsPerFacility[]`
- **3 Categories:**
  - `total` - Tổng bookings (màu xanh #8884d8)
  - `completed` - Hoàn thành (màu xanh lá #82ca9d)
  - `pending` - Đang chờ (màu vàng #ffc658)
- **X-Axis:** Tên cơ sở (facility name)
- **Y-Axis:** Số lượng bookings

#### **2️⃣ Line Chart - "Doanh thu 7 ngày gần nhất"**
- **Dữ liệu:** `revenueOverTime[]` (slice last 7 days)
- **2 Lines:**
  - `revenue` - Doanh thu (₫) (màu xanh #8884d8)
  - `bookings` - Số booking (màu xanh lá #82ca9d)
- **X-Axis:** Ngày (format: dd/MM)
- **Y-Axis:** Số tiền / Số booking

---

## 🔧 Backend Implementation

### **1. DTO Structure** (`OwnerDashboardDto.cs`)

```csharp
public class OwnerDashboardDto
{
    // Revenue Statistics
    public decimal TotalRevenue { get; set; }
    public decimal MonthlyRevenue { get; set; }
    public decimal WeeklyRevenue { get; set; }
    public decimal TodayRevenue { get; set; }
    
    // Booking Statistics
    public int TotalBookings { get; set; }
    public int CompletedBookings { get; set; }
    public int PendingBookings { get; set; }
    public int CancelledBookings { get; set; }
    public int TodayBookings { get; set; }
    
    // Facility Statistics
    public int TotalFacilities { get; set; }
    public int ActiveFacilities { get; set; }
    public int TotalCourts { get; set; }
    public int ActiveCourts { get; set; }
    
    // Review Statistics
    public int TotalReviews { get; set; }
    public double AverageRating { get; set; }
    
    // Chart Data
    public List<BookingPerFacilityData> BookingsPerFacility { get; set; }
    public List<RevenueOverTimeData> RevenueOverTime { get; set; }
}

// Chart Data Classes
public class BookingPerFacilityData
{
    public string FacilityName { get; set; }
    public int TotalBookings { get; set; }
    public int CompletedBookings { get; set; }
    public int PendingBookings { get; set; }
}

public class RevenueOverTimeData
{
    public DateTime Date { get; set; }
    public decimal Revenue { get; set; }
    public int BookingCount { get; set; }
}
```

### **2. Service Logic** (`OwnerProfileService.cs`)

**Dashboard Aggregation:**
- Lấy tất cả facilities của owner
- Query bookings theo facilityIds
- Tính toán revenue (chỉ completed + paid)
- Aggregate statistics:
  - Total/Monthly/Weekly/Today revenue
  - Booking counts by status
  - Court & facility counts
  - Review statistics

**Chart Data Generation:**
```csharp
// 1. Bookings Per Facility
foreach (var facility in facilities)
{
    var facilityBookings = await _context.Bookings
        .Include(b => b.BookingDetails)
        .Where(b => !b.IsDeleted && b.BookingDetails.Any(bd => 
            bd.Court != null && bd.Court.FacilityId == facility.FacilityId))
        .ToListAsync();

    bookingsPerFacility.Add(new BookingPerFacilityData
    {
        FacilityName = facility.FacilityName,
        TotalBookings = facilityBookings.Count,
        CompletedBookings = facilityBookings.Count(b => b.BookingStatusId == 2),
        PendingBookings = facilityBookings.Count(b => b.BookingStatusId == 1)
    });
}

// 2. Revenue Over Time (Last 7 days)
var startDate = DateTime.Now.AddDays(-6).Date;
for (int i = 0; i < 7; i++)
{
    var targetDate = startDate.AddDays(i);
    var targetDateOnly = DateOnly.FromDateTime(targetDate);
    
    var dayBookings = completedBookings
        .Where(b => b.BookingDate == targetDateOnly)
        .ToList();

    revenueOverTime.Add(new RevenueOverTimeData
    {
        Date = targetDate,
        Revenue = dayBookings.Sum(b => b.FinalAmount ?? b.TotalAmount),
        BookingCount = dayBookings.Count
    });
}
```

### **3. Controller Endpoint**

```csharp
[HttpGet("dashboard")]
[Authorize(Roles = "Manager,manager")]
public async Task<IActionResult> GetOwnerDashboard()
{
    var userId = GetCurrentUserId();
    var dashboard = await _ownerProfileService.GetOwnerDashboardAsync(userId);
    return Ok(new { success = true, data = dashboard });
}
```

---

## 🎨 Frontend Implementation

### **1. Hook** (`useOwnerDashboard.js`)

```javascript
const useOwnerDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboard = async () => {
    const response = await axiosInstance.get('/owner/profile/dashboard');
    setDashboardData(response.data.data || response.data);
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  return { dashboardData, loading, refresh: fetchDashboard };
};
```

### **2. Component** (`OwnerDashboard.jsx`)

**Data Destructuring:**
```jsx
const {
  totalBookings = 0,
  totalReviews = 0,
  totalRevenue = 0,
  totalFacilities = 0,
  totalCourts = 0,
  completedBookings = 0,
  pendingBookings = 0,
  cancelledBookings = 0,
  bookingsPerFacility = [],
  revenueOverTime = [],
} = dashboard;
```

**Chart Data Preparation:**
```jsx
// Bar Chart Data
const bookingsPerFacilityData = bookingsPerFacility.map((item) => ({
  name: item.facilityName,
  total: item.totalBookings,
  completed: item.completedBookings,
  pending: item.pendingBookings,
}));

// Line Chart Data (Last 7 days)
const last7Days = revenueOverTime.slice(-7);
const revenueChartData = last7Days.map((item) => ({
  date: new Date(item.date).toLocaleDateString('vi-VN', { 
    day: '2-digit', 
    month: '2-digit' 
  }),
  revenue: item.revenue,
  bookings: item.bookingCount,
}));
```

**Stat Cards Render:**
```jsx
{/* 4 Cards chính */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
  <StatCard title="Tổng đặt sân" value={totalBookings} icon="📅" />
  <StatCard title="Tổng đánh giá" value={totalReviews} icon="⭐" />
  <StatCard title="Tổng doanh thu" value={totalRevenue} icon="💰" prefix="₫" />
  <StatCard title="Tổng sân" value={totalCourts} icon="🏟️" />
</div>

{/* 4 Cards phụ với màu sắc */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
  <StatCard title="Hoàn thành" value={completedBookings} icon="✅" color="bg-success/20" />
  <StatCard title="Đang chờ" value={pendingBookings} icon="⏳" color="bg-warning/20" />
  <StatCard title="Đã hủy" value={cancelledBookings} icon="❌" color="bg-error/20" />
  <StatCard title="Số cơ sở" value={totalFacilities} icon="🏢" color="bg-info/20" />
</div>
```

**Charts Render:**
```jsx
{/* Bar Chart */}
<BarChart data={bookingsPerFacilityData}>
  <CartesianGrid strokeDasharray="3 3" />
  <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
  <YAxis />
  <Tooltip />
  <Legend />
  <Bar dataKey="total" fill="#8884d8" name="Tổng" />
  <Bar dataKey="completed" fill="#82ca9d" name="Hoàn thành" />
  <Bar dataKey="pending" fill="#ffc658" name="Đang chờ" />
</BarChart>

{/* Line Chart */}
<LineChart data={revenueChartData}>
  <CartesianGrid strokeDasharray="3 3" />
  <XAxis dataKey="date" />
  <YAxis />
  <Tooltip />
  <Legend />
  <Line dataKey="revenue" stroke="#8884d8" strokeWidth={2} name="Doanh thu (₫)" />
  <Line dataKey="bookings" stroke="#82ca9d" strokeWidth={2} name="Số booking" />
</LineChart>
```

---

## ✅ Lợi ích của Cách 2

### 🎯 **Tách biệt logic**
- Backend xử lý business logic (aggregate, filter, calculate)
- Frontend chỉ hiển thị (UI/UX)

### ⚡ **Performance**
- Backend aggregate data hiệu quả hơn (SQL queries optimized)
- Frontend không cần loop/filter lớn

### 🔄 **Reusable**
- Data structure chuẩn → dễ dàng thêm API endpoint khác
- Mobile app/Desktop app có thể dùng chung API

### 🛡️ **Type-safe**
- C# DTO với strong typing
- JSON schema rõ ràng

### 📈 **Scalable**
- Dễ thêm metrics mới (ví dụ: revenue by payment method, bookings by court type)
- Chỉ cần update DTO và service logic

### 📋 **Consistent**
- JSON response có structure rõ ràng
- Dễ maintain và debug

---

## 🚀 Cách chạy

### **1. Start Backend:**
```bash
cd /Users/Documents/PickleTime/PickleTime.Api
dotnet build
dotnet run
```
✅ Backend running on: **http://localhost:5104**

### **2. Start Frontend:**
```bash
cd /Users/Documents/PickleTime/client/owner
npm install  # nếu chưa install
npm run dev
```
✅ Frontend running on: **http://localhost:5173**

### **3. Login as Owner:**
- Email: owner account trong database (RoleId = 2)
- Navigate to: `/owner` → Dashboard

---

## 📝 API Endpoint

### **GET** `/api/owner/profile/dashboard`
**Authorization:** Bearer Token (Role: Manager)

**Response:**
```json
{
  "success": true,
  "data": {
    "totalRevenue": 50000000,
    "monthlyRevenue": 15000000,
    "weeklyRevenue": 5000000,
    "todayRevenue": 500000,
    "totalBookings": 150,
    "completedBookings": 100,
    "pendingBookings": 30,
    "cancelledBookings": 20,
    "todayBookings": 5,
    "totalFacilities": 3,
    "activeFacilities": 2,
    "totalCourts": 12,
    "activeCourts": 10,
    "totalReviews": 45,
    "averageRating": 4.5,
    "bookingsPerFacility": [
      {
        "facilityName": "Sân Pickleball A",
        "totalBookings": 60,
        "completedBookings": 40,
        "pendingBookings": 15
      },
      {
        "facilityName": "Sân Pickleball B",
        "totalBookings": 50,
        "completedBookings": 35,
        "pendingBookings": 10
      }
    ],
    "revenueOverTime": [
      {
        "date": "2025-10-14T00:00:00",
        "revenue": 1500000,
        "bookingCount": 5
      },
      {
        "date": "2025-10-15T00:00:00",
        "revenue": 2000000,
        "bookingCount": 8
      }
      // ... 7 days total
    ]
  }
}
```

---

## 🎉 Kết quả

### ✅ **Đã hoàn thành:**
- ✅ Backend DTO với đầy đủ fields
- ✅ OwnerProfileService aggregate data thực từ DB
- ✅ Controller endpoint `/api/owner/profile/dashboard`
- ✅ Frontend hook `useOwnerDashboard`
- ✅ Component `OwnerDashboard` với 8 cards + 2 charts
- ✅ Data thực từ database (bookings, revenue, facilities)
- ✅ Charts hiển thị data theo 7 ngày gần nhất
- ✅ Empty states khi không có data

### 🎨 **UI/UX:**
- Responsive design (mobile, tablet, desktop)
- Color-coded stat cards
- Interactive charts (hover tooltips)
- Loading skeleton
- Error handling

---

## 📚 Technologies Used

### **Backend:**
- .NET 8
- Entity Framework Core
- SQL Server
- JWT Authentication

### **Frontend:**
- React 18
- Recharts (charts library)
- react-countup (animated counters)
- Tailwind CSS + DaisyUI
- Axios

---

**Created by:** AI Assistant  
**Date:** October 20, 2025  
**Implementation:** Cách 2 - Backend Aggregation Pattern
