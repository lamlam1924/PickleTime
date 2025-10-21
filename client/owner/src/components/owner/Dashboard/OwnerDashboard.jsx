import React from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import CountUp from "react-countup";
import useOwnerDashboard from "@hooks/owner/useOwnerDashboard";
import DashboardSkeleton from "./DashboardSkeleton";

const OwnerDashboard = () => {
  const { dashboard, loading } = useOwnerDashboard();

  if (loading) return <DashboardSkeleton />;

  // Add null check for dashboard
  if (!dashboard) {
    return (
      <div className="p-4 md:p-6">
        <div className="alert alert-warning shadow-lg">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <div>
            <h3 className="font-bold">Không có dữ liệu!</h3>
            <div className="text-xs">Chưa có dữ liệu dashboard để hiển thị.</div>
          </div>
        </div>
      </div>
    );
  }

  const {
    totalBookings = 0,
    totalReviews = 0,
    totalRevenue = 0,
    totalFacilities = 0,
    totalCourts = 0,
    completedBookings = 0,
    pendingBookings = 0,
    cancelledBookings = 0,
    monthlyRevenue = 0,
    weeklyRevenue = 0,
    todayRevenue = 0,
    averageRating = 0,
    bookingsPerFacility = [],
    revenueOverTime = [],
  } = dashboard;

  // Prepare data for Revenue Over Time chart (format dates and show last 7 days for better visibility)
  const last7Days = revenueOverTime.slice(-7);
  const revenueChartData = last7Days.map((item) => ({
    date: new Date(item.date).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' }),
    revenue: item.revenue,
    bookings: item.bookingCount,
  }));

  // Prepare data for Bookings per Facility chart
  const bookingsPerFacilityData = bookingsPerFacility.map((item) => ({
    name: item.facilityName,
    total: item.totalBookings,
    completed: item.completedBookings,
    pending: item.pendingBookings,
  }));

  return (
    <div className="p-4 md:p-6 bg-base-200 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold mb-6 text-primary">
          Owner Dashboard
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard title="Tổng đặt sân" value={totalBookings} icon="📅" />
          <StatCard title="Tổng đánh giá" value={totalReviews} icon="⭐" />
          <StatCard
            title="Tổng doanh thu"
            value={totalRevenue}
            icon="💰"
            prefix="₫"
          />
          <StatCard title="Tổng sân" value={totalCourts} icon="🏟️" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard title="Hoàn thành" value={completedBookings} icon="✅" color="bg-success/20" />
          <StatCard title="Đang chờ" value={pendingBookings} icon="⏳" color="bg-warning/20" />
          <StatCard title="Đã hủy" value={cancelledBookings} icon="❌" color="bg-error/20" />
          <StatCard title="Số cơ sở" value={totalFacilities} icon="🏢" color="bg-info/20" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ChartCard title="Đặt sân theo cơ sở">
            {bookingsPerFacilityData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={bookingsPerFacilityData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="total" fill="#8884d8" name="Tổng" />
                  <Bar dataKey="completed" fill="#82ca9d" name="Hoàn thành" />
                  <Bar dataKey="pending" fill="#ffc658" name="Đang chờ" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-base-content/50">
                Chưa có dữ liệu
              </div>
            )}
          </ChartCard>
          <ChartCard title="Doanh thu 7 ngày gần nhất">
            {revenueChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart
                  data={revenueChartData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value, name) => {
                      if (name === 'revenue') return [`${value.toLocaleString('vi-VN')} ₫`, 'Doanh thu'];
                      if (name === 'bookings') return [value, 'Số booking'];
                      return value;
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#8884d8"
                    strokeWidth={2}
                    name="Doanh thu (₫)"
                    dot={{ r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="bookings"
                    stroke="#82ca9d"
                    strokeWidth={2}
                    name="Số booking"
                    dot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-base-content/50">
                Chưa có dữ liệu
              </div>
            )}
          </ChartCard>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon, prefix = "", color = "bg-base-100" }) => (
  <div className={`${color} p-4 rounded-lg shadow-lg`}>
    <div className="flex items-center justify-between">
      <h2 className="text-lg font-semibold">{title}</h2>
      <span className="text-2xl">{icon}</span>
    </div>
    <p className="text-3xl font-bold mt-2">
      {prefix}
      <CountUp end={value || 0} duration={2.5} separator="," />
    </p>
  </div>
);

const ChartCard = ({ title, children }) => (
  <div className="bg-base-100 p-4 rounded-lg shadow-lg">
    <h2 className="text-lg font-semibold mb-4">{title}</h2>
    {children}
  </div>
);

export default OwnerDashboard;
