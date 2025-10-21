import React, { useState } from "react";
import { X, Save, Crown } from "lucide-react";

const EditOwnerModal = ({ owner, onClose, onSave, loading }) => {
  const [formData, setFormData] = useState({
    fullName: owner.fullName || "",
    userName: owner.userName || "",
    email: owner.email || "",
    phone: owner.phone || "",
    membershipType: owner.membershipType || "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Họ tên không được để trống";
    }

    if (!formData.userName.trim()) {
      newErrors.userName = "Username không được để trống";
    } else if (formData.userName.length < 3) {
      newErrors.userName = "Username phải có ít nhất 3 ký tự";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email không được để trống";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email không hợp lệ";
    }

    if (formData.phone && !/^[0-9]{10,11}$/.test(formData.phone)) {
      newErrors.phone = "Số điện thoại phải có 10-11 chữ số";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      // Clean formData before sending - only send editable fields
      const cleanData = {
        fullName: formData.fullName?.trim(),
        phone: formData.phone?.trim(),
        membershipType: formData.membershipType || null,
      };
      
      // Remove null/undefined/empty values
      Object.keys(cleanData).forEach(key => {
        if (cleanData[key] === null || cleanData[key] === undefined || cleanData[key] === "") {
          delete cleanData[key];
        }
      });
      
      onSave(cleanData);
    }
  };

  return (
    <dialog className="modal modal-open">
      <div className="modal-box max-w-2xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-lg flex items-center gap-2">
            <Crown className="text-warning" size={20} />
            Chỉnh sửa thông tin Owner
          </h3>
          <button
            className="btn btn-ghost btn-sm btn-circle"
            onClick={onClose}
            disabled={loading}
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Full Name */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">
                  Họ và tên <span className="text-error">*</span>
                </span>
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className={`input input-bordered ${errors.fullName ? "input-error" : ""}`}
                placeholder="Nguyễn Văn A"
                disabled={loading}
              />
              {errors.fullName && (
                <label className="label">
                  <span className="label-text-alt text-error">{errors.fullName}</span>
                </label>
              )}
            </div>

            {/* Username */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">
                  Username <span className="text-error">*</span>
                </span>
              </label>
              <input
                type="text"
                name="userName"
                value={formData.userName}
                onChange={handleChange}
                className={`input input-bordered ${errors.userName ? "input-error" : ""}`}
                placeholder="nguyenvana"
                disabled={loading}
              />
              {errors.userName && (
                <label className="label">
                  <span className="label-text-alt text-error">{errors.userName}</span>
                </label>
              )}
            </div>

            {/* Email */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">
                  Email <span className="text-error">*</span>
                </span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`input input-bordered ${errors.email ? "input-error" : ""}`}
                placeholder="example@email.com"
                disabled={loading}
              />
              {errors.email && (
                <label className="label">
                  <span className="label-text-alt text-error">{errors.email}</span>
                </label>
              )}
            </div>

            {/* Phone */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Số điện thoại</span>
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className={`input input-bordered ${errors.phone ? "input-error" : ""}`}
                placeholder="0901234567"
                disabled={loading}
              />
              {errors.phone && (
                <label className="label">
                  <span className="label-text-alt text-error">{errors.phone}</span>
                </label>
              )}
            </div>

            {/* Membership Type */}
            <div className="form-control md:col-span-2">
              <label className="label">
                <span className="label-text font-semibold">Loại Membership</span>
              </label>
              <select
                name="membershipType"
                value={formData.membershipType}
                onChange={handleChange}
                className="select select-bordered"
                disabled={loading}
              >
                <option value="">Chọn loại membership</option>
                <option value="Basic">Basic</option>
                <option value="Premium">Premium</option>
                <option value="VIP">VIP</option>
              </select>
            </div>
          </div>

          {/* Info Alert */}
          <div className="alert alert-info mt-4">
            <div className="flex items-start gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="stroke-current shrink-0 w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
              <div className="text-sm">
                <p className="font-semibold">Lưu ý:</p>
                <ul className="list-disc list-inside mt-1 opacity-80">
                  <li>Username và Email phải là duy nhất trong hệ thống</li>
                  <li>Không thể thay đổi quyền Owner (Manager) của user này</li>
                  <li>Để thay đổi trạng thái hoặc xóa owner, hãy sử dụng các nút hành động khác</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="modal-action">
            <button
              type="button"
              className="btn btn-ghost"
              onClick={onClose}
              disabled={loading}
            >
              Hủy
            </button>
            <button type="submit" className="btn btn-success" disabled={loading}>
              {loading ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  Đang lưu...
                </>
              ) : (
                <>
                  <Save size={16} className="mr-2" />
                  Lưu thay đổi
                </>
              )}
            </button>
          </div>
        </form>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button onClick={onClose} disabled={loading}>
          close
        </button>
      </form>
    </dialog>
  );
};

export default EditOwnerModal;
