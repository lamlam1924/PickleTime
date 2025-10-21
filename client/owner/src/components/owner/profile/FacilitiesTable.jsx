import React from 'react';
import { Building2, MapPin, Phone, Mail, TrendingUp, Star } from 'lucide-react';
import { format } from 'date-fns';

const FacilitiesTable = ({ facilities }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const getStatusBadge = (status) => {
    const statusLower = status?.toLowerCase();
    if (statusLower === 'active' || statusLower === 'hoạt động') return 'badge-success';
    if (statusLower === 'inactive' || statusLower === 'tạm ngưng') return 'badge-warning';
    return 'badge-ghost';
  };

  if (!facilities || facilities.length === 0) {
    return (
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <div className="text-center py-12">
            <Building2 size={64} className="mx-auto mb-4 text-base-content/20" />
            <h3 className="text-xl font-semibold mb-2">Chưa có cơ sở nào</h3>
            <p className="text-base-content/60">Bạn chưa quản lý cơ sở nào</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Danh sách cơ sở ({facilities.length})</h2>
      </div>

      {/* Desktop Table View */}
      <div className="hidden lg:block overflow-x-auto">
        <div className="card bg-base-100 shadow-xl">
          <table className="table">
            <thead>
              <tr>
                <th>Cơ sở</th>
                <th>Sân</th>
                <th>Đặt sân</th>
                <th>Doanh thu</th>
                <th>Đánh giá</th>
                <th>Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {facilities.map((facility) => (
                <tr key={facility.facilityId} className="hover">
                  <td>
                    <div className="flex items-start gap-3">
                      <div className="avatar placeholder">
                        <div className="bg-primary text-primary-content rounded-lg w-12">
                          <Building2 size={24} />
                        </div>
                      </div>
                      <div>
                        <div className="font-bold">{facility.facilityName}</div>
                        <div className="text-sm opacity-70 flex items-center gap-1 mt-1">
                          <MapPin size={12} />
                          {facility.address}
                        </div>
                        {facility.phone && (
                          <div className="text-sm opacity-70 flex items-center gap-1">
                            <Phone size={12} />
                            {facility.phone}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="flex flex-col">
                      <span className="font-semibold text-primary">{facility.activeCourts}/{facility.totalCourts}</span>
                      <span className="text-xs opacity-70">Đang hoạt động</span>
                    </div>
                  </td>
                  <td>
                    <div className="flex flex-col">
                      <span className="font-semibold">{facility.totalBookings}</span>
                      <span className="text-xs text-success">{facility.completedBookings} hoàn thành</span>
                    </div>
                  </td>
                  <td>
                    <div className="flex flex-col">
                      <span className="font-semibold text-success">{formatCurrency(facility.totalRevenue)}</span>
                      <span className="text-xs opacity-70">Tổng doanh thu</span>
                    </div>
                  </td>
                  <td>
                    <div className="flex items-center gap-1">
                      <Star size={16} className="text-warning" fill="currentColor" />
                      <span className="font-semibold">{facility.averageRating.toFixed(1)}</span>
                      <span className="text-xs opacity-70">({facility.totalReviews})</span>
                    </div>
                  </td>
                  <td>
                    <div className={`badge ${getStatusBadge(facility.status)}`}>
                      {facility.status}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="lg:hidden space-y-4">
        {facilities.map((facility) => (
          <div key={facility.facilityId} className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start gap-3">
                  <div className="avatar placeholder">
                    <div className="bg-primary text-primary-content rounded-lg w-12">
                      <Building2 size={24} />
                    </div>
                  </div>
                  <div>
                    <h3 className="card-title text-base">{facility.facilityName}</h3>
                    <div className={`badge ${getStatusBadge(facility.status)} badge-sm mt-1`}>
                      {facility.status}
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-sm space-y-2">
                <div className="flex items-center gap-2 text-base-content/70">
                  <MapPin size={14} />
                  <span>{facility.address}</span>
                </div>
                {facility.phone && (
                  <div className="flex items-center gap-2 text-base-content/70">
                    <Phone size={14} />
                    <span>{facility.phone}</span>
                  </div>
                )}
              </div>

              <div className="divider my-2"></div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="text-xs text-base-content/60">Sân hoạt động</div>
                  <div className="font-semibold text-primary">{facility.activeCourts}/{facility.totalCourts}</div>
                </div>
                <div>
                  <div className="text-xs text-base-content/60">Đặt sân</div>
                  <div className="font-semibold">{facility.totalBookings}</div>
                </div>
                <div>
                  <div className="text-xs text-base-content/60">Doanh thu</div>
                  <div className="font-semibold text-success text-sm">{formatCurrency(facility.totalRevenue)}</div>
                </div>
                <div>
                  <div className="text-xs text-base-content/60">Đánh giá</div>
                  <div className="flex items-center gap-1">
                    <Star size={14} className="text-warning" fill="currentColor" />
                    <span className="font-semibold">{facility.averageRating.toFixed(1)}</span>
                    <span className="text-xs">({facility.totalReviews})</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FacilitiesTable;
