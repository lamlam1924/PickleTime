import { useState } from "react";
import { Calendar, Clock, Timer, CreditCard, CheckCircle, ChevronRight, MapPin } from "lucide-react";
import DateSelection from "./DateSelection";
import TimeSelection from "./TimeSelection";
import DurationSelection from "./DurationSelection";
import CourtSelection from "./CourtSelection";
import ReservationSummary from "./ReservationSummary";
import { BookingHoldTimer, createHoldExpiry } from "./BookingHoldTimer";
import useReservation from "../../hooks/useReservation";
import ReservationSkeleton from "../ui/ReservationSkeleton";
import "./Reservation.css";

const Reservation = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [bookingHoldExpiry, setBookingHoldExpiry] = useState(null);
  
  const {
    selectedDate,
    selectedStartTime,
    duration,
    availableTimes,
    timeSlots,
    pricePerHour,
    handleDateChange,
    handleTimeSelection,
    handleDurationChange,
    isTimeSlotBooked,
    isDurationAvailable,
    confirmReservation,
    loading,
    availableCourts,
    selectedCourt,
    setSelectedCourt,
  } = useReservation();

  if (loading) return <ReservationSkeleton />;

  const steps = [
    { id: 1, name: "Chọn Ngày", icon: Calendar, completed: selectedDate !== null },
    { id: 2, name: "Chọn Giờ", icon: Clock, completed: selectedStartTime !== null },
    { id: 3, name: "Thời Lượng", icon: Timer, completed: duration > 0 },
    { id: 4, name: "Chọn Sân", icon: MapPin, completed: selectedCourt !== null },
    { id: 5, name: "Xác Nhận", icon: CreditCard, completed: false },
  ];

  const handleNext = () => {
    if (currentStep < 5) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      
      // Bắt đầu timer 15 phút khi chuyển sang step 5 (đã chọn xong sân)
      if (nextStep === 5) {
        setBookingHoldExpiry(createHoldExpiry());
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      // Hủy booking hold nếu quay lại từ step 5
      if (currentStep === 5) {
        setBookingHoldExpiry(null);
      }
      setCurrentStep(currentStep - 1);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return selectedDate !== null;
      case 2:
        return selectedStartTime !== null;
      case 3:
        return duration > 0 && isDurationAvailable(selectedStartTime, duration);
      case 4:
        return selectedCourt !== null;
      case 5:
        return true;
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-200 to-base-300 py-8 px-4">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-2">
            🎾 Đặt Sân Pickleball
          </h1>
          <p className="text-base-content text-lg font-medium">
            Đặt sân chỉ trong vài bước đơn giản
          </p>
        </div>

        {/* 2-Column Layout: Main Content + Sticky Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content - Left Side (2/3 width) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Progress Stepper */}
            <div className="card bg-base-100 shadow-2xl overflow-hidden">
              <div className="card-body p-4 md:p-6">
                <div className="flex items-center justify-between">
                  {steps.map((step, index) => (
                    <div key={step.id} className="flex items-center flex-1">
                      <div className="flex flex-col items-center w-full">
                        {/* Step Circle */}
                        <div
                          className={`
                            relative flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-full transition-all duration-300 
                            ${
                              currentStep === step.id
                                ? "bg-primary text-primary-content scale-110 shadow-lg"
                                : step.completed
                                ? "bg-success text-success-content"
                                : "bg-base-300 text-base-content/40"
                            }
                          `}
                        >
                          {step.completed ? (
                            <CheckCircle className="w-6 h-6 md:w-7 md:h-7" />
                          ) : (
                            <step.icon className="w-5 h-5 md:w-6 md:h-6" />
                          )}
                          
                          {/* Pulse animation for current step */}
                          {currentStep === step.id && (
                            <span className="absolute inset-0 rounded-full animate-ping bg-primary opacity-30"></span>
                          )}
                        </div>

                        {/* Step Label */}
                        <span
                          className={`
                            mt-2 text-xs md:text-sm font-medium text-center transition-colors duration-300
                            ${
                              currentStep === step.id
                                ? "text-primary font-bold"
                                : step.completed
                                ? "text-success"
                                : "text-base-content/50"
                            }
                          `}
                        >
                          {step.name}
                        </span>
                      </div>

                      {/* Connector Line */}
                      {index < steps.length - 1 && (
                        <div className="flex-1 h-1 mx-2 md:mx-3">
                          <div
                            className={`
                              h-full rounded-full transition-all duration-500
                              ${
                                step.completed
                                  ? "bg-success"
                                  : "bg-base-300"
                              }
                            `}
                          ></div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Main Content Card */}
            <div className="card bg-base-100 shadow-2xl">
              <div className="card-body p-6">
                {/* Step Content */}
                <div className="min-h-[500px]">
                  {currentStep === 1 && (
                    <DateSelection
                      selectedDate={selectedDate}
                      handleDateChange={handleDateChange}
                    />
                  )}
                  
                  {currentStep === 2 && (
                    <TimeSelection
                      availableTimes={availableTimes}
                      selectedStartTime={selectedStartTime}
                      handleTimeSelection={handleTimeSelection}
                      isTimeSlotBooked={isTimeSlotBooked}
                      timeSlots={timeSlots}
                      duration={duration}
                    />
                  )}
                  
                  {currentStep === 3 && (
                    <DurationSelection
                      selectedStartTime={selectedStartTime}
                      duration={duration}
                      handleDurationChange={handleDurationChange}
                      isDurationAvailable={isDurationAvailable}
                    />
                  )}
                  
                  {currentStep === 4 && (
                    <CourtSelection
                      availableCourts={availableCourts}
                      selectedCourt={selectedCourt}
                      onCourtSelect={setSelectedCourt}
                    />
                  )}
                  
                  {currentStep === 5 && (
                    <>
                      <ReservationSummary
                        selectedDate={selectedDate}
                        selectedStartTime={selectedStartTime}
                        duration={duration}
                        pricePerHour={pricePerHour}
                        selectedCourt={selectedCourt}
                      />
                      
                      {/* Booking Hold Timer - Đếm ngược 15 phút để thanh toán */}
                      {bookingHoldExpiry && (
                        <div className="mt-6">
                          <BookingHoldTimer
                            expiresAt={bookingHoldExpiry}
                            onExpire={() => {
                              alert('Thời gian giữ chỗ đã hết! Vui lòng đặt lại.');
                              setBookingHoldExpiry(null);
                              setCurrentStep(1);
                            }}
                            onExtend={() => {
                              const newExpiry = createHoldExpiry();
                              setBookingHoldExpiry(newExpiry);
                            }}
                          />
                        </div>
                      )}
                    </>
                  )}
                </div>

                {/* Navigation Buttons */}
                <div className="flex justify-between items-center mt-6 pt-6 border-t border-base-300">
                  <button
                    className="btn btn-outline btn-lg gap-2"
                    onClick={handlePrevious}
                    disabled={currentStep === 1}
                  >
                    ← Quay Lại
                  </button>

                  {currentStep < 5 ? (
                    <button
                      className="btn btn-primary btn-lg gap-2"
                      onClick={handleNext}
                      disabled={!canProceed()}
                    >
                      Tiếp Theo
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  ) : (
                    <button
                      className="btn btn-success btn-lg gap-2"
                      onClick={() => {
                        // TODO: Chuyển sang trang thanh toán (đặt cọc 20%)
                        alert('Chuyển sang thanh toán đặt cọc 20%...');
                        // Navigate to payment page
                      }}
                      disabled={!bookingHoldExpiry || loading}
                    >
                      {loading ? (
                        <>
                          <span className="loading loading-spinner"></span>
                          Đang xử lý...
                        </>
                      ) : (
                        <>
                          <CreditCard className="w-5 h-5" />
                          Thanh Toán Đặt Cọc
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Sticky Summary Sidebar - Right Side (1/3 width) */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-4">
              {/* Summary Card */}
              <div className="card bg-gradient-to-br from-primary/10 to-secondary/10 shadow-xl border-2 border-primary/20">
                <div className="card-body p-6">
                  <h3 className="font-bold text-xl mb-4 flex items-center gap-2 text-primary">
                    <CheckCircle className="w-6 h-6" />
                    Tóm Tắt Đặt Sân
                  </h3>
                  
                  <div className="space-y-4">
                    {/* Date */}
                    {selectedDate ? (
                      <div className="p-3 bg-base-100 rounded-lg">
                        <div className="flex items-start gap-3">
                          <Calendar className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                          <div className="flex-1">
                            <p className="text-xs text-base-content/60 mb-1">Ngày đặt</p>
                            <p className="font-bold text-base">
                              {new Date(selectedDate).toLocaleDateString("vi-VN", {
                                weekday: "long",
                                year: "numeric",
                                month: "long",
                                day: "numeric"
                              })}
                            </p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="p-3 bg-base-200 rounded-lg opacity-50">
                        <div className="flex items-center gap-3">
                          <Calendar className="w-5 h-5" />
                          <p className="text-sm">Chưa chọn ngày</p>
                        </div>
                      </div>
                    )}

                    {/* Time */}
                    {selectedStartTime ? (
                      <div className="p-3 bg-base-100 rounded-lg">
                        <div className="flex items-start gap-3">
                          <Clock className="w-5 h-5 text-secondary flex-shrink-0 mt-1" />
                          <div className="flex-1">
                            <p className="text-xs text-base-content/60 mb-1">Giờ bắt đầu</p>
                            <p className="font-bold text-lg text-secondary">{selectedStartTime}</p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="p-3 bg-base-200 rounded-lg opacity-50">
                        <div className="flex items-center gap-3">
                          <Clock className="w-5 h-5" />
                          <p className="text-sm">Chưa chọn giờ</p>
                        </div>
                      </div>
                    )}

                    {/* Duration */}
                    {duration > 0 ? (
                      <div className="p-3 bg-base-100 rounded-lg">
                        <div className="flex items-start gap-3">
                          <Timer className="w-5 h-5 text-accent flex-shrink-0 mt-1" />
                          <div className="flex-1">
                            <p className="text-xs text-base-content/60 mb-1">Thời lượng</p>
                            <p className="font-bold text-base">
                              {duration} giờ <span className="text-sm text-base-content/60">({duration * 60} phút)</span>
                            </p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="p-3 bg-base-200 rounded-lg opacity-50">
                        <div className="flex items-center gap-3">
                          <Timer className="w-5 h-5" />
                          <p className="text-sm">Chưa chọn thời lượng</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Court - NEW */}
                  <div className="mt-4">
                    {selectedCourt ? (
                      <div className="p-3 bg-base-100 rounded-lg border-2 border-success/30">
                        <div className="flex items-start gap-3">
                          <MapPin className="w-5 h-5 text-success flex-shrink-0 mt-1" />
                          <div className="flex-1">
                            <p className="text-xs text-base-content/60 mb-1">Sân đã chọn</p>
                            <p className="font-bold text-base text-success">
                              {selectedCourt.courtName}
                            </p>
                            <p className="text-xs text-base-content/60 mt-1">
                              {selectedCourt.isIndoor || selectedCourt.type === 'Indoor' ? '🏠 Trong nhà' : '☀️ Ngoài trời'}
                            </p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="p-3 bg-base-200 rounded-lg opacity-50">
                        <div className="flex items-center gap-3">
                          <MapPin className="w-5 h-5" />
                          <p className="text-sm">Chưa chọn sân</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Price Section */}
                  {pricePerHour && duration > 0 && (
                    <div className="mt-6 pt-6 border-t-2 border-primary/30">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-base-content/70">Giá sân/giờ:</span>
                          <span className="font-semibold">{pricePerHour.toLocaleString()} VNĐ</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-base-content/70">Số giờ:</span>
                          <span className="font-semibold">{duration} giờ</span>
                        </div>
                        <div className="divider my-2"></div>
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-lg">Tổng cộng:</span>
                          <span className="text-3xl font-bold text-primary">
                            {(pricePerHour * duration).toLocaleString()}
                            <span className="text-sm ml-1">VNĐ</span>
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Progress Indicator */}
                  <div className="mt-6">
                    <div className="flex justify-between text-xs text-base-content/60 mb-2">
                      <span>Tiến độ</span>
                      <span>{currentStep}/5 bước</span>
                    </div>
                    <progress 
                      className="progress progress-primary w-full" 
                      value={currentStep} 
                      max="5"
                    ></progress>
                  </div>
                </div>
              </div>

              
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reservation;
