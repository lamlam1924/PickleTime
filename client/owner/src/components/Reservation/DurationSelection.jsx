import { Timer, Plus, Minus, Clock, TrendingUp } from "lucide-react";
import { getEndTime } from "../../utils/dateUtils";

const DurationSelection = ({
  selectedStartTime,
  duration,
  handleDurationChange,
  isDurationAvailable,
}) => {
  // Safe value extraction
  const durationValue = typeof duration === 'object' ? (duration?.value || 0) : Number(duration) || 0;
  
  const quickDurations = [
    { value: 1, label: "1 Giờ", popular: true },
    { value: 1.5, label: "1.5 Giờ", popular: false },
    { value: 2, label: "2 Giờ", popular: true },
    { value: 3, label: "3 Giờ", popular: false },
  ];

  const handleIncrement = () => {
    const newDuration = durationValue + 0.5;
    if (isDurationAvailable(selectedStartTime, newDuration)) {
      handleDurationChange({ target: { value: newDuration } });
    }
  };

  const handleDecrement = () => {
    const newDuration = Math.max(0.5, durationValue - 0.5);
    if (isDurationAvailable(selectedStartTime, newDuration)) {
      handleDurationChange({ target: { value: newDuration } });
    }
  };

  const isQuickDurationAvailable = (value) => {
    return isDurationAvailable(selectedStartTime, value);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-2 flex items-center justify-center gap-3 text-primary">
          <Timer className="w-8 h-8" />
          Chọn Thời Lượng
        </h2>
        <p className="text-base-content font-medium">
          Bạn muốn chơi trong bao lâu?
        </p>
      </div>

      {/* Quick Duration Selection */}
      <div className="space-y-3">
        <h3 className="font-bold text-lg flex items-center gap-2 text-success">
          <TrendingUp className="w-5 h-5" />
          Thời Lượng Phổ Biến
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {quickDurations.map((preset) => {
            const isAvailable = isQuickDurationAvailable(preset.value);
            const isSelected = durationValue === preset.value;

            return (
              <button
                key={preset.value}
                onClick={() => 
                  handleDurationChange({ target: { value: preset.value } })
                }
                disabled={!isAvailable}
                className={`
                  relative card transition-all duration-300
                  ${
                    isSelected
                      ? "bg-primary text-primary-content shadow-lg scale-105 ring-4 ring-primary/30"
                      : !isAvailable
                      ? "bg-base-300 opacity-50 cursor-not-allowed"
                      : "bg-base-200 hover:bg-base-300 hover:scale-105 hover:shadow-md cursor-pointer"
                  }
                `}
              >
                <div className="card-body p-4 text-center">
                  {/* Popular Badge */}
                  {preset.popular && isAvailable && (
                    <span className="absolute -top-2 -right-2 badge badge-warning badge-sm">
                      Phổ biến
                    </span>
                  )}

                  <div className="text-4xl mb-2">{preset.icon}</div>
                  <p className="font-bold text-lg">{preset.label}</p>
                  
                  {!isAvailable && (
                    <p className="text-xs mt-1 text-error">Không khả dụng</p>
                  )}

                  {/* Selection Indicator */}
                  {isSelected && (
                    <div className="absolute inset-0 rounded-xl border-2 border-primary-content animate-pulse"></div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="divider">HOẶC TÙY CHỈNH</div>

      {/* Custom Duration Selector */}
      <div className="card bg-gradient-to-br from-base-200 to-base-300 shadow-lg">
        <div className="card-body p-8">
          <div className="flex flex-col items-center space-y-6">
            {/* Duration Display */}
            <div className="text-center">
              <p className="text-sm text-base-content/70 mb-2">Thời lượng tùy chỉnh</p>
              <div className="text-6xl font-bold text-primary animate-pulse">
                {typeof duration === 'object' ? duration?.value || 0 : duration}
              </div>
              <p className="text-xl mt-2 text-base-content/80">
                {duration === 1 ? "Giờ" : "Giờ"}
              </p>
            </div>

            {/* Increment/Decrement Controls */}
            <div className="flex items-center gap-4">
              <button
                onClick={handleDecrement}
                disabled={durationValue <= 0.5}
                className="btn btn-circle btn-lg btn-primary"
                title="Giảm 30 phút"
              >
                <Minus className="w-6 h-6" />
              </button>

              <div className="flex flex-col items-center min-w-[150px]">
                {/* <div className="text-3xl mb-1">⏱️</div> */}
                <input
                  type="range"
                  min="0.5"
                  max="5"
                  step="0.5"
                  value={durationValue}
                  onChange={handleDurationChange}
                  className="range range-primary"
                />
                <div className="w-full flex justify-between text-xs px-2 mt-1">
                  <span>30m</span>
                  <span>5h</span>
                </div>
              </div>

              <button
                onClick={handleIncrement}
                disabled={!isDurationAvailable(selectedStartTime, durationValue + 0.5)}
                className="btn btn-circle btn-lg btn-primary"
                title="Tăng 30 phút"
              >
                <Plus className="w-6 h-6" />
              </button>
            </div>

            {/* Time Range Preview */}
            {selectedStartTime && durationValue > 0 && (
              <div className="card bg-base-100 w-full">
                <div className="card-body p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Clock className="w-5 h-5 text-primary" />
                      <div>
                        <p className="text-sm text-base-content/70">Thời gian</p>
                        <p className="font-bold text-lg">
                          {selectedStartTime} - {getEndTime(selectedStartTime, durationValue)}
                        </p>
                      </div>
                    </div>
                    {/* <div className="text-4xl">⏰</div> */}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Duration Summary Card */}
      {durationValue > 0 && (
        <div className="card bg-gradient-to-r from-primary/20 to-secondary/20 shadow-lg animate-slide-up">
          <div className="card-body p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-sm text-base-content/70 mb-1">Thời lượng</p>
                <p className="text-2xl font-bold text-primary">
                  {typeof duration === 'object' ? (duration?.value || 0) : duration} giờ
                </p>
              </div>
              
              <div className="text-center">
                <p className="text-sm text-base-content/70 mb-1">Tương đương</p>
                <p className="text-2xl font-bold text-secondary">
                  {typeof duration === 'object' ? (duration?.value || 0) * 60 : duration * 60} phút
                </p>
              </div>

              {selectedStartTime && (
                <div className="text-center">
                  <p className="text-sm text-base-content/70 mb-1">Kết thúc lúc</p>
                  <p className="text-2xl font-bold text-accent">
                    {getEndTime(selectedStartTime, durationValue)}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Helpful Tips */}
      <div className="alert">
        <div className="flex items-start gap-3">
          {/* <Timer className="w-5 h-5 flex-shrink-0" /> */}
          <div className="text-sm">
            <p className="font-semibold mb-1">💡 Mẹo:</p>
            <ul className="list-disc list-inside space-y-1 text-base-content/70">
              <li>Thời lượng tối thiểu: 60 phút (1 giờ)</li>
              <li>Thời lượng phổ biến nhất: 1-2 giờ</li>
              <li>Bạn có thể tùy chỉnh theo bước 30 phút</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DurationSelection;
