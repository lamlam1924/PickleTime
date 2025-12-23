import React from "react";
import { format, isValid, parseISO } from 'date-fns';
import {
  User,
  Mail,
  Calendar,
  CheckCircle,
  XCircle,
  RefreshCw,
} from "lucide-react";
import {vi} from "date-fns/locale";

const safeFormatDate = (dateInput) => {
  if (!dateInput) return 'Không có dữ liệu';
  let date;
  try {
    date = typeof dateInput === 'string' ? parseISO(dateInput) : new Date(dateInput);
    return isValid(date)
        ? format(date, 'dd/MM/yyyy', { locale: vi }) // ← SỬA DÒNG NÀY
        : 'Ngày không hợp lệ';
  } catch {
    return 'Ngày không hợp lệ';
  }
};

const OwnerRequestCard = ({
  request,
  onAccept,
  onReject,
  onReconsider,
  isProcessing,
  isRejected,
}) => {
  
  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title flex items-center">
          <User size={20} className="mr-2" />
          {request.fullName}
        </h2>
        <p className="flex items-center text-sm text-gray-600">
          <Mail size={16} className="mr-2" />
          {request.email}
        </p>
        <p className="flex items-center text-sm text-gray-600">
          <Calendar size={16} className="mr-2" />
          {safeFormatDate(request.submittedAt)}
        </p>
        <div className="card-actions justify-end mt-4">
          {isRejected ? (
            <button
              onClick={() => onReconsider(request.requestId)}
              className="btn btn-sm btn-primary relative"
              disabled={isProcessing}
            >
              <RefreshCw size={16} className="mr-1" />
              {isProcessing ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : (
                "Xem xét lại"
              )}
            </button>
          ) : (
            <>
              <button
                onClick={() => onAccept(request.requestId)}
                className="btn btn-sm btn-success relative text-base-200"
                disabled={isProcessing}
              >
                <CheckCircle size={16} className="mr-1" />
                {isProcessing ? (
                  <span className="loading loading-spinner loading-sm"></span>
                ) : (
                  "Chấp thuận"
                )}
              </button>
              <button
                onClick={() => onReject(request.requestId)}
                className="btn btn-sm btn-error relative text-base-200"
                disabled={isProcessing}
              >
                <XCircle size={16} className="mr-1" />
                {isProcessing ? (
                  <span className="loading loading-spinner loading-sm"></span>
                ) : (
                  "Từ chối"
                )}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
export default OwnerRequestCard;
