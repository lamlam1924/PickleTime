import React, { useState, useEffect } from "react";
import { Clock, AlertTriangle } from "lucide-react";

/**
 * Booking Hold Timer - Đếm ngược 15 phút
 * Hiển thị thời gian còn lại để hoàn tất thanh toán
 */
export const BookingHoldTimer = ({ 
  expiresAt, 
  onExpire,
  onExtend,
  className = ""
}) => {
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    if (!expiresAt) return;

    const calculateTimeRemaining = () => {
      const now = new Date();
      const expiry = new Date(expiresAt);
      const diff = expiry - now;

      if (diff <= 0) {
        setIsExpired(true);
        setTimeRemaining(0);
        if (onExpire) onExpire();
        return;
      }

      setTimeRemaining(diff);
    };

    // Initial calculation
    calculateTimeRemaining();

    // Update every second
    const interval = setInterval(calculateTimeRemaining, 1000);

    return () => clearInterval(interval);
  }, [expiresAt, onExpire]);

  const formatTime = (ms) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const getProgressPercentage = () => {
    const totalDuration = 15 * 60 * 1000; // 15 minutes in milliseconds
    return (timeRemaining / totalDuration) * 100;
  };

  const getAlertStyle = () => {
    const minutes = Math.floor(timeRemaining / (60 * 1000));
    if (minutes <= 2) return "bg-red-50 border-l-4 border-red-400";
    if (minutes <= 5) return "bg-amber-50 border-l-4 border-amber-400";
    return "bg-blue-50 border-l-4 border-blue-400";
  };

  const getTextColor = () => {
    const minutes = Math.floor(timeRemaining / (60 * 1000));
    if (minutes <= 2) return "text-red-700";
    if (minutes <= 5) return "text-amber-700";
    return "text-blue-700";
  };

  if (isExpired) {
    return (
      <div className={`bg-red-50 border-l-4 border-red-400 rounded-lg p-4 ${className}`}>
        <div className="flex items-start gap-3">
          <AlertTriangle className="h-6 w-6 text-red-600 flex-shrink-0 mt-1" />
          <div className="flex-1">
            <h3 className="font-bold text-red-800">⏰ Hết thời gian giữ chỗ</h3>
            <p className="text-sm text-red-700 mt-1">
              Các khung giờ bạn chọn đã được giải phóng. Vui lòng chọn lại để tiếp tục.
            </p>
          </div>
          <button className="btn btn-sm bg-red-100 hover:bg-red-200 text-red-700 border-red-300" onClick={onExpire}>
            Đồng ý
          </button>
        </div>
      </div>
    );
  }

  if (!expiresAt) return null;

  return (
    <div className={`${getAlertStyle()} rounded-lg p-4 ${className}`}>
      <div className="flex items-start gap-3">
        <Clock className="h-6 w-6 flex-shrink-0 mt-1" style={{animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'}} />
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <h3 className={`font-bold ${getTextColor()}`}>⏱️ Hoàn tất thanh toán trong</h3>
            <span className={`text-3xl font-mono font-bold ${getTextColor()}`}>
              {formatTime(timeRemaining)}
            </span>
          </div>
          
          <progress 
            className="progress w-full h-2" 
            value={getProgressPercentage()} 
            max="100"
            style={{
              background: 'rgba(0,0,0,0.1)',
              accentColor: Math.floor(timeRemaining / (60 * 1000)) <= 2 ? '#dc2626' : 
                          Math.floor(timeRemaining / (60 * 1000)) <= 5 ? '#f59e0b' : '#3b82f6'
            }}
          />
          
          <p className={`text-xs mt-2 ${getTextColor()} opacity-75`}>
            Các khung giờ sẽ được giải phóng nếu không hoàn tất thanh toán đúng hạn
          </p>
        </div>
        
        {onExtend && timeRemaining <= 2 * 60 * 1000 && (
          <button className={`btn btn-sm border ${getTextColor()} bg-white hover:bg-gray-50`} onClick={onExtend}>
            Gia hạn
          </button>
        )}
      </div>
    </div>
  );
};

/**
 * Tạo thời gian hết hạn giữ chỗ (15 phút kể từ bây giờ)
 */
export const createHoldExpiry = () => {
  const now = new Date();
  return new Date(now.getTime() + 15 * 60 * 1000);
};

/**
 * Kiểm tra xem giữ chỗ còn hiệu lực không
 */
export const isHoldValid = (expiresAt) => {
  if (!expiresAt) return false;
  const now = new Date();
  const expiry = new Date(expiresAt);
  return expiry > now;
};
