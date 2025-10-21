import React, { useState } from "react";
import { 
  Users, Mail, Phone, Calendar, Shield, Crown, Award, 
  Edit, Power, Trash2, Eye, AlertTriangle, Check, Building2
} from "lucide-react";
import { useSelector } from "react-redux";
import useOwners from "@hooks/admin/useOwners";
import OwnersSkeleton from "./OwnersSkeleton";
import SearchBar from "./SearchBar";
import EditOwnerModal from "./EditOwnerModal";
import Avatar from "react-avatar";
import { format } from "date-fns";
import toast from "react-hot-toast";
import axiosInstance from "@hooks/useAxiosInstance";

const OwnerPage = () => {
  const { owners, loading, searchTerm, handleSearch, refreshOwners } = useOwners();
  const currentUserId = useSelector((state) => state.auth.userId);
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [activeTab, setActiveTab] = useState("active"); // "active" or "deleted"
  const [deletedOwners, setDeletedOwners] = useState([]);
  const [loadingDeleted, setLoadingDeleted] = useState(false);
  
  // Modal states
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedOwner, setSelectedOwner] = useState(null);
  const [confirmAction, setConfirmAction] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Fetch deleted owners when switching to deleted tab
  const fetchDeletedOwners = async () => {
    setLoadingDeleted(true);
    try {
      const response = await axiosInstance.get('/admin/users/deleted');
      // Filter only managers (RoleId = 2)
      const managersOnly = (response.data.data || []).filter(
        user => user.roleName?.toLowerCase() === 'manager'
      );
      setDeletedOwners(managersOnly);
    } catch (error) {
      toast.error('Không thể tải danh sách owner đã xóa');
      setDeletedOwners([]);
    } finally {
      setLoadingDeleted(false);
    }
  };

  // Effect to fetch deleted owners when tab changes
  React.useEffect(() => {
    if (activeTab === 'deleted') {
      fetchDeletedOwners();
    }
  }, [activeTab]);

  // Fetch deleted owners on mount to show correct count in tab
  React.useEffect(() => {
    fetchDeletedOwners();
  }, []);

  if (loading) return <OwnersSkeleton />;

  // Get active owners from useOwners hook (already filtered to RoleId = 2 and by search)
  const activeOwners = owners.all || [];
  const searchFilteredOwners = owners.filtered || [];

  // Filter by status (apply to search-filtered results)
  const filteredOwners = searchFilteredOwners.filter(owner => {
    const ownerStatusLower = owner.statusName?.toLowerCase();
    const statusMatch = selectedStatus === "all" || ownerStatusLower === selectedStatus.toLowerCase();
    return statusMatch;
  });

  // Filter deleted owners (with search)
  const filteredDeletedOwners = deletedOwners.filter(owner => {
    // Search match
    const searchLower = searchTerm.toLowerCase();
    const searchMatch = !searchTerm || 
      owner.fullName?.toLowerCase().includes(searchLower) ||
      owner.userName?.toLowerCase().includes(searchLower) ||
      owner.email?.toLowerCase().includes(searchLower) ||
      owner.phone?.toLowerCase().includes(searchLower);
    
    return searchMatch;
  });

  const getStatusBadgeColor = (status) => {
    const statusLower = status?.toLowerCase();
    return statusLower === "active" ? "badge-success" : "badge-ghost";
  };

  // Helper: Check if owner can be managed (Admin cannot edit/delete themselves)
  const canManageOwner = (owner) => {
    // Check if this is the current logged-in user
    const isCurrentUser = currentUserId && (
      owner.userId === currentUserId || 
      owner.userId === parseInt(currentUserId) ||
      String(owner.userId) === String(currentUserId)
    );
    
    // Admin CANNOT manage themselves
    if (isCurrentUser) {
      return false;
    }
    
    // Admin can manage all Managers/Owners
    return true;
  };

  // Action handlers
  const handleView = (owner) => {
    setSelectedOwner(owner);
    setShowViewModal(true);
  };

  const handleEdit = (owner) => {
    if (!canManageOwner(owner)) {
      toast.error("❌ Không thể chỉnh sửa chính mình!");
      return;
    }
    setSelectedOwner(owner);
    setShowEditModal(true);
  };

  const handleToggleStatus = (owner) => {
    if (!canManageOwner(owner)) {
      toast.error("❌ Không thể thay đổi trạng thái của chính mình!");
      return;
    }

    setSelectedOwner(owner);
    const isActive = owner.statusName?.toLowerCase() === 'active';
    
    setConfirmAction({
      type: 'toggle-status',
      title: isActive ? 'Vô hiệu hóa Owner' : 'Kích hoạt Owner',
      message: isActive 
        ? `Bạn có chắc muốn VÔ HIỆU HÓA owner "${owner.fullName || owner.userName}"? Owner sẽ KHÔNG THỂ ĐĂNG NHẬP và quản lý sân của mình.`
        : `Bạn có chắc muốn KÍCH HOẠT lại owner "${owner.fullName || owner.userName}"? Owner sẽ có thể đăng nhập và quản lý sân trở lại.`,
      confirmText: isActive ? 'Vô hiệu hóa' : 'Kích hoạt',
      confirmClass: isActive ? 'btn-warning' : 'btn-success'
    });
    setShowConfirmModal(true);
  };

  const handleSoftDelete = (owner) => {
    if (!canManageOwner(owner)) {
      toast.error("❌ Không thể xóa chính mình!");
      return;
    }

    setSelectedOwner(owner);
    setConfirmAction({
      type: 'soft-delete',
      title: 'Xóa Owner (Soft Delete)',
      message: `Bạn có chắc muốn XÓA owner "${owner.fullName || owner.userName}"? Đây là soft-delete, dữ liệu vẫn được lưu nhưng owner sẽ bị ẩn khỏi hệ thống. Các sân của owner này sẽ không bị ảnh hưởng.`,
      confirmText: 'Xóa Owner',
      confirmClass: 'btn-error'
    });
    setShowConfirmModal(true);
  };

  const handleRestore = (owner) => {
    if (!canManageOwner(owner)) {
      toast.error("❌ Không thể khôi phục chính mình!");
      return;
    }

    setSelectedOwner(owner);
    setConfirmAction({
      type: 'restore',
      title: 'Khôi phục Owner',
      message: `Bạn có chắc muốn KHÔI PHỤC owner "${owner.fullName || owner.userName}"? Owner sẽ được hiển thị trở lại trong hệ thống và có thể quản lý sân.`,
      confirmText: 'Khôi phục',
      confirmClass: 'btn-success'
    });
    setShowConfirmModal(true);
  };

  const handleSaveEdit = async (formData) => {
    setActionLoading(true);
    try {
      await axiosInstance.put(`/admin/users/${selectedOwner.userId}`, formData);
      
      toast.success(`✅ Đã cập nhật thông tin owner "${selectedOwner.fullName || selectedOwner.userName}" thành công!`);
      
      // Refresh owners list
      await refreshOwners();
      setShowEditModal(false);
      setSelectedOwner(null);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi cập nhật owner!');
    } finally {
      setActionLoading(false);
    }
  };

  const executeAction = async () => {
    if (!confirmAction || !selectedOwner) return;

    setActionLoading(true);
    try {
      if (confirmAction.type === 'toggle-status') {
        const isCurrentlyActive = selectedOwner.statusName?.toLowerCase() === 'active';
        const newStatusId = isCurrentlyActive ? 2 : 1;
        
        await axiosInstance.put(`/admin/users/${selectedOwner.userId}/status`, {
          statusId: newStatusId
        });
        
        toast.success(
          newStatusId === 1 
            ? `✅ Đã kích hoạt owner "${selectedOwner.fullName || selectedOwner.userName}".` 
            : `⚠️ Đã vô hiệu hóa owner "${selectedOwner.fullName || selectedOwner.userName}".`
        );
      } else if (confirmAction.type === 'soft-delete') {
        await axiosInstance.delete(`/admin/users/${selectedOwner.userId}/soft-delete`);
        toast.success(`🗑️ Đã xóa owner ${selectedOwner.fullName || selectedOwner.userName}`);
        await fetchDeletedOwners();
      } else if (confirmAction.type === 'restore') {
        await axiosInstance.put(`/admin/users/${selectedOwner.userId}/restore`);
        toast.success(`✅ Đã khôi phục owner ${selectedOwner.fullName || selectedOwner.userName}`);
        await fetchDeletedOwners();
      }

      // Refresh owners list
      await refreshOwners();
      setShowConfirmModal(false);
      setSelectedOwner(null);
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
          <div className="p-3 bg-warning/10 rounded-lg">
            <Crown className="text-warning" size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-base-content">Quản Lý Owner</h1>
            <p className="text-sm text-base-content/60">Quản lý chủ sân (Manager) - xem, chỉnh sửa và theo dõi hoạt động</p>
          </div>
        </div>
        <div className="stats shadow">
          <div className="stat place-items-center py-2 px-4">
            <div className="stat-value text-warning text-2xl">{activeOwners.length}</div>
            <div className="stat-desc">Tổng Owners</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs tabs-boxed mb-6 bg-base-200 p-2">
        <a 
          className={`tab tab-lg ${activeTab === 'active' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('active')}
        >
          Owners Hoạt động ({activeOwners.length})
        </a>
        <a 
          className={`tab tab-lg ${activeTab === 'deleted' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('deleted')}
        >
          🗑️ Đã xóa ({deletedOwners.length})
        </a>
      </div>

      {/* Filters */}
      <div className="card bg-base-100 shadow-xl mb-6">
        <div className="card-body p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Tìm kiếm</span>
              </label>
              <SearchBar searchTerm={searchTerm} handleSearch={handleSearch} />
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

      {/* Active Owners Table */}
      {activeTab === 'active' && (
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body p-0">
            {filteredOwners.length === 0 ? (
              <div className="p-8 text-center">
                <Crown size={48} className="mx-auto mb-4 text-base-content/20" />
                <p className="text-lg text-base-content/60">Không tìm thấy owner phù hợp.</p>
              </div>
            ) : (
              <div className="overflow-x-auto max-h-[600px]">
                <table className="table table-zebra">
                  <thead className="sticky top-0 z-10 bg-base-200 shadow-sm">
                    <tr>
                      <th>STT</th>
                      <th>Owner</th>
                      <th>Liên hệ</th>
                      <th>Sân</th>
                      <th>Trạng thái</th>
                      <th>Membership</th>
                      <th>Ngày tham gia</th>
                      <th className="text-center">Hành động</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOwners.map((owner, index) => (
                      <tr key={owner.userId} className="hover">
                        {/* STT */}
                        <td className="font-medium text-gray-600">
                          {index + 1}
                        </td>
                        {/* Owner Info */}
                        <td>
                          <div className="flex items-center gap-3">
                            <div className="avatar">
                              <div className="w-10 h-10 rounded-full">
                                <Avatar 
                                  name={owner.fullName || owner.userName || owner.email} 
                                  size={40} 
                                  round={true} 
                                />
                              </div>
                            </div>
                            <div>
                              <div className="font-bold flex items-center gap-2">
                                {owner.fullName || owner.userName}
                                <Crown size={14} className="text-warning" />
                              </div>
                              <div className="text-sm opacity-50">@{owner.userName}</div>
                            </div>
                          </div>
                        </td>

                        {/* Contact */}
                        <td>
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2 text-sm">
                              <Mail size={14} className="text-base-content/50" />
                              <span>{owner.email}</span>
                            </div>
                            {owner.phone && (
                              <div className="flex items-center gap-2 text-sm opacity-70">
                                <Phone size={14} className="text-base-content/50" />
                                <span>{owner.phone}</span>
                              </div>
                            )}
                          </div>
                        </td>

                        {/* Facilities & Courts */}
                        <td>
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2 text-sm">
                              <Building2 size={14} className="text-info" />
                              <span className="font-semibold text-info">{owner.totalFacilities || 0}</span>
                              <span className="text-xs opacity-70">cơ sở</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <Users size={14} className="text-success" />
                              <span className="font-semibold text-success">{owner.totalCourts || 0}</span>
                              <span className="text-xs opacity-70">sân</span>
                            </div>
                          </div>
                        </td>

                        {/* Status */}
                        <td>
                          <div className={`badge ${getStatusBadgeColor(owner.statusName)} gap-2`}>
                            <div className={`w-2 h-2 rounded-full ${
                              owner.statusName?.toLowerCase() === "active" ? "bg-success" : "bg-base-300"
                            }`}></div>
                            {owner.statusName?.toLowerCase() === 'active' ? 'active' : 'inactive'}
                          </div>
                        </td>

                        {/* Membership */}
                        <td>
                          {owner.membershipType ? (
                            <div className="badge badge-outline gap-2">
                              <Award size={14} />
                              {owner.membershipType}
                            </div>
                          ) : (
                            <span className="text-base-content/30 text-sm">Chưa có</span>
                          )}
                        </td>

                        {/* Joined Date */}
                        <td>
                          <div className="flex items-center gap-2 text-sm">
                            <Calendar size={14} className="text-base-content/50" />
                            <span>{format(new Date(owner.createdAt), "dd/MM/yyyy")}</span>
                          </div>
                        </td>

                        {/* Actions */}
                        <td>
                          <div className="flex items-center justify-center gap-2">
                            {/* View button - Always visible */}
                            <button
                              className="btn btn-ghost btn-xs"
                              onClick={() => handleView(owner)}
                              title="Xem chi tiết"
                            >
                              <Eye size={16} />
                            </button>

                            {/* Edit button */}
                            {canManageOwner(owner) ? (
                              <button
                                className="btn btn-ghost btn-xs"
                                onClick={() => handleEdit(owner)}
                                title="Chỉnh sửa"
                              >
                                <Edit size={16} />
                              </button>
                            ) : (
                              <button
                                className="btn btn-ghost btn-xs btn-disabled"
                                title="Không thể chỉnh sửa chính mình"
                                disabled
                              >
                                <Edit size={16} />
                              </button>
                            )}

                            {/* Toggle Status button */}
                            {canManageOwner(owner) ? (
                              <button
                                className={`btn btn-ghost btn-xs ${
                                  owner.statusName?.toLowerCase() === 'active' ? 'text-warning' : 'text-success'
                                }`}
                                onClick={() => handleToggleStatus(owner)}
                                title={owner.statusName?.toLowerCase() === 'active' ? 'Vô hiệu hóa' : 'Kích hoạt'}
                              >
                                <Power size={16} />
                              </button>
                            ) : (
                              <button
                                className="btn btn-ghost btn-xs btn-disabled"
                                title="Không thể thay đổi trạng thái của chính mình"
                                disabled
                              >
                                <Power size={16} />
                              </button>
                            )}

                            {/* Soft Delete button */}
                            {canManageOwner(owner) ? (
                              <button
                                className="btn btn-ghost btn-xs text-error"
                                onClick={() => handleSoftDelete(owner)}
                                title="Xóa owner"
                              >
                                <Trash2 size={16} />
                              </button>
                            ) : (
                              <button
                                className="btn btn-ghost btn-xs btn-disabled"
                                title="Không thể xóa chính mình"
                                disabled
                              >
                                <Trash2 size={16} />
                              </button>
                            )}

                            {/* View Facilities button */}
                            <button
                              className="btn btn-ghost btn-xs text-info"
                              onClick={() => window.location.href = `/admin/owners/${owner.userId}/turf`}
                              title="Xem sân của owner"
                            >
                              <Building2 size={16} />
                            </button>
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

      {/* Deleted Owners Table */}
      {activeTab === 'deleted' && (
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body p-0">
            {loadingDeleted ? (
              <div className="p-8 text-center">
                <span className="loading loading-spinner loading-lg"></span>
                <p className="mt-4">Đang tải...</p>
              </div>
            ) : filteredDeletedOwners.length === 0 ? (
              <div className="p-8 text-center">
                <Crown size={48} className="mx-auto mb-4 text-base-content/20" />
                <p className="text-lg text-base-content/60">Không có owner nào bị xóa.</p>
              </div>
            ) : (
              <div className="overflow-x-auto max-h-[600px]">
                <table className="table table-zebra">
                  <thead className="sticky top-0 z-10 bg-base-200 shadow-sm">
                    <tr>
                      <th>STT</th>
                      <th>Owner</th>
                      <th>Liên hệ</th>
                      <th>Sân</th>
                      <th>Membership</th>
                      <th>Ngày tham gia</th>
                      <th className="text-center">Hành động</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredDeletedOwners.map((owner, index) => (
                      <tr key={owner.userId} className="hover opacity-60">
                        {/* STT */}
                        <td className="font-medium text-gray-600">
                          {index + 1}
                        </td>
                        {/* Owner Info */}
                        <td>
                          <div className="flex items-center gap-3">
                            <div className="avatar opacity-50">
                              <div className="w-10 h-10 rounded-full">
                                <Avatar 
                                  name={owner.fullName || owner.userName || owner.email} 
                                  size={40} 
                                  round={true} 
                                />
                              </div>
                            </div>
                            <div>
                              <div className="font-bold">{owner.fullName || owner.userName}</div>
                              <div className="text-sm opacity-50">@{owner.userName}</div>
                            </div>
                          </div>
                        </td>

                        {/* Contact */}
                        <td>
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2 text-sm">
                              <Mail size={14} className="text-base-content/50" />
                              <span>{owner.email}</span>
                            </div>
                            {owner.phone && (
                              <div className="flex items-center gap-2 text-sm opacity-70">
                                <Phone size={14} className="text-base-content/50" />
                                <span>{owner.phone}</span>
                              </div>
                            )}
                          </div>
                        </td>

                        {/* Facilities & Courts - Deleted Owners */}
                        <td>
                          <div className="flex flex-col gap-1 opacity-50">
                            <div className="flex items-center gap-2 text-sm">
                              <Building2 size={14} className="text-info" />
                              <span className="font-semibold text-info">{owner.totalFacilities || 0}</span>
                              <span className="text-xs opacity-70">cơ sở</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <Users size={14} className="text-success" />
                              <span className="font-semibold text-success">{owner.totalCourts || 0}</span>
                              <span className="text-xs opacity-70">sân</span>
                            </div>
                          </div>
                        </td>

                        {/* Membership */}
                        <td>
                          {owner.membershipType ? (
                            <div className="badge badge-outline gap-2">
                              <Award size={14} />
                              {owner.membershipType}
                            </div>
                          ) : (
                            <span className="text-base-content/30 text-sm">Chưa có</span>
                          )}
                        </td>

                        {/* Joined Date */}
                        <td>
                          <div className="flex items-center gap-2 text-sm">
                            <Calendar size={14} className="text-base-content/50" />
                            <span>{format(new Date(owner.createdAt), "dd/MM/yyyy")}</span>
                          </div>
                        </td>

                        {/* Actions */}
                        <td>
                          <div className="flex items-center justify-center gap-2">
                            {/* View button */}
                            <button
                              className="btn btn-ghost btn-xs"
                              onClick={() => handleView(owner)}
                              title="Xem chi tiết"
                            >
                              <Eye size={16} />
                            </button>

                            {/* Restore button */}
                            {canManageOwner(owner) ? (
                              <button
                                className="btn btn-ghost btn-xs text-success"
                                onClick={() => handleRestore(owner)}
                                title="Khôi phục owner"
                              >
                                <Power size={16} className="rotate-180" />
                              </button>
                            ) : (
                              <button
                                className="btn btn-ghost btn-xs btn-disabled"
                                title="Không thể khôi phục chính mình"
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
            <div className="stat-figure text-warning">
              <Crown size={32} />
            </div>
            <div className="stat-title">Tổng Owners</div>
            <div className="stat-value text-warning">
              {activeOwners.length}
            </div>
            <div className="stat-desc">Chủ sân đang hoạt động</div>
          </div>
          
          <div className="stat">
            <div className="stat-figure text-success">
              <Check size={32} />
            </div>
            <div className="stat-title">Đang hoạt động</div>
            <div className="stat-value text-success">
              {activeOwners.filter(o => o.statusName?.toLowerCase() === "active").length}
            </div>
            <div className="stat-desc">Owners active</div>
          </div>

          <div className="stat">
            <div className="stat-figure text-info">
              <Building2 size={32} />
            </div>
            <div className="stat-title">Tổng cơ sở</div>
            <div className="stat-value text-info">
              {activeOwners.reduce((sum, owner) => sum + (owner.totalFacilities || 0), 0)}
            </div>
            <div className="stat-desc">Facilities đang quản lý</div>
          </div>

          <div className="stat">
            <div className="stat-figure text-success">
              <Users size={32} />
            </div>
            <div className="stat-title">Tổng sân</div>
            <div className="stat-value text-success">
              {activeOwners.reduce((sum, owner) => sum + (owner.totalCourts || 0), 0)}
            </div>
            <div className="stat-desc">Courts đang hoạt động</div>
          </div>
        </div>
      )}

      {/* View Modal */}
      {showViewModal && selectedOwner && (
        <dialog className="modal modal-open">
          <div className="modal-box max-w-2xl">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <Crown className="text-warning" size={20} />
              Chi tiết Owner
            </h3>
            
            <div className="flex items-center gap-4 mb-6">
              <div className="avatar">
                <div className="w-20 h-20 rounded-full">
                  <Avatar 
                    name={selectedOwner.fullName || selectedOwner.userName || selectedOwner.email} 
                    size={80} 
                    round={true} 
                  />
                </div>
              </div>
              <div>
                <h4 className="text-xl font-bold">{selectedOwner.fullName || selectedOwner.userName}</h4>
                <p className="text-sm opacity-70">@{selectedOwner.userName}</p>
                <div className="badge badge-warning gap-2 mt-1">
                  <Crown size={12} />
                  Manager/Owner
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm opacity-70">Email</p>
                <p className="font-semibold">{selectedOwner.email}</p>
              </div>
              <div>
                <p className="text-sm opacity-70">Số điện thoại</p>
                <p className="font-semibold">{selectedOwner.phone || 'Chưa có'}</p>
              </div>
              <div>
                <p className="text-sm opacity-70">Trạng thái</p>
                <div className={`badge ${getStatusBadgeColor(selectedOwner.statusName)} gap-2 mt-1`}>
                  {selectedOwner.statusName}
                </div>
              </div>
              <div>
                <p className="text-sm opacity-70">Membership</p>
                <p className="font-semibold">{selectedOwner.membershipType || 'Chưa có'}</p>
              </div>
              <div>
                <p className="text-sm opacity-70">Ngày tham gia</p>
                <p className="font-semibold">{format(new Date(selectedOwner.createdAt), "dd/MM/yyyy HH:mm")}</p>
              </div>
            </div>

            <div className="modal-action">
              <button className="btn" onClick={() => setShowViewModal(false)}>Đóng</button>
              <button 
                className="btn btn-info"
                onClick={() => window.location.href = `/admin/owners/${selectedOwner.userId}/turf`}
              >
                <Building2 size={16} className="mr-2" />
                Xem sân của Owner
              </button>
            </div>
          </div>
          <form method="dialog" className="modal-backdrop">
            <button onClick={() => setShowViewModal(false)}>close</button>
          </form>
        </dialog>
      )}

      {/* Edit Modal */}
      {showEditModal && selectedOwner && (
        <EditOwnerModal 
          owner={selectedOwner}
          onClose={() => {
            setShowEditModal(false);
            setSelectedOwner(null);
          }}
          onSave={handleSaveEdit}
          loading={actionLoading}
        />
      )}

      {/* Confirmation Modal */}
      {showConfirmModal && confirmAction && selectedOwner && (
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
              <p className="text-sm"><strong>Owner:</strong> {selectedOwner.fullName || selectedOwner.userName}</p>
              <p className="text-sm"><strong>Email:</strong> {selectedOwner.email}</p>
              <p className="text-sm"><strong>Quyền:</strong> Manager/Owner</p>
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

export default OwnerPage;
