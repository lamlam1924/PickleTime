import React, { useState } from 'react';
import { 
  User, Mail, Phone, Calendar, MapPin, Shield, Award, 
  Edit, Lock, Trash2, BookOpen, TrendingUp, Star
} from 'lucide-react';
import Avatar from 'react-avatar';
import { format } from 'date-fns';
import useProfile from '@hooks/customer/useProfile';
import useBookingHistory from '@hooks/customer/useBookingHistory';
import EditProfileModal from '@components/customer/profile/EditProfileModal';
import ChangePasswordModal from '@components/customer/profile/ChangePasswordModal';
import DeactivateAccountModal from '@components/customer/profile/DeactivateAccountModal';

const ProfilePage = () => {
  const { profile, statistics, loading, updateProfile, changePassword, deactivateAccount } = useProfile();
  const { bookings, loading: bookingsLoading } = useBookingHistory(1, 5);
  
  const [activeTab, setActiveTab] = useState('overview');
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);

  if (loading) {
    return (
      <div className="container mx-auto p-4 max-w-6xl">
        <div className="flex items-center justify-center h-96">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="container mx-auto p-4 max-w-6xl">
        <div className="alert alert-error">
          <span>Không thể tải thông tin hồ sơ</span>
        </div>
      </div>
    );
  }

  const getStatusBadge = () => {
    return (
      <div className="badge badge-success gap-2">
        <div className="w-2 h-2 rounded-full bg-success"></div>
        Active
      </div>
    );
  };

  const getMembershipBadge = () => {
    const type = profile.membershipType || 'Basic';
    const colors = {
      'Basic': 'badge-ghost',
      'Premium': 'badge-warning',
      'VIP': 'badge-error'
    };
    return (
      <div className={`badge ${colors[type] || 'badge-ghost'} gap-2`}>
        <Award size={14} />
        {type}
      </div>
    );
  };

  const getBookingStatusColor = (status) => {
    const statusLower = status?.toLowerCase();
    if (statusLower === 'completed') return 'badge-success';
    if (statusLower === 'pending') return 'badge-warning';
    if (statusLower === 'cancelled') return 'badge-error';
    return 'badge-ghost';
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      {/* Header Section */}
      <div className="card bg-base-100 shadow-xl mb-6">
        <div className="card-body">
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
            {/* Avatar */}
            <div className="avatar">
              <div className="w-24 h-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                <Avatar 
                  name={profile.fullName || profile.userName || profile.email}
                  size={96}
                  round={true}
                />
              </div>
            </div>

            {/* User Info */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold">{profile.fullName || profile.userName}</h1>
                {getStatusBadge()}
                {getMembershipBadge()}
              </div>
              <p className="text-base-content/60 mb-2">@{profile.userName}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-4">
                <div className="flex items-center gap-2 text-sm">
                  <Mail size={16} className="text-base-content/50" />
                  <span>{profile.email}</span>
                </div>
                {profile.phone && (
                  <div className="flex items-center gap-2 text-sm">
                    <Phone size={16} className="text-base-content/50" />
                    <span>{profile.phone}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-sm">
                  <Calendar size={16} className="text-base-content/50" />
                  <span>Tham gia: {format(new Date(profile.createdAt), 'dd/MM/yyyy')}</span>
                </div>
                {profile.isGoogleLogin && (
                  <div className="flex items-center gap-2 text-sm">
                    <Shield size={16} className="text-info" />
                    <span className="text-info">Đăng nhập bằng Google</span>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-2">
              <button 
                className="btn btn-primary btn-sm gap-2"
                onClick={() => setShowEditModal(true)}
              >
                <Edit size={16} />
                Chỉnh sửa hồ sơ
              </button>
              {!profile.isGoogleLogin && (
                <button 
                  className="btn btn-ghost btn-sm gap-2"
                  onClick={() => setShowPasswordModal(true)}
                >
                  <Lock size={16} />
                  Đổi mật khẩu
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      {statistics && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="stat bg-base-100 shadow-xl rounded-box">
            <div className="stat-figure text-primary">
              <BookOpen size={32} />
            </div>
            <div className="stat-title">Tổng đặt sân</div>
            <div className="stat-value text-primary">{statistics.totalBookings}</div>
            <div className="stat-desc">{statistics.completedBookings} hoàn thành</div>
          </div>

          <div className="stat bg-base-100 shadow-xl rounded-box">
            <div className="stat-figure text-success">
              <TrendingUp size={32} />
            </div>
            <div className="stat-title">Tổng chi tiêu</div>
            <div className="stat-value text-success text-2xl">{formatCurrency(statistics.totalSpent)}</div>
            <div className="stat-desc">Đã thanh toán</div>
          </div>

          <div className="stat bg-base-100 shadow-xl rounded-box">
            <div className="stat-figure text-warning">
              <Star size={32} />
            </div>
            <div className="stat-title">Đánh giá</div>
            <div className="stat-value text-warning">{statistics.totalReviews}</div>
            <div className="stat-desc">
              {statistics.averageRating ? `★ ${statistics.averageRating.toFixed(1)}` : 'Chưa có'}
            </div>
          </div>

          <div className="stat bg-base-100 shadow-xl rounded-box">
            <div className="stat-figure text-info">
              <Calendar size={32} />
            </div>
            <div className="stat-title">Đang chờ</div>
            <div className="stat-value text-info">{statistics.pendingBookings}</div>
            <div className="stat-desc">{statistics.cancelledBookings} đã hủy</div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="tabs tabs-boxed mb-6 bg-base-200 p-2">
        <a 
          className={`tab tab-lg ${activeTab === 'overview' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          📊 Tổng quan
        </a>
        <a 
          className={`tab tab-lg ${activeTab === 'bookings' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('bookings')}
        >
          🎾 Lịch sử đặt sân
        </a>
        <a 
          className={`tab tab-lg ${activeTab === 'settings' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('settings')}
        >
          ⚙️ Cài đặt
        </a>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title mb-4">Thông tin chi tiết</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-base-content/60">Họ và tên</p>
                <p className="font-semibold">{profile.fullName || 'Chưa cập nhật'}</p>
              </div>
              <div>
                <p className="text-sm text-base-content/60">Username</p>
                <p className="font-semibold">@{profile.userName}</p>
              </div>
              <div>
                <p className="text-sm text-base-content/60">Email</p>
                <p className="font-semibold">{profile.email}</p>
              </div>
              <div>
                <p className="text-sm text-base-content/60">Số điện thoại</p>
                <p className="font-semibold">{profile.phone || 'Chưa cập nhật'}</p>
              </div>
              <div>
                <p className="text-sm text-base-content/60">Ngày sinh</p>
                <p className="font-semibold">
                  {profile.dateOfBirth ? format(new Date(profile.dateOfBirth), 'dd/MM/yyyy') : 'Chưa cập nhật'}
                </p>
              </div>
              <div>
                <p className="text-sm text-base-content/60">Giới tính</p>
                <p className="font-semibold">{profile.gender || 'Chưa cập nhật'}</p>
              </div>
              <div className="md:col-span-2">
                <p className="text-sm text-base-content/60">Địa chỉ</p>
                <p className="font-semibold">{profile.address || 'Chưa cập nhật'}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'bookings' && (
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body p-0">
            {bookingsLoading ? (
              <div className="p-8 text-center">
                <span className="loading loading-spinner loading-lg"></span>
              </div>
            ) : bookings.length === 0 ? (
              <div className="p-8 text-center">
                <BookOpen size={48} className="mx-auto mb-4 text-base-content/20" />
                <p className="text-lg text-base-content/60">Chưa có lịch sử đặt sân</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="table table-zebra">
                  <thead>
                    <tr>
                      <th>Mã đặt</th>
                      <th>Sân</th>
                      <th>Ngày đặt</th>
                      <th>Giờ</th>
                      <th>Số tiền</th>
                      <th>Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map((booking) => (
                      <tr key={booking.bookingId}>
                        <td className="font-mono">{booking.bookingNumber}</td>
                        <td>
                          <div>
                            <div className="font-bold">{booking.facilityName}</div>
                            <div className="text-sm opacity-70">{booking.courtName}</div>
                          </div>
                        </td>
                        <td>{format(new Date(booking.bookingDate), 'dd/MM/yyyy')}</td>
                        <td>
                          {booking.startTime} - {booking.endTime}
                        </td>
                        <td className="font-semibold">{formatCurrency(booking.totalAmount)}</td>
                        <td>
                          <div className="flex flex-col gap-1">
                            <div className={`badge ${getBookingStatusColor(booking.bookingStatus)} badge-sm`}>
                              {booking.bookingStatus}
                            </div>
                            <div className="badge badge-ghost badge-sm">
                              {booking.paymentStatus}
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="space-y-4">
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">Bảo mật</h2>
              <div className="divider"></div>
              {profile.isGoogleLogin ? (
                <div className="alert alert-info">
                  <Shield size={20} />
                  <span>Tài khoản của bạn được bảo vệ bởi Google. Bạn không thể thay đổi mật khẩu.</span>
                </div>
              ) : (
                <button 
                  className="btn btn-outline gap-2"
                  onClick={() => setShowPasswordModal(true)}
                >
                  <Lock size={20} />
                  Đổi mật khẩu
                </button>
              )}
            </div>
          </div>

          <div className="card bg-base-100 shadow-xl border-error">
            <div className="card-body">
              <h2 className="card-title text-error">Vùng nguy hiểm</h2>
              <div className="divider"></div>
              <p className="text-sm text-base-content/60 mb-4">
                Vô hiệu hóa tài khoản sẽ đưa tài khoản của bạn vào trạng thái không hoạt động. 
                Bạn sẽ không thể đăng nhập và sử dụng dịch vụ.
              </p>
              <button 
                className="btn btn-error gap-2"
                onClick={() => setShowDeactivateModal(true)}
              >
                <Trash2 size={20} />
                Vô hiệu hóa tài khoản
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      {showEditModal && (
        <EditProfileModal
          profile={profile}
          onClose={() => setShowEditModal(false)}
          onSave={updateProfile}
        />
      )}

      {showPasswordModal && (
        <ChangePasswordModal
          onClose={() => setShowPasswordModal(false)}
          onSave={changePassword}
        />
      )}

      {showDeactivateModal && (
        <DeactivateAccountModal
          isGoogleLogin={profile.isGoogleLogin}
          onClose={() => setShowDeactivateModal(false)}
          onConfirm={deactivateAccount}
        />
      )}
    </div>
  );
};

export default ProfilePage;
