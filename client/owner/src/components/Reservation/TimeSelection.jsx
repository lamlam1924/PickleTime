import { parse, isAfter, addHours, format } from "date-fns";
import { Clock, TrendingUp, Zap, AlertCircle } from "lucide-react";

const TimeSelection = ({
  availableTimes,
  selectedStartTime,
  handleTimeSelection,
  isTimeSlotBooked,
  timeSlots,
  duration,
}) => {
  const isTimeSlotSelected = (time) => {
    if (!selectedStartTime || !duration) return time === selectedStartTime;
    const start = parse(selectedStartTime, "hh:mm a", new Date());
    const end = addHours(start, duration);
    const current = parse(time, "hh:mm a", new Date());
    return current >= start && current < end;
  };

  const isTimeSlotDisabled = (time) => {
    const closeTime = parse(timeSlots.closeTime, "hh:mm a", new Date());
    const currentTime = parse(time, "hh:mm a", new Date());
    return isAfter(currentTime, closeTime) || isTimeSlotBooked(time);
  };

  // Group times by period
  const groupTimesByPeriod = () => {
    const groups = {
      morning: { label: "Buổi Sáng", icon: "🌅", times: [], color: "badge-warning" },
      afternoon: { label: "Buổi Chiều", icon: "☀️", times: [], color: "badge-info" },
      evening: { label: "Buổi Tối", icon: "🌙", times: [], color: "badge-primary" },
    };

    availableTimes.forEach((time) => {
      const hour = parseInt(time.split(":")[0]);
      const period = time.toLowerCase().includes("pm") ? "pm" : "am";
      
      const hour24 = period === "pm" && hour !== 12 ? hour + 12 : hour;
      
      if (hour24 < 12) {
        groups.morning.times.push(time);
      } else if (hour24 < 18) {
        groups.afternoon.times.push(time);
      } else {
        groups.evening.times.push(time);
      }
    });

    return Object.values(groups).filter(group => group.times.length > 0);
  };

  const timeGroups = groupTimesByPeriod();

  // Get popular/recommended times
  const getRecommendedTimes = () => {
    return availableTimes
      .filter(time => !isTimeSlotDisabled(time))
      .slice(0, 3);
  };

  const recommendedTimes = getRecommendedTimes();

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-2 flex items-center justify-center gap-3 text-primary">
          <Clock className="w-8 h-8" />
          Chọn Giờ Bắt Đầu
        </h2>
        <p className="text-base-content font-medium">
          Chọn thời gian bạn muốn bắt đầu chơi
        </p>
      </div>

      {/* Operating Hours Info */}
      <div className="alert alert-info shadow-lg">
        <AlertCircle className="w-5 h-5" />
        <div className="flex-1">
          <p className="font-semibold">Giờ hoạt động</p>
          <p className="text-sm">
            {timeSlots.openTime} - {timeSlots.closeTime}
          </p>
        </div>
      </div>

      {/* Recommended Times */}
      {recommendedTimes.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-semibold text-lg flex items-center gap-2 text-success">
            <TrendingUp className="w-5 h-5" />
            Khung Giờ Đề Xuất
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {recommendedTimes.map((time) => (
              <button
                key={`rec-${time}`}
                onClick={() => handleTimeSelection(time)}
                className={`
                  relative btn btn-lg gap-2 transition-all duration-300
                  ${
                    isTimeSlotSelected(time)
                      ? "btn-success text-success-content shadow-lg scale-105"
                      : "btn-outline btn-success hover:scale-105"
                  }
                `}
              >
                <Zap className="w-5 h-5" />
                <span className="font-bold">{time}</span>
                {isTimeSlotSelected(time) && (
                  <span className="absolute -top-2 -right-2 badge badge-success badge-xs">✓</span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="divider text-base-content/60">TẤT CẢ KHUNG GIỜ</div>

      {/* Time Slots Grouped by Period */}
      <div className="space-y-6">
        {timeGroups.map((group, groupIndex) => (
          <div key={groupIndex} className="space-y-3">
            {/* Period Header */}
            <div className="flex items-center gap-3 bg-base-200 p-3 rounded-lg">
              <span className="text-3xl">{group.icon}</span>
              <div>
                <h3 className="font-bold text-lg text-primary">{group.label}</h3>
                <p className="text-sm text-base-content/70">
                  {group.times.length} khung giờ khả dụng
                </p>
              </div>
            </div>

            {/* Time Grid with Visual Options */}
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
              {group.times.map((time) => {
                const isSelected = isTimeSlotSelected(time);
                const isDisabled = isTimeSlotDisabled(time);
                const isBooked = isTimeSlotBooked(time);

                return (
                  <button
                    key={time}
                    onClick={() => handleTimeSelection(time)}
                    disabled={isDisabled}
                    className={`
                      relative btn btn-lg transition-all duration-300 flex flex-col gap-1 h-auto py-3
                      ${
                        isSelected
                          ? "btn-primary shadow-xl scale-110 ring-4 ring-primary/30"
                          : isDisabled
                          ? "btn-disabled opacity-50"
                          : "btn-ghost hover:btn-primary hover:scale-105 border-2 border-base-300 hover:border-primary"
                      }
                    `}
                    title={isBooked ? "Đã được đặt" : isDisabled ? "Không khả dụng" : "Chọn giờ này"}
                  >
                    <span className={`text-lg font-bold ${isSelected ? 'text-2xl' : ''}`}>
                      {time.split(' ')[0]}
                    </span>
                    <span className={`text-xs ${isSelected ? 'font-semibold' : 'opacity-70'}`}>
                      {time.split(' ')[1]}
                    </span>
                    {isBooked && (
                      <span className="text-xs text-error font-semibold mt-1">Đã đặt</span>
                    )}

                    {/* Selection Indicator */}
                    {isSelected && (
                      <>
                        <div className="absolute inset-0 rounded-lg border-2 border-primary-content animate-pulse"></div>
                        <span className="absolute -top-2 -right-2 badge badge-primary badge-sm">✓</span>
                      </>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Selected Time Display */}
      {selectedStartTime && (
        <div className="card bg-gradient-to-r from-primary/20 to-secondary/20 shadow-lg animate-slide-up">
          <div className="card-body p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-base-content/70 mb-1">Giờ bắt đầu:</p>
                <p className="text-3xl font-bold text-primary">
                  {selectedStartTime}
                </p>
              </div>
              {/* <div className="text-5xl">⏰</div> */}
            </div>
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="card bg-base-200">
        <div className="card-body p-4">
          <h4 className="font-semibold mb-3">Chú thích:</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-primary"></div>
              <span>Đã chọn</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-base-300"></div>
              <span>Có sẵn</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-base-300 opacity-50"></div>
              <span>Đã đặt</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-success"></div>
              <span>Đề xuất</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimeSelection;
