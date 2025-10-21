import React, { useState } from 'react';
import { X, AlertTriangle, Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '@redux/slices/authSlice';

const DeactivateAccountModal = ({ isGoogleLogin, onClose, onConfirm }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [errors, setErrors] = useState({});
  const [deactivating, setDeactivating] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (!confirmed) {
      newErrors.confirmed = 'Bạn phải xác nhận để tiếp tục';
    }

    if (!isGoogleLogin && !password) {
      newErrors.password = 'Vui lòng nhập mật khẩu để xác nhận';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setDeactivating(true);
    try {
      const result = await onConfirm(password);
      if (result.success) {
        // Logout and redirect
        dispatch(logout());
        navigate('/login');
      } else if (result.error) {
        setErrors({ password: result.error });
      }
    } catch (error) {
      console.error('Deactivate error:', error);
      setErrors({ password: 'Mật khẩu không đúng hoặc có lỗi xảy ra' });
    } finally {
      setDeactivating(false);
    }
  };

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-lg">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-2xl text-error flex items-center gap-2">
            <AlertTriangle size={24} />
            Vô hiệu hóa tài khoản
          </h3>
          <button 
            className="btn btn-sm btn-circle btn-ghost"
            onClick={onClose}
            disabled={deactivating}
          >
            <X size={20} />
          </button>
        </div>

        <div className="divider"></div>

        {/* Warning Alert */}
        <div className="alert alert-error mb-6">
          <AlertTriangle size={24} />
          <div className="flex flex-col items-start">
            <span className="font-bold">Cảnh báo: Hành động này không thể hoàn tác!</span>
            <span className="text-sm mt-1">
              Tài khoản của bạn sẽ bị vô hiệu hóa và bạn sẽ không thể đăng nhập hoặc sử dụng dịch vụ nữa.
            </span>
          </div>
        </div>

        {/* Consequences List */}
        <div className="bg-base-200 rounded-lg p-4 mb-6">
          <p className="font-semibold mb-2">Sau khi vô hiệu hóa, bạn sẽ:</p>
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li>Mất quyền truy cập vào tất cả các dịch vụ</li>
            <li>Không thể đặt sân hoặc xem lịch sử đặt sân</li>
            <li>Không thể đánh giá hoặc xem đánh giá</li>
            <li>Mất tất cả dữ liệu cá nhân và lịch sử giao dịch</li>
            <li>Phải liên hệ quản trị viên để khôi phục tài khoản</li>
          </ul>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* Confirmation Checkbox */}
            <div className="form-control">
              <label className="label cursor-pointer justify-start gap-3">
                <input
                  type="checkbox"
                  checked={confirmed}
                  onChange={(e) => {
                    setConfirmed(e.target.checked);
                    if (errors.confirmed) {
                      setErrors(prev => ({ ...prev, confirmed: undefined }));
                    }
                  }}
                  className={`checkbox ${errors.confirmed ? 'checkbox-error' : 'checkbox-error'}`}
                />
                <span className="label-text font-semibold">
                  Tôi hiểu và muốn vô hiệu hóa tài khoản của mình
                </span>
              </label>
              {errors.confirmed && (
                <label className="label">
                  <span className="label-text-alt text-error">{errors.confirmed}</span>
                </label>
              )}
            </div>

            {/* Password Confirmation (not for Google users) */}
            {!isGoogleLogin && (
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Nhập mật khẩu để xác nhận *</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (errors.password) {
                        setErrors(prev => ({ ...prev, password: undefined }));
                      }
                    }}
                    className={`input input-bordered w-full pr-10 ${errors.password ? 'input-error' : ''}`}
                    placeholder="Nhập mật khẩu của bạn"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 btn btn-ghost btn-sm btn-circle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.password && (
                  <label className="label">
                    <span className="label-text-alt text-error">{errors.password}</span>
                  </label>
                )}
              </div>
            )}

            {/* Google Account Info */}
            {isGoogleLogin && (
              <div className="alert alert-info">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span className="text-sm">
                  Tài khoản Google không yêu cầu xác nhận mật khẩu.
                </span>
              </div>
            )}
          </div>

          <div className="divider"></div>

          {/* Actions */}
          <div className="modal-action">
            <button
              type="button"
              className="btn btn-ghost"
              onClick={onClose}
              disabled={deactivating}
            >
              Hủy
            </button>
            <button
              type="submit"
              className="btn btn-error"
              disabled={deactivating || !confirmed}
            >
              {deactivating ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  Đang xử lý...
                </>
              ) : (
                <>
                  <AlertTriangle size={18} />
                  Vô hiệu hóa tài khoản
                </>
              )}
            </button>
          </div>
        </form>
      </div>
      <div className="modal-backdrop" onClick={onClose}></div>
    </div>
  );
};

export default DeactivateAccountModal;
