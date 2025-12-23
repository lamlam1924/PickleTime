import useDashboardData from "@hooks/admin/useDashboardData";
import StatCard from "./StatCard";
import BookingHistoryChart from "./BookingHistoryChart";
import AdminDashboardSkeleton from "./AdminDashboardSkeleton";
import {
  Users,
  Building,
  MapPin,
  CreditCard,
  UserPlus,
  UserX,
  TrendingUp,
} from "lucide-react";
import { useState } from "react";

const AdminDashboard = () => {
 const { data, loading, error } = useDashboardData();
  const [selectedTimeRange, setSelectedTimeRange] = useState("30");

 if (loading)  {
   return <AdminDashboardSkeleton />;
 }

 if (error) {
   return (
     <div className="flex justify-center items-center h-screen">
       <p>Không thể tải dữ liệu. Vui lòng thử lại sau.</p>
     </div>
   );
 }

 if (!data) {
   return null; 
 }

   const totalRevenue = data.bookingHistory.reduce((sum, day) => {
     return sum + day.amount;
   }, 0);

  return (
    <div className="min-h-screen bg-base-200 p-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center lg:text-left">
            Bảng điều khiển PickleTime
        </h1>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <StatCard
            title="Người dùng"
            value={data.totalUsers}
            icon={Users}
            className="bg-base-100"
          />
          <StatCard
            title="Chủ sân"
            value={data.totalOwners}
            icon={Building}
            className="bg-base-100"
          />
          <StatCard
            title="Sân thể thao"
            value={data.totalTurfs}
            icon={MapPin}
            className="bg-base-100"
          />
          <StatCard
            title="Lượt đặt sân"
            value={data.totalBookings}
            icon={CreditCard}
            className="bg-base-100"
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
          <StatCard
            title="Yêu cầu đang chờ"
            value={data.pendingRequests}
            icon={UserPlus}
            className="bg-warning text-warning-content"
          />
          <StatCard
            title="Yêu cầu bị từ chối"
            value={data.rejectedRequests}
            icon={UserX}
            className="bg-error text-error-content"
          />
          <StatCard
            title="Tổng doanh thu"
            value={totalRevenue}
            icon={TrendingUp}
            prefix="₹"
            className="bg-success text-success-content"
          />
        </div>

        <div className="card bg-base-100 shadow-xl mb-8">
          <div className="card-body max:md:p-0">
            <h2 className="card-title mb-4">Biểu đồ doanh thu & lượt đặt sân</h2>
            <div className="flex justify-end mb-4">
              <select
                className="select select-bordered w-full max-w-xs"
                value={selectedTimeRange}
                onChange={(e) => setSelectedTimeRange(e.target.value)}
              >
                <option value="7">7 ngày gần đây</option>
                <option value="30">30 ngày gần đây</option>
                <option value="90">90 ngày gần đây</option>
              </select>
            </div>
            <BookingHistoryChart
              data={data.bookingHistory.slice(-selectedTimeRange)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
