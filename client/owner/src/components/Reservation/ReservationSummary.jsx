import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { getEndTime } from "../../utils/dateUtils";
import { 
  Calendar, 
  Clock, 
  Timer, 
  DollarSign, 
  MapPin, 
  CheckCircle,
  AlertCircle,
  CreditCard,
  Home,
  CloudSun
} from "lucide-react";

const ReservationSummary = ({
  selectedDate,
  selectedStartTime,
  duration,
  pricePerHour,
  selectedCourt,
}) => {
  const totalPrice = pricePerHour * duration;
  const depositAmount = totalPrice * 0.20; // 20% đặt cọc
  const remainingAmount = totalPrice - depositAmount;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-2 flex items-center justify-center gap-3">
          <CheckCircle className="w-8 h-8 text-success" />
          Xác Nhận Đặt Sân
        </h2>
        <p className="text-base-content/60">
          Kiểm tra lại thông tin trước khi xác nhận
        </p>
      </div>

      {/* Main Summary Card */}
      <div className="card bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 shadow-2xl">
        <div className="card-body p-8">
          {/* Booking Details */}
          <div className="space-y-6">
            {/* Court Info - NEW */}
            {selectedCourt && (
              <div className="flex items-start gap-4 p-4 bg-base-100 rounded-lg hover:shadow-md transition-shadow border-2 border-success/30">
                <div className="p-3 bg-success/10 rounded-lg">
                  {selectedCourt.isIndoor || selectedCourt.type === 'Indoor' ? (
                    <Home className="w-6 h-6 text-info" />
                  ) : (
                    <CloudSun className="w-6 h-6 text-warning" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm text-base-content/70 mb-1">Sân đã chọn</p>
                  <p className="text-xl font-bold text-success">
                    {selectedCourt.courtName}
                  </p>
                  <p className="text-sm text-base-content/60 mt-1">
                    {selectedCourt.isIndoor || selectedCourt.type === 'Indoor' ? '🏠 Sân trong nhà' : '☀️ Sân ngoài trời'}
                  </p>
                </div>
                {/* <div className="text-4xl">🎾</div> */}
              </div>
            )}

            {/* Date */}
            <div className="flex items-start gap-4 p-4 bg-base-100 rounded-lg hover:shadow-md transition-shadow">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Calendar className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-base-content/70 mb-1">Ngày đặt sân</p>
                <p className="text-xl font-bold">
                  {format(new Date(selectedDate), "EEEE, dd MMMM yyyy", { locale: vi })}
                </p>
                <p className="text-sm text-base-content/60 mt-1">
                  {format(new Date(selectedDate), "dd/MM/yyyy")}
                </p>
              </div>
              {/* <div className="text-4xl">📅</div> */}
            </div>

            {/* Time */}
            <div className="flex items-start gap-4 p-4 bg-base-100 rounded-lg hover:shadow-md transition-shadow">
              <div className="p-3 bg-secondary/10 rounded-lg">
                <Clock className="w-6 h-6 text-secondary" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-base-content/70 mb-1">Thời gian</p>
                <p className="text-xl font-bold">
                  {selectedStartTime} - {getEndTime(selectedStartTime, duration)}
                </p>
                <p className="text-sm text-base-content/60 mt-1">
                  Khung giờ: {selectedStartTime}
                </p>
              </div>
              {/* <div className="text-4xl">⏰</div> */}
            </div>

            {/* Duration */}
            <div className="flex items-start gap-4 p-4 bg-base-100 rounded-lg hover:shadow-md transition-shadow">
              <div className="p-3 bg-accent/10 rounded-lg">
                <Timer className="w-6 h-6 text-accent" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-base-content/70 mb-1">Thời lượng</p>
                <p className="text-xl font-bold">
                  {duration} giờ ({duration * 60} phút)
                </p>
                <p className="text-sm text-base-content/60 mt-1">
                  Kết thúc: {getEndTime(selectedStartTime, duration)}
                </p>
              </div>
              {/* <div className="text-4xl">⏱️</div> */}
            </div>
          </div>

          <div className="divider my-6"></div>

          {/* Price Breakdown */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              Chi Tiết Thanh Toán
            </h3>

            <div className="space-y-3">
              {/* Base Price */}
              <div className="flex justify-between items-center p-3 bg-base-100 rounded-lg">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-base-content/60" />
                  <span className="text-base-content/80">
                    Giá sân ({duration} giờ × {pricePerHour.toLocaleString()} VNĐ)
                  </span>
                </div>
                <span className="font-semibold">
                  {totalPrice.toLocaleString()} VNĐ
                </span>
              </div>

              {/* Deposit Amount */}
              <div className="flex justify-between items-center p-3 bg-warning/10 rounded-lg border-2 border-warning/30">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-warning" />
                  <span className="text-base-content/80 font-semibold">
                    Đặt cọc (20%)
                  </span>
                </div>
                <span className="font-bold text-warning text-lg">
                  {depositAmount.toLocaleString()} VNĐ
                </span>
              </div>

              {/* Remaining Amount */}
              <div className="flex justify-between items-center p-3 bg-base-100 rounded-lg">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-base-content/60" />
                  <span className="text-base-content/80">
                    Còn lại (thanh toán tại sân)
                  </span>
                </div>
                <span className="font-semibold">
                  {remainingAmount.toLocaleString()} VNĐ
                </span>
              </div>

              <div className="divider my-2"></div>

              {/* Total */}
              <div className="flex justify-between items-center p-4 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-lg">
                <span className="text-lg font-bold">Tổng tiền sân</span>
                <span className="text-3xl font-bold text-primary">
                  {totalPrice.toLocaleString()} VNĐ
                </span>
              </div>
              
              {/* Payment Summary */}
              <div className="mt-4 p-4 bg-success/10 rounded-lg border border-success/30">
                <div className="text-sm space-y-2">
                  <div className="flex justify-between">
                    <span className="text-base-content/70">Đặt cọc ngay:</span>
                    <span className="font-bold text-success">{depositAmount.toLocaleString()} VNĐ</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-base-content/70">Thanh toán khi đến:</span>
                    <span className="font-semibold">{remainingAmount.toLocaleString()} VNĐ</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Important Info */}
      <div className="card bg-warning/10 border-2 border-warning">
        <div className="card-body p-6">
          <h3 className="font-bold text-lg flex items-center gap-2 text-warning mb-3">
            <AlertCircle className="w-5 h-5" />
            Lưu Ý Quan Trọng
          </h3>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-warning mt-1">•</span>
              <span>
                <strong>Bạn có 15 phút</strong> để hoàn tất thanh toán đặt cọc. Hết giờ sân sẽ được giải phóng.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-warning mt-1">•</span>
              <span>
                <strong>Đặt cọc 20%</strong> ({depositAmount.toLocaleString()} VNĐ) bằng chuyển khoản ngay bây giờ.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-warning mt-1">•</span>
              <span>
                <strong>80% còn lại</strong> ({remainingAmount.toLocaleString()} VNĐ) thanh toán khi đến sân.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-warning mt-1">•</span>
              <span>Chuyển khoản thành công → Xác nhận đặt lịch qua Email</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-warning mt-1">•</span>
              <span>Vui lòng đến sớm <strong>10 phút</strong> trước giờ đặt</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-warning mt-1">•</span>
              <span>Có thể <strong>hủy lịch hoàn cọc</strong> trước 24 giờ</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Final CTA Message */}
      <div className="text-center p-6 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg">
        <p className="text-lg font-semibold mb-2">
          🎉 Sẵn sàng để chơi Pickleball?
        </p>
        <p className="text-base-content/70">
          <strong>"Thanh toán đặt cọc"</strong> bên dưới để hoàn tất đặt chỗ
        </p>
      </div>
    </div>
  );
};

export default ReservationSummary;
