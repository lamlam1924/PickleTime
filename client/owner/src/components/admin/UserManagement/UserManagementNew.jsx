import React, { useState } from "react";
import { useUserManagement } from "@hooks/admin/useUserManagement";
import UserSkeleton from "./UserSkeleton";
import SearchInput from "./SearchInput";

const UserManagementNew = () => {
  const { users, loading, error, updateUserStatus, getUserById } = useUserManagement();
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // Filter users
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.userName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "all" || user.roleName === roleFilter;
    const matchesStatus =
      statusFilter === "all" || user.statusName === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  // Handle status change
  const handleStatusChange = async (userId, newStatusId) => {
    try {
      await updateUserStatus(userId, newStatusId);
      alert("Status updated successfully!");
      setShowStatusModal(false);
      setSelectedUser(null);
    } catch (err) {
      alert(err.message);
    }
  };

  // Handle view details
  const handleViewDetails = async (userId) => {
    try {
      const user = await getUserById(userId);
      setSelectedUser(user);
      setShowDetailModal(true);
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <UserSkeleton />;
  if (error) return (
    <div className="p-8">
      <div className="alert alert-error">
        <span>Error: {error}</span>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center text-primary">
        User Status Management
      </h1>

      {/* Filters */}
      <div className="bg-base-100 p-4 rounded-lg shadow-md mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Search</span>
            </label>
            <input
              type="text"
              placeholder="Search by name, email or username..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input input-bordered w-full"
            />
          </div>

          {/* Role Filter */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Filter by Role</span>
            </label>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="select select-bordered w-full"
            >
              <option value="all">All Roles</option>
              <option value="admin">Admin</option>
              <option value="manager">Manager</option>
              <option value="customer">Customer</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Filter by Status</span>
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="select select-bordered w-full"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        {/* Results Count */}
        <div className="mt-4 text-sm text-gray-600">
          Showing {filteredUsers.length} of {users.length} users
        </div>
      </div>

      {/* User Table */}
      <div className="bg-base-100 rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead>
              <tr>
                <th>User</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Membership</th>
                <th>Last Login</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-8">
                    <div className="text-gray-500">No users found</div>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.userId} className="hover">
                    <td>
                      <div className="flex items-center space-x-3">
                        <div className="avatar placeholder">
                          <div className="bg-neutral-focus text-neutral-content rounded-full w-12">
                            <span className="text-xl">
                              {user.fullName?.charAt(0) ||
                                user.userName?.charAt(0) ||
                                "?"}
                            </span>
                          </div>
                        </div>
                        <div>
                          <div className="font-bold">
                            {user.fullName || user.userName}
                          </div>
                          <div className="text-sm opacity-50">
                            @{user.userName}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div>{user.email}</div>
                      <div className="text-sm opacity-50">
                        {user.phone || "No phone"}
                      </div>
                    </td>
                    <td>
                      <span className="badge badge-primary badge-sm">
                        {user.roleName}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`badge badge-sm ${
                          user.statusName === "active"
                            ? "badge-success"
                            : "badge-error"
                        }`}
                      >
                        {user.statusName}
                      </span>
                    </td>
                    <td>
                      <span className="badge badge-outline badge-sm">
                        {user.membershipType || "Basic"}
                      </span>
                    </td>
                    <td>
                      <div className="text-sm">
                        {user.lastLogin
                          ? new Date(user.lastLogin).toLocaleDateString(
                              "vi-VN"
                            )
                          : "Never"}
                      </div>
                      <div className="text-xs opacity-50">
                        {user.lastLogin
                          ? new Date(user.lastLogin).toLocaleTimeString(
                              "vi-VN"
                            )
                          : ""}
                      </div>
                    </td>
                    <td className="text-right">
                      <div className="flex gap-2 justify-end">
                        <button
                          onClick={() => handleViewDetails(user.userId)}
                          className="btn btn-ghost btn-xs"
                          title="View Details"
                        >
                          👁️ View
                        </button>
                        <button
                          onClick={() => {
                            setSelectedUser(user);
                            setShowStatusModal(true);
                          }}
                          className="btn btn-ghost btn-xs"
                          title="Change Status"
                        >
                          🔄 Status
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Status Change Modal */}
      {showStatusModal && selectedUser && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-4">Change User Status</h3>
            <p className="mb-4">
              Change status for:{" "}
              <strong>{selectedUser.fullName || selectedUser.userName}</strong>
            </p>
            <p className="text-sm text-gray-600 mb-6">
              Current status:{" "}
              <span
                className={`badge ${
                  selectedUser.statusName === "active"
                    ? "badge-success"
                    : "badge-error"
                }`}
              >
                {selectedUser.statusName}
              </span>
            </p>

            <div className="space-y-2 mb-6">
              <button
                onClick={() => handleStatusChange(selectedUser.userId, 1)}
                className="btn btn-success w-full"
                disabled={selectedUser.statusId === 1}
              >
                 Set Active
              </button>
              <button
                onClick={() => handleStatusChange(selectedUser.userId, 2)}
                className="btn btn-error w-full"
                disabled={selectedUser.statusId === 2}
              >
                ❌ Set Inactive
              </button>
            </div>

            <div className="modal-action">
              <button
                onClick={() => {
                  setShowStatusModal(false);
                  setSelectedUser(null);
                }}
                className="btn"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {showDetailModal && selectedUser && (
        <div className="modal modal-open">
          <div className="modal-box max-w-2xl">
            <h3 className="font-bold text-lg mb-4">User Details</h3>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Full Name</span>
                </label>
                <div className="text-base">
                  {selectedUser.fullName || "N/A"}
                </div>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Username</span>
                </label>
                <div className="text-base">{selectedUser.userName}</div>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Email</span>
                </label>
                <div className="text-base">{selectedUser.email}</div>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Phone</span>
                </label>
                <div className="text-base">{selectedUser.phone || "N/A"}</div>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Gender</span>
                </label>
                <div className="text-base">{selectedUser.gender || "N/A"}</div>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Date of Birth</span>
                </label>
                <div className="text-base">
                  {selectedUser.dateOfBirth
                    ? new Date(selectedUser.dateOfBirth).toLocaleDateString(
                        "vi-VN"
                      )
                    : "N/A"}
                </div>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Role</span>
                </label>
                <div>
                  <span className="badge badge-primary">
                    {selectedUser.roleName}
                  </span>
                </div>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Status</span>
                </label>
                <div>
                  <span
                    className={`badge ${
                      selectedUser.statusName === "active"
                        ? "badge-success"
                        : "badge-error"
                    }`}
                  >
                    {selectedUser.statusName}
                  </span>
                </div>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Membership</span>
                </label>
                <div className="text-base">
                  {selectedUser.membershipType || "N/A"}
                </div>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Created At</span>
                </label>
                <div className="text-base">
                  {new Date(selectedUser.createdAt).toLocaleString("vi-VN")}
                </div>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Last Login</span>
                </label>
                <div className="text-base">
                  {selectedUser.lastLogin
                    ? new Date(selectedUser.lastLogin).toLocaleString("vi-VN")
                    : "Never"}
                </div>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Updated At</span>
                </label>
                <div className="text-base">
                  {new Date(selectedUser.updatedAt).toLocaleString("vi-VN")}
                </div>
              </div>
            </div>

            {selectedUser.address && (
              <div className="form-control mb-6">
                <label className="label">
                  <span className="label-text font-medium">Address</span>
                </label>
                <div className="text-base">{selectedUser.address}</div>
              </div>
            )}

            <div className="modal-action">
              <button
                onClick={() => {
                  setShowDetailModal(false);
                  setSelectedUser(null);
                }}
                className="btn btn-primary"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagementNew;
