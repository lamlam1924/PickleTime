import React, { useState, useEffect } from "react";
import { User, Mail, Phone, MapPin, Award, AlertCircle } from "lucide-react";
import Avatar from "react-avatar";

const EditUserModal = ({ user, onClose, onSave, loading }) => {
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    address: "",
    membershipType: "",
    roleId: ""
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (user) {
      // Map roleName to roleId
      let roleId = "";
      const roleLower = user.roleName?.toLowerCase();
      if (roleLower === "admin") roleId = 1;
      else if (roleLower === "manager") roleId = 2;
      else if (roleLower === "customer") roleId = 3;
      
      setFormData({
        fullName: user.fullName || "",
        phone: user.phone || "",
        address: user.address || "",
        membershipType: user.membershipType || "",
        roleId: roleId
      });
    }
  }, [user]);

  const validate = () => {
    const newErrors = {};

    // FullName validation
    if (!formData.fullName || formData.fullName.trim().length === 0) {
      newErrors.fullName = "Tên đầy đủ là bắt buộc";
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = "Tên phải có ít nhất 2 ký tự";
    } else if (formData.fullName.trim().length > 100) {
      newErrors.fullName = "Tên không được quá 100 ký tự";
    }

    // Phone validation
    if (!formData.phone || formData.phone.trim().length === 0) {
      newErrors.phone = "Số điện thoại là bắt buộc";
    } else if (!/^0[0-9]{9}$/.test(formData.phone.trim())) {
      newErrors.phone = "Số điện thoại không hợp lệ (VD: 0901234567)";
    }

    // Address validation (optional but if provided, check length)
    if (formData.address && formData.address.trim().length > 200) {
      newErrors.address = "Địa chỉ không được quá 200 ký tự";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Convert roleId to number
    const finalValue = name === 'roleId' ? parseInt(value, 10) : value;
    
    setFormData(prev => ({
      ...prev,
      [name]: finalValue
    }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validate()) {
      // Clean formData before sending
      const cleanData = {
        fullName: formData.fullName?.trim(),
        phone: formData.phone?.trim(),
        address: formData.address?.trim() || null,
        membershipType: formData.membershipType || null,
        roleId: formData.roleId || null
      };
      
      // Remove null/undefined values
      Object.keys(cleanData).forEach(key => {
        if (cleanData[key] === null || cleanData[key] === undefined || cleanData[key] === "") {
          delete cleanData[key];
        }
      });
      
      onSave(cleanData);
    }
  };

  if (!user) return null;

  return (
    <dialog className="modal modal-open">
      <div className="modal-box max-w-2xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <div className="avatar">
            <div className="w-16 h-16 rounded-full">
              <Avatar 
                name={user.fullName || user.userName || user.email} 
                size={64} 
                round={true} 
              />
            </div>
          </div>
          <div>
            <h3 className="font-bold text-xl">Chỉnh sửa User</h3>
            <p className="text-sm opacity-70">@{user.userName}</p>
          </div>
        </div>

        {/* Info Alert */}
        <div className="alert alert-info mb-4">
          <AlertCircle size={20} />
          <div className="text-sm">
            <strong>Lưu ý:</strong> Email, Password, và Role không thể thay đổi ở đây.
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* FullName - EDITABLE */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">
                  <User size={16} className="inline mr-1" />
                  Tên đầy đủ <span className="text-error">*</span>
                </span>
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className={`input input-bordered w-full ${errors.fullName ? 'input-error' : ''}`}
                placeholder="Nguyễn Văn A"
              />
              {errors.fullName && (
                <label className="label">
                  <span className="label-text-alt text-error">{errors.fullName}</span>
                </label>
              )}
            </div>

            {/* Phone - EDITABLE */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">
                  <Phone size={16} className="inline mr-1" />
                  Số điện thoại <span className="text-error">*</span>
                </span>
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className={`input input-bordered w-full ${errors.phone ? 'input-error' : ''}`}
                placeholder="0901234567"
              />
              {errors.phone && (
                <label className="label">
                  <span className="label-text-alt text-error">{errors.phone}</span>
                </label>
              )}
            </div>

            {/* Address - EDITABLE */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">
                  <MapPin size={16} className="inline mr-1" />
                  Địa chỉ
                </span>
              </label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                className={`textarea textarea-bordered w-full ${errors.address ? 'textarea-error' : ''}`}
                placeholder="123 Đường ABC, Quận 1, TP.HCM"
                rows="2"
              />
              {errors.address && (
                <label className="label">
                  <span className="label-text-alt text-error">{errors.address}</span>
                </label>
              )}
            </div>

            {/* MembershipType - EDITABLE */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">
                  <Award size={16} className="inline mr-1" />
                  Membership
                </span>
              </label>
              <select
                name="membershipType"
                value={formData.membershipType}
                onChange={handleChange}
                className="select select-bordered w-full"
              >
                <option value="">Chưa có</option>
                <option value="Basic">Basic</option>
                <option value="Premium">Premium</option>
                <option value="VIP">VIP</option>
              </select>
            </div>

            {/* Role - EDITABLE (Admin can change Manager/Customer roles) */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">
                  Quyền <span className="text-error">*</span>
                </span>
              </label>
              <select
                name="roleId"
                value={formData.roleId}
                onChange={handleChange}
                className="select select-bordered w-full"
              >
                <option value={2}>Manager</option>
                <option value={3}>Customer</option>
              </select>
              <label className="label">
                <span className="label-text-alt text-base-content/60">
                  Admin có thể thay đổi quyền giữa Manager và Customer
                </span>
              </label>
            </div>

            <div className="divider">Thông tin chỉ được xem</div>

            {/* Email - READ ONLY */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">
                  <Mail size={16} className="inline mr-1" />
                  Email
                </span>
              </label>
              <input
                type="email"
                value={user.email}
                disabled
                className="input input-bordered input-disabled w-full bg-base-200"
              />
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
            <button 
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  Đang lưu...
                </>
              ) : (
                "Lưu thay đổi"
              )}
            </button>
          </div>
        </form>
      </div>
      
      <form method="dialog" className="modal-backdrop">
        <button onClick={onClose} disabled={loading}>close</button>
      </form>
    </dialog>
  );
};

export default EditUserModal;
