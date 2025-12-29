import { useState } from "react";
import { format, addDays, startOfWeek, isSameDay, isToday, isBefore, startOfDay } from "date-fns";
import { vi } from "date-fns/locale";
import { Calendar, ChevronLeft, ChevronRight, Sun, Clock } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const DateSelection = ({ selectedDate, handleDateChange }) => {
  const [showCalendar, setShowCalendar] = useState(false);

  // Generate next 7 days for quick selection
  const getNext7Days = () => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      days.push(addDays(new Date(), i));
    }
    return days;
  };

  const quickDays = getNext7Days();

  const getDayLabel = (date) => {
    if (isToday(date)) return "Hôm nay";
    if (isSameDay(date, addDays(new Date(), 1))) return "Ngày mai";
    return format(date, "EEEE", { locale: vi });
  };

  const getPopularTimes = () => {
    return [
      { label: "Sáng sớm", icon: "🌅", time: "6:00 - 9:00" },
      { label: "Trưa", icon: "☀️", time: "12:00 - 14:00" },
      { label: "Chiều", icon: "🌤️", time: "15:00 - 18:00" },
      { label: "Tối", icon: "🌙", time: "18:00 - 21:00" },
    ];
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-2 flex items-center justify-center gap-3 text-primary">
          <Calendar className="w-8 h-8" />
          Chọn Ngày Đặt Sân
        </h2>
        <p className="text-base-content font-medium">
          Chọn ngày bạn muốn chơi pickleball
        </p>
      </div>

      {/* Quick Date Selection - Cards */}
      <div className="space-y-3">
        <h3 className="font-bold text-lg flex items-center gap-2 text-warning">
          <Sun className="w-5 h-5" />
          Chọn Nhanh
        </h3>
        
        <div className="grid grid-cols-7 gap-2">
          {quickDays.map((day, index) => {
            const isSelected = selectedDate && isSameDay(day, selectedDate);
            const isPast = isBefore(startOfDay(day), startOfDay(new Date())) && !isToday(day);
            
            return (
              <button
                key={index}
                onClick={() => !isPast && handleDateChange(day)}
                disabled={isPast}
                className={`
                  relative flex flex-col items-center p-3 rounded-xl transition-all duration-300
                  ${
                    isSelected
                      ? "bg-primary text-primary-content shadow-lg scale-105 ring-4 ring-primary/30"
                      : isPast
                      ? "bg-base-300 text-base-content/30 cursor-not-allowed"
                      : "bg-base-200 hover:bg-base-300 hover:scale-105 hover:shadow-md"
                  }
                `}
              >
                {/* Today Badge */}
                {isToday(day) && !isSelected && (
                  <span className="absolute -top-2 -right-2 badge badge-warning badge-xs">
                    Hôm nay
                  </span>
                )}
                
                {/* Day Name */}
                <span className={`text-xs font-medium mb-1 ${isSelected ? 'text-primary-content' : 'text-base-content/70'}`}>
                  {format(day, "EEE", { locale: vi })}
                </span>
                
                {/* Day Number */}
                <span className={`text-2xl font-bold ${isSelected ? 'text-primary-content' : ''}`}>
                  {format(day, "dd")}
                </span>
                
                {/* Month */}
                <span className={`text-xs ${isSelected ? 'text-primary-content/80' : 'text-base-content/60'}`}>
                  Tháng {format(day, "M")}
                </span>

                {/* Selection Indicator */}
                {isSelected && (
                  <div className="absolute inset-0 rounded-xl border-2 border-primary-content animate-pulse"></div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Full Calendar Toggle */}
      <div className="divider">HOẶC</div>

      <div className="space-y-3">
        <button
          onClick={() => setShowCalendar(!showCalendar)}
          className="btn btn-outline btn-block gap-2"
        >
          <Calendar className="w-5 h-5" />
          {showCalendar ? "Ẩn lịch đầy đủ" : "Mở lịch đầy đủ"}
        </button>

        {showCalendar && (
          <div className="flex justify-center p-6 bg-base-200 rounded-xl animate-slide-down">
            <DatePicker
              selected={selectedDate}
              onChange={handleDateChange}
              inline
              minDate={new Date()}
              dateFormat="dd/MM/yyyy"
              locale={vi}
              className="shadow-xl"
            />
          </div>
        )}
      </div>

      {/* Selected Date Display */}
      {selectedDate && (
        <div className="card bg-gradient-to-r from-primary/20 to-secondary/20 shadow-lg animate-slide-up">
          <div className="card-body p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-base-content/70 mb-1">Ngày đã chọn:</p>
                <p className="text-2xl font-bold">
                  {getDayLabel(selectedDate)}, {format(selectedDate, "dd/MM/yyyy")}
                </p>
              </div>
              {/* <div className="text-5xl">📅</div> */}
            </div>
          </div>
        </div>
      )}

      {/* Popular Time Suggestions */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-info" />
          <h3 className="font-semibold text-lg">Khung Giờ Phổ Biến</h3>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {getPopularTimes().map((slot, index) => (
            <div
              key={index}
              className="card bg-base-200 hover:bg-base-300 transition-all duration-300 hover:scale-105 cursor-pointer"
            >
              <div className="card-body p-4 text-center">
                <div className="text-3xl mb-2">{slot.icon}</div>
                <p className="font-semibold">{slot.label}</p>
                <p className="text-xs text-base-content/60">{slot.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DateSelection;
