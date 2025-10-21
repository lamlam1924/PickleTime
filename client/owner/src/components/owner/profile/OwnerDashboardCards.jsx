import React from 'react';
import { TrendingUp, DollarSign, Calendar, Building2, Star, CheckCircle, Clock, XCircle } from 'lucide-react';

const OwnerDashboardCards = ({ dashboard }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Revenue Section */}
      <div>
        <h2 className="text-2xl font-bold mb-4">💰 Doanh thu</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="stat bg-gradient-to-br from-success/20 to-success/5 shadow-xl rounded-box border border-success/20">
            <div className="stat-figure text-success">
              <DollarSign size={40} />
            </div>
            <div className="stat-title">Tổng doanh thu</div>
            <div className="stat-value text-success text-2xl">{formatCurrency(dashboard.totalRevenue)}</div>
            <div className="stat-desc">Tất cả thời gian</div>
          </div>

          <div className="stat bg-base-100 shadow-xl rounded-box">
            <div className="stat-figure text-primary">
              <TrendingUp size={32} />
            </div>
            <div className="stat-title">Doanh thu tháng này</div>
            <div className="stat-value text-primary text-xl">{formatCurrency(dashboard.monthlyRevenue)}</div>
            <div className="stat-desc">30 ngày qua</div>
          </div>

          <div className="stat bg-base-100 shadow-xl rounded-box">
            <div className="stat-figure text-info">
              <Calendar size={32} />
            </div>
            <div className="stat-title">Doanh thu tuần này</div>
            <div className="stat-value text-info text-xl">{formatCurrency(dashboard.weeklyRevenue)}</div>
            <div className="stat-desc">7 ngày qua</div>
          </div>

          <div className="stat bg-base-100 shadow-xl rounded-box">
            <div className="stat-figure text-warning">
              <TrendingUp size={32} />
            </div>
            <div className="stat-title">Doanh thu hôm nay</div>
            <div className="stat-value text-warning text-xl">{formatCurrency(dashboard.todayRevenue)}</div>
            <div className="stat-desc">Ngày hiện tại</div>
          </div>
        </div>
      </div>

      {/* Booking Statistics */}
      <div>
        <h2 className="text-2xl font-bold mb-4">🎾 Đặt sân</h2>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="stat bg-base-100 shadow-xl rounded-box">
            <div className="stat-figure text-primary">
              <Calendar size={32} />
            </div>
            <div className="stat-title">Tổng đặt sân</div>
            <div className="stat-value text-primary">{dashboard.totalBookings}</div>
            <div className="stat-desc">Tất cả</div>
          </div>

          <div className="stat bg-base-100 shadow-xl rounded-box">
            <div className="stat-figure text-success">
              <CheckCircle size={32} />
            </div>
            <div className="stat-title">Hoàn thành</div>
            <div className="stat-value text-success">{dashboard.completedBookings}</div>
            <div className="stat-desc">{((dashboard.completedBookings / dashboard.totalBookings) * 100).toFixed(1)}%</div>
          </div>

          <div className="stat bg-base-100 shadow-xl rounded-box">
            <div className="stat-figure text-warning">
              <Clock size={32} />
            </div>
            <div className="stat-title">Đang chờ</div>
            <div className="stat-value text-warning">{dashboard.pendingBookings}</div>
            <div className="stat-desc">{((dashboard.pendingBookings / dashboard.totalBookings) * 100).toFixed(1)}%</div>
          </div>

          <div className="stat bg-base-100 shadow-xl rounded-box">
            <div className="stat-figure text-error">
              <XCircle size={32} />
            </div>
            <div className="stat-title">Đã hủy</div>
            <div className="stat-value text-error">{dashboard.cancelledBookings}</div>
            <div className="stat-desc">{((dashboard.cancelledBookings / dashboard.totalBookings) * 100).toFixed(1)}%</div>
          </div>

          <div className="stat bg-gradient-to-br from-info/20 to-info/5 shadow-xl rounded-box border border-info/20">
            <div className="stat-figure text-info">
              <Calendar size={32} />
            </div>
            <div className="stat-title">Hôm nay</div>
            <div className="stat-value text-info">{dashboard.todayBookings}</div>
            <div className="stat-desc">Đặt sân</div>
          </div>
        </div>
      </div>

      {/* Facilities & Reviews */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Facilities */}
        <div>
          <h2 className="text-2xl font-bold mb-4">🏢 Cơ sở</h2>
          <div className="grid grid-cols-1 gap-4">
            <div className="stat bg-base-100 shadow-xl rounded-box">
              <div className="stat-figure text-primary">
                <Building2 size={40} />
              </div>
              <div className="stat-title">Tổng cơ sở</div>
              <div className="stat-value text-primary">{dashboard.totalFacilities}</div>
              <div className="stat-desc">{dashboard.activeFacilities} đang hoạt động</div>
            </div>

            <div className="stat bg-base-100 shadow-xl rounded-box">
              <div className="stat-figure text-success">
                <Building2 size={40} />
              </div>
              <div className="stat-title">Tổng sân</div>
              <div className="stat-value text-success">{dashboard.totalCourts}</div>
              <div className="stat-desc">{dashboard.activeCourts} sân đang hoạt động</div>
            </div>
          </div>
        </div>

        {/* Reviews */}
        <div>
          <h2 className="text-2xl font-bold mb-4">⭐ Đánh giá</h2>
          <div className="grid grid-cols-1 gap-4">
            <div className="stat bg-gradient-to-br from-warning/20 to-warning/5 shadow-xl rounded-box border border-warning/20">
              <div className="stat-figure text-warning">
                <Star size={40} />
              </div>
              <div className="stat-title">Đánh giá trung bình</div>
              <div className="stat-value text-warning flex items-center gap-2">
                {dashboard.averageRating.toFixed(1)}
                <Star size={32} fill="currentColor" />
              </div>
              <div className="stat-desc">{dashboard.totalReviews} đánh giá</div>
            </div>

            <div className="stat bg-base-100 shadow-xl rounded-box">
              <div className="stat-figure text-info">
                <Star size={40} />
              </div>
              <div className="stat-title">Tổng đánh giá</div>
              <div className="stat-value text-info">{dashboard.totalReviews}</div>
              <div className="stat-desc">Từ khách hàng</div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      {(dashboard.lastBookingDate || dashboard.lastReviewDate) && (
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title mb-4">🕐 Hoạt động gần đây</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {dashboard.lastBookingDate && (
                <div className="alert alert-info">
                  <Calendar size={20} />
                  <span>
                    Đặt sân gần nhất: {new Date(dashboard.lastBookingDate).toLocaleString('vi-VN')}
                  </span>
                </div>
              )}
              {dashboard.lastReviewDate && (
                <div className="alert alert-warning">
                  <Star size={20} />
                  <span>
                    Đánh giá gần nhất: {new Date(dashboard.lastReviewDate).toLocaleString('vi-VN')}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OwnerDashboardCards;
