// import React, { useState } from "react";
// import { X, Eye, EyeOff, Lock, Key } from "lucide-react";
// import toast from "react-hot-toast";

// const ChangePasswordModal = ({ user, onClose, onSave, loading }) => {
//   const [formData, setFormData] = useState({
//     currentPassword: "",
//     newPassword: "",
//     confirmNewPassword: ""
//   });
  
//   const [showCurrentPassword, setShowCurrentPassword] = useState(false);
//   const [showNewPassword, setShowNewPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const [errors, setErrors] = useState({});

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
    
//     // Clear specific error when user starts typing
//     if (errors[name]) {
//       setErrors(prev => ({
//         ...prev,
//         [name]: ""
//       }));
//     }
//   };

//   const validateForm = () => {
//     const newErrors = {};

//     if (!formData.currentPassword.trim()) {
//       newErrors.currentPassword = "Vui lòng nhập mật khẩu hiện tại";
//     }

//     if (!formData.newPassword.trim()) {
//       newErrors.newPassword = "Vui lòng nhập mật khẩu mới";
//     } else if (formData.newPassword.length < 6) {
//       newErrors.newPassword = "Mật khẩu mới phải có ít nhất 6 ký tự";
//     }

//     if (!formData.confirmNewPassword.trim()) {
//       newErrors.confirmNewPassword = "Vui lòng xác nhận mật khẩu mới";
//     } else if (formData.newPassword !== formData.confirmNewPassword) {
//       newErrors.confirmNewPassword = "Xác nhận mật khẩu không khớp";
//     }

//     if (formData.currentPassword === formData.newPassword) {
//       newErrors.newPassword = "Mật khẩu mới không được giống mật khẩu hiện tại";
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     if (!validateForm()) {
//       return;
//     }

//     try {
//       await onSave(formData);
//     } catch (error) {
//       toast.error("Có lỗi xảy ra khi đổi mật khẩu!");
//     }
//   };

//   const handleClose = () => {
//     setFormData({
//       currentPassword: "",
//       newPassword: "",
//       confirmNewPassword: ""
//     });
//     setErrors({});
//     onClose();
//   };

//   const togglePasswordVisibility = (field) => {
//     switch(field) {
//       case 'current':
//         setShowCurrentPassword(!showCurrentPassword);
//         break;
//       case 'new':
//         setShowNewPassword(!showNewPassword);
//         break;
//       case 'confirm':
//         setShowConfirmPassword(!showConfirmPassword);
//         break;
//     }
//   };

//   return (
//     <dialog className="modal modal-open">
//       <div className="modal-box max-w-md">
//         {/* Header */}
//         <div className="flex items-center justify-between mb-6">
//           <div className="flex items-center gap-3">
//             <div className="p-2 bg-warning/20 rounded-lg">
//               <Key className="text-warning" size={20} />
//             </div>
//             <div>
//               <h3 className="font-bold text-lg">Đổi Mật Khẩu</h3>
//               <p className="text-sm text-base-content/60">{user?.fullName || user?.userName}</p>
//             </div>
//           </div>
//           <button 
//             className="btn btn-ghost btn-sm btn-circle" 
//             onClick={handleClose}
//             disabled={loading}
//           >
//             <X size={18} />
//           </button>
//         </div>

//         {/* Form */}
//         <form onSubmit={handleSubmit} className="space-y-4">
//           {/* Current Password */}
//           <div className="form-control">
//             <label className="label">
//               <span className="label-text font-medium">
//                 <Lock size={16} className="inline mr-2" />
//                 Mật khẩu hiện tại *
//               </span>
//             </label>
//             <div className="relative">
//               <input
//                 type={showCurrentPassword ? "text" : "password"}
//                 name="currentPassword"
//                 value={formData.currentPassword}
//                 onChange={handleChange}
//                 className={`input input-bordered w-full pr-12 ${
//                   errors.currentPassword ? "input-error" : ""
//                 }`}
//                 placeholder="Nhập mật khẩu hiện tại"
//                 disabled={loading}
//               />
//               <button
//                 type="button"
//                 className="absolute right-3 top-1/2 transform -translate-y-1/2"
//                 onClick={() => togglePasswordVisibility('current')}
//                 disabled={loading}
//               >
//                 {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
//               </button>
//             </div>
//             {errors.currentPassword && (
//               <label className="label">
//                 <span className="label-text-alt text-error">{errors.currentPassword}</span>
//               </label>
//             )}
//           </div>

//           {/* New Password */}
//           <div className="form-control">
//             <label className="label">
//               <span className="label-text font-medium">
//                 <Key size={16} className="inline mr-2" />
//                 Mật khẩu mới *
//               </span>
//             </label>
//             <div className="relative">
//               <input
//                 type={showNewPassword ? "text" : "password"}
//                 name="newPassword"
//                 value={formData.newPassword}
//                 onChange={handleChange}
//                 className={`input input-bordered w-full pr-12 ${
//                   errors.newPassword ? "input-error" : ""
//                 }`}
//                 placeholder="Nhập mật khẩu mới (ít nhất 6 ký tự)"
//                 disabled={loading}
//               />
//               <button
//                 type="button"
//                 className="absolute right-3 top-1/2 transform -translate-y-1/2"
//                 onClick={() => togglePasswordVisibility('new')}
//                 disabled={loading}
//               >
//                 {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
//               </button>
//             </div>
//             {errors.newPassword && (
//               <label className="label">
//                 <span className="label-text-alt text-error">{errors.newPassword}</span>
//               </label>
//             )}
//           </div>

//           {/* Confirm New Password */}
//           <div className="form-control">
//             <label className="label">
//               <span className="label-text font-medium">
//                 <Key size={16} className="inline mr-2" />
//                 Xác nhận mật khẩu mới *
//               </span>
//             </label>
//             <div className="relative">
//               <input
//                 type={showConfirmPassword ? "text" : "password"}
//                 name="confirmNewPassword"
//                 value={formData.confirmNewPassword}
//                 onChange={handleChange}
//                 className={`input input-bordered w-full pr-12 ${
//                   errors.confirmNewPassword ? "input-error" : ""
//                 }`}
//                 placeholder="Nhập lại mật khẩu mới"
//                 disabled={loading}
//               />
//               <button
//                 type="button"
//                 className="absolute right-3 top-1/2 transform -translate-y-1/2"
//                 onClick={() => togglePasswordVisibility('confirm')}
//                 disabled={loading}
//               >
//                 {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
//               </button>
//             </div>
//             {errors.confirmNewPassword && (
//               <label className="label">
//                 <span className="label-text-alt text-error">{errors.confirmNewPassword}</span>
//               </label>
//             )}
//           </div>

//           {/* Security Notice */}
//           <div className="alert alert-info">
//             <div className="text-sm">
//               <strong>Lưu ý bảo mật:</strong>
//               <ul className="list-disc list-inside mt-1 space-y-1">
//                 <li>Mật khẩu mới phải có ít nhất 6 ký tự</li>
//                 <li>Nên sử dụng kết hợp chữ, số và ký tự đặc biệt</li>
//                 <li>Không chia sẻ mật khẩu với người khác</li>
//               </ul>
//             </div>
//           </div>

//           {/* Actions */}
//           <div className="modal-action">
//             <button 
//               type="button" 
//               className="btn btn-ghost" 
//               onClick={handleClose}
//               disabled={loading}
//             >
//               Hủy
//             </button>
//             <button 
//               type="submit" 
//               className="btn btn-warning"
//               disabled={loading}
//             >
//               {loading ? (
//                 <>
//                   <span className="loading loading-spinner loading-sm"></span>
//                   Đang xử lý...
//                 </>
//               ) : (
//                 <>
//                   <Key size={16} />
//                   Đổi Mật Khẩu
//                 </>
//               )}
//             </button>
//           </div>
//         </form>
//       </div>
      
//       {/* Backdrop */}
//       <form method="dialog" className="modal-backdrop">
//         <button onClick={handleClose} disabled={loading}>close</button>
//       </form>
//     </dialog>
//   );
// };

// export default ChangePasswordModal;