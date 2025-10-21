import React, { useState } from "react";
import { 
  Users, Mail, Phone, Calendar, Shield, Crown, Award, 
  Edit, Power, Trash2, Eye, AlertTriangle, Check
} from "lucide-react";
import { useSelector } from "react-redux";
import useUsers from "@hooks/admin/useUsers";
import UserSkeleton from "./UserSkeleton";
import SearchInput from "./SearchInput";
import EditUserModal from "./EditUserModal";
import Avatar from "react-avatar";
import { format } from "date-fns";
import toast from "react-hot-toast";
import axiosInstance from "@hooks/useAxiosInstance";

const UserPage = () => {
  const { users, loading, searchTerm, handleSearch, refreshUsers } = useUsers();
  const currentUserId = useSelector((state) => state.auth.userId);
  const [selectedRole, setSelectedRole] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [activeTab, setActiveTab] = useState("active"); // "active" or "deleted"
  const [deletedUsers, setDeletedUsers] = useState([]);
  const [loadingDeleted, setLoadingDeleted] = useState(false);
  
  // Debug current user info
  
  
  // Modal states
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [confirmAction, setConfirmAction] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Fetch deleted users when switching to deleted tab
  const fetchDeletedUsers = async () => {
    setLoadingDeleted(true);
    try {
      const response = await axiosInstance.get('/admin/users/deleted');
      setDeletedUsers(response.data.data || []);
    } catch (error) {
      toast.error('Không thể tải danh sách user đã xóa');
      setDeletedUsers([]);
    } finally {
      setLoadingDeleted(false);
    }
  };

  // Effect to fetch deleted users when tab changes
  React.useEffect(() => {
    if (activeTab === 'deleted') {
      fetchDeletedUsers();
    }
  }, [activeTab]);

  // Fetch deleted users on mount to show correct count in tab
  React.useEffect(() => {
    fetchDeletedUsers();
  }, []);

  if (loading) return <UserSkeleton />;

  // Filter by role and status
  const filteredUsers = users.filter(user => {
    const roleMatch = selectedRole === "all" || user.roleName?.toLowerCase() === selectedRole;
    // Fix: Backend returns lowercase 'active'/'inactive', but we need to match properly
    const userStatusLower = user.statusName?.toLowerCase();
    const statusMatch = selectedStatus === "all" || userStatusLower === selectedStatus.toLowerCase();
    return roleMatch && statusMatch;
  });

  // Filter deleted users (with search and role filter)
  const filteredDeletedUsers = deletedUsers.filter(user => {
    // Search match
    const searchLower = searchTerm.toLowerCase();
    const searchMatch = !searchTerm || 
      user.fullName?.toLowerCase().includes(searchLower) ||
      user.userName?.toLowerCase().includes(searchLower) ||
      user.email?.toLowerCase().includes(searchLower) ||
      user.phone?.toLowerCase().includes(searchLower);
    
    // Role match
    const roleMatch = selectedRole === "all" || user.roleName?.toLowerCase() === selectedRole;
    
    return searchMatch && roleMatch;
  });

  const getRoleBadgeColor = (role) => {
    const roleLower = role?.toLowerCase();
    if (roleLower === "admin") return "badge-error";
    if (roleLower === "manager") return "badge-warning";
    return "badge-info";
  };

  const getStatusBadgeColor = (status) => {
    const statusLower = status?.toLowerCase();
    return statusLower === "active" ? "badge-success" : "badge-ghost";
  };

  const getRoleIcon = (role) => {
    const roleLower = role?.toLowerCase();
    if (roleLower === "admin") return <Shield size={14} />;
    if (roleLower === "manager") return <Crown size={14} />;
    return <Users size={14} />;
  };

  // Helper: Check if user can be managed (Admin cannot edit/delete themselves)
  const canManageUser = (user) => {
    const roleLower = user.roleName?.toLowerCase();
    
    // Check if this is the current logged-in user
    const isCurrentUser = currentUserId && (
      user.userId === currentUserId || 
      user.userId === parseInt(currentUserId) ||
      String(user.userId) === String(currentUserId)
    );
    
    // Rule 1: Admin CANNOT manage themselves (no edit/delete/disable own account)
    if (isCurrentUser) {
      
      return false;
    }
    
    // Rule 2: Admin can manage Manager and Customer (lower roles)
    if (roleLower === "manager" || roleLower === "customer") {
      return true;
    }
    
    // Rule 3: Admin CANNOT manage other Admins
    if (roleLower === "admin") {
      
      return false;
    }
    
    return false;
  };

  // Action handlers
  const handleView = (user) => {
    setSelectedUser(user);
    setShowViewModal(true);
  };

  const handleEdit = (user) => {
    // Check if this user can be edited
    if (!canManageUser(user)) {
      toast.error("  Không thể chỉnh sửa thông tin Admin khác!");
      return;
    }
    setSelectedUser(user);
    setShowEditModal(true);
  };

  const handleToggleStatus = (user) => {
    // Admin CANNOT toggle status for other Admins
    if (!canManageUser(user)) {
      toast.error("  Không thể thay đổi trạng thái của Admin khác!");
      return;
    }

    setSelectedUser(user);
    const isActive = user.statusName?.toLowerCase() === 'active';
    
    setConfirmAction({
      type: 'toggle-status',
      title: isActive ? 'Vô hiệu hóa User' : 'Kích hoạt User',
      message: isActive 
        ? `Bạn có chắc muốn VÔ HIỆU HÓA user "${user.fullName || user.userName}"? User sẽ KHÔNG THỂ ĐĂNG NHẬP sau khi bị vô hiệu hóa.`
        : `Bạn có chắc muốn KÍCH HOẠT lại user "${user.fullName || user.userName}"? User sẽ có thể đăng nhập trở lại.`,
      confirmText: isActive ? 'Vô hiệu hóa' : 'Kích hoạt',
      confirmClass: isActive ? 'btn-warning' : 'btn-success'
    });
    setShowConfirmModal(true);
  };

  const handleSoftDelete = (user) => {
    // Admin CANNOT delete other Admins
    if (!canManageUser(user)) {
      toast.error("  Không thể xóa Admin khác!");
      return;
    }

    setSelectedUser(user);
    setConfirmAction({
      type: 'soft-delete',
      title: 'Xóa User (Soft Delete)',
      message: `Bạn có chắc muốn XÓA user "${user.fullName || user.userName}"? Đây là soft-delete, dữ liệu vẫn được lưu trong database nhưng user sẽ bị ẩn khỏi hệ thống.`,
      confirmText: 'Xóa User',
      confirmClass: 'btn-error'
    });
    setShowConfirmModal(true);
  };

  const handleRestore = (user) => {
    // Admin CANNOT restore other Admins
    if (!canManageUser(user)) {
      toast.error("  Không thể khôi phục Admin khác!");
      return;
    }

    setSelectedUser(user);
    setConfirmAction({
      type: 'restore',
      title: 'Khôi phục User',
      message: `Bạn có chắc muốn KHÔI PHỤC user "${user.fullName || user.userName}"? User sẽ được hiển thị trở lại trong hệ thống.`,
      confirmText: 'Khôi phục',
      confirmClass: 'btn-success'
    });
    setShowConfirmModal(true);
  };

  const handleSaveEdit = async (formData) => {
    setActionLoading(true);
    try {
      await axiosInstance.put(`/admin/users/${selectedUser.userId}`, formData);
      
      toast.success(` Đã cập nhật thông tin user "${selectedUser.fullName || selectedUser.userName}" thành công!`);
      
      // Refresh users list
      await refreshUsers();
      setShowEditModal(false);
      setSelectedUser(null);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi cập nhật user!');
    } finally {
      setActionLoading(false);
    }
  };

  const executeAction = async () => {
    if (!confirmAction || !selectedUser) return;

    setActionLoading(true);
    try {
      if (confirmAction.type === 'toggle-status') {
        // Toggle logic: active (1) -> inactive (2), inactive (2) -> active (1)
        const isCurrentlyActive = selectedUser.statusName?.toLowerCase() === 'active';
        const newStatusId = isCurrentlyActive ? 2 : 1; // If active -> disable (2), if inactive -> enable (1)
        
        await axiosInstance.put(`/admin/users/${selectedUser.userId}/status`, {
          statusId: newStatusId
        });
        
        toast.success(
          newStatusId === 1 
            ? ` Đã kích hoạt user "${selectedUser.fullName || selectedUser.userName}". User có thể đăng nhập trở lại.` 
            : `⚠️ Đã vô hiệu hóa user "${selectedUser.fullName || selectedUser.userName}". User không thể đăng nhập.`
        );
      } else if (confirmAction.type === 'soft-delete') {
        await axiosInstance.delete(`/admin/users/${selectedUser.userId}/soft-delete`);
        toast.success(`🗑️ Đã xóa user ${selectedUser.fullName || selectedUser.userName}`);
        // Refresh deleted users list to update count
        await fetchDeletedUsers();
      } else if (confirmAction.type === 'restore') {
        await axiosInstance.put(`/admin/users/${selectedUser.userId}/restore`);
        toast.success(` Đã khôi phục user ${selectedUser.fullName || selectedUser.userName}`);
        // Refresh deleted users list
        await fetchDeletedUsers();
      }

      // Refresh users list
      await refreshUsers();
      setShowConfirmModal(false);
      setSelectedUser(null);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra!');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-primary/10 rounded-lg">
            <Users className="text-primary" size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-base-content">Quản Lý User</h1>
            <p className="text-sm text-base-content/60">Xem, chỉnh sửa, vô hiệu hóa và quản lý quyền người dùng</p>
          </div>
        </div>
        <div className="stats shadow">
          <div className="stat place-items-center py-2 px-4">
            <div className="stat-value text-primary text-2xl">{users.length}</div>
            <div className="stat-desc">Tổng Users</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs tabs-boxed mb-6 bg-base-200 p-2">
        <a 
          className={`tab tab-lg ${activeTab === 'active' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('active')}
        >
          👥 Users Hoạt động ({users.length})
        </a>
        <a 
          className={`tab tab-lg ${activeTab === 'deleted' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('deleted')}
        >
          🗑️ Đã xóa ({deletedUsers.length})
        </a>
      </div>

      {/* Filters */}
      <div className="card bg-base-100 shadow-xl mb-6">
        <div className="card-body p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-14">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Tìm kiếm</span>
              </label>
              <SearchInput searchTerm={searchTerm} handleSearch={handleSearch} />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Lọc theo Quyền</span>
              </label>
              <select 
                className="select select-bordered w-full"
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
              >
                <option value="all">Tất cả Quyền</option>
                <option value="admin">Admin</option>
                <option value="customer">Customer</option>
              </select>
            </div>

            {activeTab === 'active' && (
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Lọc theo Trạng thái</span>
                </label>
                <select 
                  className="select select-bordered w-full"
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                >
                  <option value="all">Tất cả</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Active Users Table */}
      {activeTab === 'active' && (
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body p-0">
            {filteredUsers.length === 0 ? (
            <div className="p-8 text-center">
              <Users size={48} className="mx-auto mb-4 text-base-content/20" />
              <p className="text-lg text-base-content/60">Không tìm thấy user phù hợp.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="table table-zebra">
                <thead>
                  <tr>
                    <th>STT</th>
                    <th>User</th>
                    <th>Liên hệ</th>
                    <th>Quyền</th>
                    <th>Trạng thái</th>
                    <th>Membership</th>
                    <th>Ngày tham gia</th>
                    <th className="text-center">Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user, index) => (
                    <tr key={user.userId} className="hover">
                      {/* STT */}
                      <td className="font-medium text-gray-600">
                        {index + 1}
                      </td>
                      {/* User Info */}
                      <td>
                        <div className="flex items-center gap-3">
                          <div className="avatar">
                            <div className="w-10 h-10 rounded-full">
                              <Avatar 
                                name={user.fullName || user.userName || user.email} 
                                size={40} 
                                round={true} 
                              />
                            </div>
                          </div>
                          <div>
                            <div className="font-bold">{user.fullName || user.userName}</div>
                            <div className="text-sm opacity-50">@{user.userName}</div>
                          </div>
                        </div>
                      </td>

                      {/* Contact */}
                      <td>
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2 text-sm">
                            <Mail size={14} className="text-base-content/50" />
                            <span>{user.email}</span>
                          </div>
                          {user.phone && (
                            <div className="flex items-center gap-2 text-sm opacity-70">
                              <Phone size={14} className="text-base-content/50" />
                              <span>{user.phone}</span>
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Role */}
                      <td>
                        <div className={`badge ${getRoleBadgeColor(user.roleName)} gap-2`}>
                          {getRoleIcon(user.roleName)}
                          {user.roleName}
                        </div>
                      </td>

                      {/* Status */}
                      <td>
                        <div className={`badge ${getStatusBadgeColor(user.statusName)} gap-2`}>
                          <div className={`w-2 h-2 rounded-full ${
                            user.statusName?.toLowerCase() === "active" ? "bg-success" : "bg-base-300"
                          }`}></div>
                          {user.statusName?.toLowerCase() === 'active' ? 'active' : 'inactive'}
                        </div>
                      </td>

                      {/* Membership */}
                      <td>
                        {user.membershipType ? (
                          <div className="badge badge-outline gap-2">
                            <Award size={14} />
                            {user.membershipType}
                          </div>
                        ) : (
                          <span className="text-base-content/30 text-sm">Chưa có</span>
                        )}
                      </td>

                      {/* Joined Date */}
                      <td>
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar size={14} className="text-base-content/50" />
                          <span>{format(new Date(user.createdAt), "dd/MM/yyyy")}</span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td>
                        <div className="flex items-center justify-center gap-2">
                          {/* View button - Always visible */}
                          <button
                            className="btn btn-ghost btn-xs"
                            onClick={() => handleView(user)}
                            title="Xem chi tiết"
                          >
                            <Eye size={16} />
                          </button>

                          {/* Edit button - Only for Manager and Customer */}
                          {canManageUser(user) ? (
                            <button
                              className="btn btn-ghost btn-xs"
                              onClick={() => handleEdit(user)}
                              title="Chỉnh sửa"
                            >
                              <Edit size={16} />
                            </button>
                          ) : (
                            <button
                              className="btn btn-ghost btn-xs btn-disabled"
                              title="Không thể chỉnh sửa Admin khác"
                              disabled
                            >
                              <Edit size={16} />
                            </button>
                          )}

                          {/* Toggle Status button - Only for Manager and Customer */}
                          {canManageUser(user) ? (
                            <button
                              className={`btn btn-ghost btn-xs ${
                                user.statusName?.toLowerCase() === 'active' ? 'text-warning' : 'text-success'
                              }`}
                              onClick={() => handleToggleStatus(user)}
                              title={user.statusName?.toLowerCase() === 'active' ? 'Vô hiệu hóa (user không thể đăng nhập)' : 'Kích hoạt (user có thể đăng nhập)'}
                            >
                              <Power size={16} />
                            </button>
                          ) : (
                            <button
                              className="btn btn-ghost btn-xs btn-disabled"
                              title="Không thể thay đổi trạng thái Admin khác"
                              disabled
                            >
                              <Power size={16} />
                            </button>
                          )}

                          {/* Soft Delete button - Only for Manager and Customer */}
                          {canManageUser(user) ? (
                            <button
                              className="btn btn-ghost btn-xs text-error"
                              onClick={() => handleSoftDelete(user)}
                              title="Xóa user"
                            >
                              <Trash2 size={16} />
                            </button>
                          ) : (
                            <button
                              className="btn btn-ghost btn-xs btn-disabled"
                              title="Không thể xóa Admin khác"
                              disabled
                            >
                              <Trash2 size={16} />
                            </button>
                          )}
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

      {/* Deleted Users Table */}
      {activeTab === 'deleted' && (
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body p-0">
            {loadingDeleted ? (
              <div className="p-8 text-center">
                <span className="loading loading-spinner loading-lg"></span>
                <p className="mt-4">Đang tải...</p>
              </div>
            ) : filteredDeletedUsers.length === 0 ? (
              <div className="p-8 text-center">
                <Users size={48} className="mx-auto mb-4 text-base-content/20" />
                <p className="text-lg text-base-content/60">Không có user nào bị xóa.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="table table-zebra">
                  <thead>
                    <tr>
                      <th>STT</th>
                      <th>User</th>
                      <th>Liên hệ</th>
                      <th>Quyền</th>
                      <th>Membership</th>
                      <th>Ngày tham gia</th>
                      <th className="text-center">Hành động</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredDeletedUsers.map((user, index) => (
                      <tr key={user.userId} className="hover opacity-60">
                        {/* STT */}
                        <td className="font-medium text-gray-600">
                          {index + 1}
                        </td>
                        {/* User Info */}
                        <td>
                          <div className="flex items-center gap-3">
                            <div className="avatar opacity-50">
                              <div className="w-10 h-10 rounded-full">
                                <Avatar 
                                  name={user.fullName || user.userName || user.email} 
                                  size={40} 
                                  round={true} 
                                />
                              </div>
                            </div>
                            <div>
                              <div className="font-bold">{user.fullName || user.userName}</div>
                              <div className="text-sm opacity-50">@{user.userName}</div>
                            </div>
                          </div>
                        </td>

                        {/* Contact */}
                        <td>
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2 text-sm">
                              <Mail size={14} className="text-base-content/50" />
                              <span>{user.email}</span>
                            </div>
                            {user.phone && (
                              <div className="flex items-center gap-2 text-sm opacity-70">
                                <Phone size={14} className="text-base-content/50" />
                                <span>{user.phone}</span>
                              </div>
                            )}
                          </div>
                        </td>

                        {/* Role */}
                        <td>
                          <div className={`badge ${getRoleBadgeColor(user.roleName)} gap-2`}>
                            {getRoleIcon(user.roleName)}
                            {user.roleName}
                          </div>
                        </td>

                        {/* Membership */}
                        <td>
                          {user.membershipType ? (
                            <div className="badge badge-outline gap-2">
                              <Award size={14} />
                              {user.membershipType}
                            </div>
                          ) : (
                            <span className="text-base-content/30 text-sm">Chưa có</span>
                          )}
                        </td>

                        {/* Joined Date */}
                        <td>
                          <div className="flex items-center gap-2 text-sm">
                            <Calendar size={14} className="text-base-content/50" />
                            <span>{format(new Date(user.createdAt), "dd/MM/yyyy")}</span>
                          </div>
                        </td>

                        {/* Actions */}
                        <td>
                          <div className="flex items-center justify-center gap-2">
                            {/* View button */}
                            <button
                              className="btn btn-ghost btn-xs"
                              onClick={() => handleView(user)}
                              title="Xem chi tiết"
                            >
                              <Eye size={16} />
                            </button>

                            {/* Restore button - Only for Manager and Customer */}
                            {canManageUser(user) ? (
                              <button
                                className="btn btn-ghost btn-xs text-success"
                                onClick={() => handleRestore(user)}
                                title="Khôi phục user"
                              >
                                <Power size={16} className="rotate-180" />
                              </button>
                            ) : (
                              <button
                                className="btn btn-ghost btn-xs btn-disabled"
                                title="Không thể khôi phục Admin khác"
                                disabled
                              >
                                <Power size={16} className="rotate-180" />
                              </button>
                            )}
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

      {/* Footer Stats */}
      {activeTab === 'active' && (
        <div className="mt-6 stats stats-vertical lg:stats-horizontal shadow w-full">
        <div className="stat">
          <div className="stat-figure text-error">
            <Shield size={32} />
          </div>
          <div className="stat-title">Admins</div>
          <div className="stat-value text-error">
            {users.filter(u => u.roleName?.toLowerCase() === "admin").length}
          </div>
        </div>
        
        <div className="stat">
          <div className="stat-figure text-warning">
            <Crown size={32} />
          </div>
          <div className="stat-title">Managers</div>
          <div className="stat-value text-warning">
            {users.filter(u => u.roleName?.toLowerCase() === "manager").length}
          </div>
        </div>
        
        <div className="stat">
          <div className="stat-figure text-info">
            <Users size={32} />
          </div>
          <div className="stat-title">Customers</div>
          <div className="stat-value text-info">
            {users.filter(u => u.roleName?.toLowerCase() === "customer").length}
          </div>
        </div>

        <div className="stat">
          <div className="stat-figure text-success">
            <Check size={32} />
          </div>
          <div className="stat-title">Đang hoạt động</div>
          <div className="stat-value text-success">
            {users.filter(u => u.statusName?.toLowerCase() === "active").length}
          </div>
        </div>
      </div>
      )}

      {/* View Modal */}
      {showViewModal && selectedUser && (
        <dialog className="modal modal-open">
          <div className="modal-box max-w-2xl">
            <h3 className="font-bold text-lg mb-4">Chi tiết User</h3>
            
            <div className="flex items-center gap-4 mb-6">
              <div className="avatar">
                <div className="w-20 h-20 rounded-full">
                  <Avatar 
                    name={selectedUser.fullName || selectedUser.userName || selectedUser.email} 
                    size={80} 
                    round={true} 
                  />
                </div>
              </div>
              <div>
                <h4 className="text-xl font-bold">{selectedUser.fullName || selectedUser.userName}</h4>
                <p className="text-sm opacity-70">@{selectedUser.userName}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm opacity-70">Email</p>
                <p className="font-semibold">{selectedUser.email}</p>
              </div>
              <div>
                <p className="text-sm opacity-70">Số điện thoại</p>
                <p className="font-semibold">{selectedUser.phone || 'Chưa có'}</p>
              </div>
              <div>
                <p className="text-sm opacity-70">Quyền</p>
                <div className={`badge ${getRoleBadgeColor(selectedUser.roleName)} gap-2 mt-1`}>
                  {getRoleIcon(selectedUser.roleName)}
                  {selectedUser.roleName}
                </div>
              </div>
              <div>
                <p className="text-sm opacity-70">Trạng thái</p>
                <div className={`badge ${getStatusBadgeColor(selectedUser.statusName)} gap-2 mt-1`}>
                  {selectedUser.statusName}
                </div>
              </div>
              <div>
                <p className="text-sm opacity-70">Membership</p>
                <p className="font-semibold">{selectedUser.membershipType || 'Chưa có'}</p>
              </div>
              <div>
                <p className="text-sm opacity-70">Ngày tham gia</p>
                <p className="font-semibold">{format(new Date(selectedUser.createdAt), "dd/MM/yyyy HH:mm")}</p>
              </div>
            </div>

            <div className="modal-action">
              <button className="btn" onClick={() => setShowViewModal(false)}>Đóng</button>
            </div>
          </div>
          <form method="dialog" className="modal-backdrop">
            <button onClick={() => setShowViewModal(false)}>close</button>
          </form>
        </dialog>
      )}

      {/* Edit Modal */}
      {showEditModal && selectedUser && (
        <EditUserModal 
          user={selectedUser}
          onClose={() => {
            setShowEditModal(false);
            setSelectedUser(null);
          }}
          onSave={handleSaveEdit}
          loading={actionLoading}
        />
      )}

      {/* Confirmation Modal */}
      {showConfirmModal && confirmAction && selectedUser && (
        <dialog className="modal modal-open">
          <div className="modal-box">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-warning/20 rounded-lg">
                <AlertTriangle className="text-warning" size={24} />
              </div>
              <h3 className="font-bold text-lg">{confirmAction.title}</h3>
            </div>
            
            <p className="py-4">{confirmAction.message}</p>

            <div className="bg-base-200 p-3 rounded-lg mb-4">
              <p className="text-sm"><strong>User:</strong> {selectedUser.fullName || selectedUser.userName}</p>
              <p className="text-sm"><strong>Email:</strong> {selectedUser.email}</p>
              <p className="text-sm"><strong>Quyền:</strong> {selectedUser.roleName}</p>
            </div>

            <div className="modal-action">
              <button 
                className="btn btn-ghost" 
                onClick={() => setShowConfirmModal(false)}
                disabled={actionLoading}
              >
                Hủy
              </button>
              <button 
                className={`btn ${confirmAction.confirmClass}`}
                onClick={executeAction}
                disabled={actionLoading}
              >
                {actionLoading ? (
                  <span className="loading loading-spinner loading-sm"></span>
                ) : (
                  confirmAction.confirmText
                )}
              </button>
            </div>
          </div>
          <form method="dialog" className="modal-backdrop">
            <button onClick={() => setShowConfirmModal(false)}>close</button>
          </form>
        </dialog>
      )}
    </div>
  );
};

export default UserPage;
