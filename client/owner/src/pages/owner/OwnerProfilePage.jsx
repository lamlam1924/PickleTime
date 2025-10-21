import React, { useState } from 'react';
import { User, Mail, Phone, Calendar, Building2, Award, Shield, Edit, Lock } from 'lucide-react';
import Avatar from 'react-avatar';
import { format } from 'date-fns';
import useOwnerProfile from '@hooks/owner/useOwnerProfile';
import useOwnerDashboard from '@hooks/owner/useOwnerDashboard';
import useOwnerFacilities from '@hooks/owner/useOwnerFacilities';
import useOwnerReviews from '@hooks/owner/useOwnerReviews';
import OwnerDashboardCards from '@components/owner/profile/OwnerDashboardCards';
import FacilitiesTable from '@components/owner/profile/FacilitiesTable';
import ReviewsList from '@components/owner/profile/ReviewsList';
import EditOwnerProfileModal from '@components/owner/profile/EditOwnerProfileModal';
import ChangePasswordModal from '@components/customer/profile/ChangePasswordModal';

const OwnerProfilePage = () => {
  const { profile, loading, updateProfile, changePassword } = useOwnerProfile();
  const { dashboard } = useOwnerDashboard();
  const { facilities } = useOwnerFacilities();
  const { reviews } = useOwnerReviews();
  
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  if (loading) {
    return (
      <div className="container mx-auto p-4 max-w-7xl">
        <div className="flex items-center justify-center h-96">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="container mx-auto p-4 max-w-7xl">
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

  return (
    <div className="container mx-auto p-4 max-w-7xl">
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
                <div className="badge badge-warning gap-2">
                  <Building2 size={14} />
                  Chủ sân
                </div>
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
                <div className="flex items-center gap-2 text-sm">
                  <Building2 size={16} className="text-primary" />
                  <span className="font-semibold">
                    {profile.activeFacilities}/{profile.totalFacilities} cơ sở đang hoạt động
                  </span>
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

      {/* Tabs */}
      <div className="tabs tabs-boxed mb-6 bg-base-200 p-2">
        <a 
          className={`tab tab-lg ${activeTab === 'dashboard' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('dashboard')}
        >
          📊 Dashboard
        </a>
        <a 
          className={`tab tab-lg ${activeTab === 'profile' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          👤 Thông tin cá nhân
        </a>
        <a 
          className={`tab tab-lg ${activeTab === 'facilities' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('facilities')}
        >
          🏢 Cơ sở của tôi
        </a>
        <a 
          className={`tab tab-lg ${activeTab === 'reviews' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('reviews')}
        >
          ⭐ Đánh giá
        </a>
      </div>

      {/* Tab Content */}
      {activeTab === 'dashboard' && dashboard && (
        <OwnerDashboardCards dashboard={dashboard} />
      )}

      {activeTab === 'profile' && (
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

      {activeTab === 'facilities' && (
        <FacilitiesTable facilities={facilities} />
      )}

      {activeTab === 'reviews' && (
        <ReviewsList reviews={reviews} />
      )}

      {/* Modals */}
      {showEditModal && (
        <EditOwnerProfileModal
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
    </div>
  );
};

export default OwnerProfilePage;
