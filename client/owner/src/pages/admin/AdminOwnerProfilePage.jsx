import React, { useState } from 'react';
import { 
  User, Mail, Phone, Calendar, Shield, Crown,
  Edit, Lock, Building2, Users as UsersIcon, Eye, EyeOff, X
} from 'lucide-react';
import Avatar from 'react-avatar';
import { format } from 'date-fns';
import { useSelector } from 'react-redux';
import EditProfileModal from '@components/admin/UserManagement/EditUserModal';
import toast from 'react-hot-toast';
import axiosInstance from '@hooks/useAxiosInstance';

// Simple Change Password Modal Component
const ChangePasswordModal = ({ onClose, onSave, loading }) => {
  const [formData, setFormData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.oldPassword) newErrors.oldPassword = 'Vui lòng nhập mật khẩu hiện tại';
    if (!formData.newPassword) newErrors.newPassword = 'Vui lòng nhập mật khẩu mới';
    else if (formData.newPassword.length < 6) newErrors.newPassword = 'Mật khẩu phải có ít nhất 6 ký tự';
    if (!formData.confirmPassword) newErrors.confirmPassword = 'Vui lòng xác nhận mật khẩu';
    else if (formData.newPassword !== formData.confirmPassword) newErrors.confirmPassword = 'Mật khẩu không khớp';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSave(formData);
    }
  };

  return (
    <dialog className="modal modal-open">
      <div className="modal-box">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-lg flex items-center gap-2">
            <Lock size={20} />
            Đổi mật khẩu
          </h3>
          <button className="btn btn-ghost btn-sm btn-circle" onClick={onClose} disabled={loading}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Old Password */}
          <div className="form-control mb-4">
            <label className="label">
              <span className="label-text font-semibold">Mật khẩu hiện tại</span>
            </label>
            <div className="relative">
              <input
                type={showOldPassword ? 'text' : 'password'}
                name="oldPassword"
                value={formData.oldPassword}
                onChange={handleChange}
                className={`input input-bordered w-full pr-10 ${errors.oldPassword ? 'input-error' : ''}`}
                placeholder="Nhập mật khẩu hiện tại"
                disabled={loading}
              />
              <button
                type="button"
                className="absolute right-3 top-3"
                onClick={() => setShowOldPassword(!showOldPassword)}
              >
                {showOldPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.oldPassword && <label className="label"><span className="label-text-alt text-error">{errors.oldPassword}</span></label>}
          </div>

          {/* New Password */}
          <div className="form-control mb-4">
            <label className="label">
              <span className="label-text font-semibold">Mật khẩu mới</span>
            </label>
            <div className="relative">
              <input
                type={showNewPassword ? 'text' : 'password'}
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                className={`input input-bordered w-full pr-10 ${errors.newPassword ? 'input-error' : ''}`}
                placeholder="Nhập mật khẩu mới"
                disabled={loading}
              />
              <button
                type="button"
                className="absolute right-3 top-3"
                onClick={() => setShowNewPassword(!showNewPassword)}
              >
                {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.newPassword && <label className="label"><span className="label-text-alt text-error">{errors.newPassword}</span></label>}
          </div>

          {/* Confirm Password */}
          <div className="form-control mb-4">
            <label className="label">
              <span className="label-text font-semibold">Xác nhận mật khẩu mới</span>
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`input input-bordered w-full pr-10 ${errors.confirmPassword ? 'input-error' : ''}`}
                placeholder="Nhập lại mật khẩu mới"
                disabled={loading}
              />
              <button
                type="button"
                className="absolute right-3 top-3"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.confirmPassword && <label className="label"><span className="label-text-alt text-error">{errors.confirmPassword}</span></label>}
          </div>

          <div className="modal-action">
            <button type="button" className="btn btn-ghost" onClick={onClose} disabled={loading}>
              Hủy
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? <span className="loading loading-spinner loading-sm"></span> : 'Đổi mật khẩu'}
            </button>
          </div>
        </form>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button onClick={onClose}>close</button>
      </form>
    </dialog>
  );
};

const AdminOwnerProfilePage = () => {
  const { user, role } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [statistics, setStatistics] = useState(null);

  // Fetch owner statistics if role is owner
  React.useEffect(() => {
    if (role === 'manager' || role === 'owner') {
      fetchOwnerStats();
    }
  }, [role]);

  const fetchOwnerStats = async () => {
    try {
      const response = await axiosInstance.get('/owner/profile/facilities');
      const facilities = response.data.data || [];
      
      const totalFacilities = facilities.length;
      const totalCourts = facilities.reduce((sum, f) => sum + (f.totalCourts || 0), 0);
      const activeFacilities = facilities.filter(f => f.statusName?.toLowerCase() === 'active').length;
      
      setStatistics({
        totalFacilities,
        totalCourts,
        activeFacilities
      });
    } catch (error) {
      console.error('Error fetching owner stats:', error);
    }
  };

  const handleSaveProfile = async (formData) => {
    setLoading(true);
    try {
      await axiosInstance.put(`/admin/users/${user.userId}`, formData);
      toast.success('✅ Cập nhật hồ sơ thành công!');
      setShowEditModal(false);
      // Reload page to update user info
      window.location.reload();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi cập nhật hồ sơ!');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (data) => {
    setLoading(true);
    try {
      await axiosInstance.post('/auth/change-password', data);
      toast.success('✅ Đổi mật khẩu thành công!');
      setShowPasswordModal(false);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi đổi mật khẩu!');
    } finally {
      setLoading(false);
    }
  };

  const getRoleLabel = () => {
    if (role === 'admin') return 'Quản trị viên';
    if (role === 'manager' || role === 'owner') return 'Chủ sân';
    return 'Người dùng';
  };

  const getRoleBadgeColor = () => {
    if (role === 'admin') return 'badge-error';
    if (role === 'manager' || role === 'owner') return 'badge-warning';
    return 'badge-info';
  };

  const getRoleIcon = () => {
    if (role === 'admin') return <Shield size={16} />;
    if (role === 'manager' || role === 'owner') return <Crown size={16} />;
    return <User size={16} />;
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
                  name={user?.fullName || user?.userName || user?.email}
                  size={96}
                  round={true}
                />
              </div>
            </div>

            {/* User Info */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold">{user?.fullName || user?.userName}</h1>
                <div className={`badge ${getRoleBadgeColor()} gap-2`}>
                  {getRoleIcon()}
                  {getRoleLabel()}
                </div>
              </div>
              <p className="text-base-content/60 mb-2">@{user?.userName}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-4">
                <div className="flex items-center gap-2 text-sm">
                  <Mail size={16} className="text-base-content/50" />
                  <span>{user?.email}</span>
                </div>
                {user?.phone && (
                  <div className="flex items-center gap-2 text-sm">
                    <Phone size={16} className="text-base-content/50" />
                    <span>{user?.phone}</span>
                  </div>
                )}
                {user?.createdAt && (
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar size={16} className="text-base-content/50" />
                    <span>Tham gia: {format(new Date(user.createdAt), 'dd/MM/yyyy')}</span>
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
              <button 
                className="btn btn-ghost btn-sm gap-2"
                onClick={() => setShowPasswordModal(true)}
              >
                <Lock size={16} />
                Đổi mật khẩu
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Owner Statistics */}
      {(role === 'manager' || role === 'owner') && statistics && (
        <div className="stats stats-vertical lg:stats-horizontal shadow w-full mb-6">
          <div className="stat">
            <div className="stat-figure text-info">
              <Building2 size={32} />
            </div>
            <div className="stat-title">Tổng cơ sở</div>
            <div className="stat-value text-info">{statistics.totalFacilities}</div>
            <div className="stat-desc">Facilities đang quản lý</div>
          </div>
          
          <div className="stat">
            <div className="stat-figure text-success">
              <UsersIcon size={32} />
            </div>
            <div className="stat-title">Tổng sân</div>
            <div className="stat-value text-success">{statistics.totalCourts}</div>
            <div className="stat-desc">Courts đang hoạt động</div>
          </div>

          <div className="stat">
            <div className="stat-figure text-warning">
              <Crown size={32} />
            </div>
            <div className="stat-title">Cơ sở hoạt động</div>
            <div className="stat-value text-warning">{statistics.activeFacilities}</div>
            <div className="stat-desc">Facilities active</div>
          </div>
        </div>
      )}

      {/* Admin Info Card */}
      {role === 'admin' && (
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title flex items-center gap-2">
              <Shield className="text-error" />
              Quyền Quản trị viên
            </h2>
            <p className="text-base-content/70">
              Bạn có quyền truy cập đầy đủ vào hệ thống quản lý. Có thể quản lý người dùng, 
              chủ sân, yêu cầu đăng ký, và tất cả các chức năng quản trị.
            </p>
            <div className="divider"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 bg-base-200 rounded-lg">
                <UsersIcon size={20} className="text-primary" />
                <div>
                  <p className="font-semibold">Quản lý người dùng</p>
                  <p className="text-sm text-base-content/60">Xem, chỉnh sửa, xóa users</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-base-200 rounded-lg">
                <Crown size={20} className="text-warning" />
                <div>
                  <p className="font-semibold">Quản lý chủ sân</p>
                  <p className="text-sm text-base-content/60">Xem, phê duyệt owners</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-base-200 rounded-lg">
                <Building2 size={20} className="text-info" />
                <div>
                  <p className="font-semibold">Quản lý sân</p>
                  <p className="text-sm text-base-content/60">Xem tất cả facilities/courts</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-base-200 rounded-lg">
                <Shield size={20} className="text-success" />
                <div>
                  <p className="font-semibold">Toàn quyền hệ thống</p>
                  <p className="text-sm text-base-content/60">Truy cập tất cả tính năng</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Owner Info Card */}
      {(role === 'manager' || role === 'owner') && (
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title flex items-center gap-2">
              <Crown className="text-warning" />
              Thông tin Chủ sân
            </h2>
            <p className="text-base-content/70">
              Bạn có thể quản lý các cơ sở thể thao, sân pickleball của mình. 
              Xem đánh giá, quản lý đặt sân và theo dõi doanh thu.
            </p>
            <div className="divider"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 bg-base-200 rounded-lg">
                <Building2 size={20} className="text-info" />
                <div>
                  <p className="font-semibold">Quản lý cơ sở</p>
                  <p className="text-sm text-base-content/60">Thêm, sửa, xóa facilities</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-base-200 rounded-lg">
                <UsersIcon size={20} className="text-success" />
                <div>
                  <p className="font-semibold">Quản lý sân</p>
                  <p className="text-sm text-base-content/60">Thêm, sửa courts</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Profile Modal */}
      {showEditModal && user && (
        <EditProfileModal
          user={{
            ...user,
            roleName: role,
            statusName: 'Active'
          }}
          onClose={() => setShowEditModal(false)}
          onSave={handleSaveProfile}
          loading={loading}
        />
      )}

      {/* Change Password Modal */}
      {showPasswordModal && (
        <ChangePasswordModal
          onClose={() => setShowPasswordModal(false)}
          onSave={handleChangePassword}
          loading={loading}
        />
      )}
    </div>
  );
};

export default AdminOwnerProfilePage;
