import { useState } from "react";
import { Home, CloudSun, MapPin, CheckCircle, XCircle, Sparkles } from "lucide-react";

const CourtSelection = ({ availableCourts, selectedCourt, onCourtSelect }) => {
  const [viewMode, setViewMode] = useState('map'); // 'map' or 'list'

  // Group courts by type
  const indoorCourts = availableCourts.filter(c => c.type === 'Indoor' || c.isIndoor);
  const outdoorCourts = availableCourts.filter(c => c.type === 'Outdoor' || !c.isIndoor);

  const renderCourtCard = (court, index) => {
    const isSelected = selectedCourt?.courtId === court.courtId;
    const isAvailable = court.isAvailable;
    const isIndoor = court.type === 'Indoor' || court.isIndoor;

    return (
      <div
        key={court.courtId}
        onClick={() => isAvailable && onCourtSelect(court)}
        className={`
          relative cursor-pointer transition-all duration-200 rounded-lg p-3
          ${isSelected 
            ? 'bg-primary text-primary-content shadow-lg ring-2 ring-primary scale-105 z-10' 
            : isAvailable
              ? 'bg-base-100 hover:bg-base-200 hover:shadow-md border border-base-300'
              : 'bg-base-200 opacity-40 cursor-not-allowed border border-base-300'
          }
        `}
      >
        <div className="flex flex-col items-center gap-1">
          {isIndoor ? (
            <Home className={`w-6 h-6 ${isSelected ? 'text-primary-content' : 'text-info'}`} />
          ) : (
            <CloudSun className={`w-6 h-6 ${isSelected ? 'text-primary-content' : 'text-warning'}`} />
          )}
          
          <p className={`font-semibold text-xs text-center ${isSelected ? 'text-primary-content' : 'text-base-content'}`}>
            {court.courtName || `Sân ${court.courtId}`}
          </p>

          {!isAvailable && (
            <XCircle className={`w-4 h-4 ${isSelected ? 'text-primary-content' : 'text-error'} opacity-70`} />
          )}

          {isSelected && (
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-accent rounded-full flex items-center justify-center">
              <CheckCircle className="w-4 h-4 text-accent-content" />
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2 flex items-center justify-center gap-2 text-primary">
          <MapPin className="w-6 h-6" />
          Sơ Đồ Cơ Sở
        </h2>
        <p className="text-sm text-base-content/70">
          Chọn sân phù hợp với thời gian bạn đã chọn
        </p>
      </div>

      {/* View Toggle - Only show when a court is selected */}
      {selectedCourt && (
        <div className="flex justify-center gap-3">
          <button 
            className={`btn btn-sm ${viewMode === 'map' ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => setViewMode('map')}
          >
            {/* <MapPin className="w-4 h-4" /> */}
            Sơ đồ
          </button>
          <button 
            className={`btn btn-sm ${viewMode === 'list' ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => setViewMode('list')}
          >
            {/* <CheckCircle className="w-4 h-4" /> */}
            Chi tiết
          </button>
        </div>
      )}

      {/* No Courts Available */}
      {availableCourts.length === 0 && (
        <div className="alert alert-warning">
          <XCircle className="w-6 h-6" />
          <div>
            <p className="font-bold">Không có sân nào khả dụng!</p>
            <p className="text-sm">Vui lòng chọn giờ khác hoặc giảm thời lượng đặt sân.</p>
          </div>
        </div>
      )}

      {/* Map View */}
      {viewMode === 'map' && availableCourts.length > 0 && (
        <div className="card bg-base-200 shadow-lg">
          <div className="card-body p-6">
            <div className="space-y-6">
              {/* Indoor Courts Section */}
              {indoorCourts.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 bg-info/10 px-3 py-2 rounded-lg border border-info/30">
                    <Home className="w-5 h-5 text-info" />
                    <div className="flex-1">
                      <span className="font-semibold text-info">Sân Trong Nhà</span>
                      <span className="text-xs text-base-content/60 ml-2">
                        ({indoorCourts.filter(c => c.isAvailable).length}/{indoorCourts.length} trống)
                      </span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-3">
                    {indoorCourts.map((court, idx) => renderCourtCard(court, idx))}
                  </div>
                </div>
              )}

              {/* Outdoor Courts Section */}
              {outdoorCourts.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 bg-warning/10 px-3 py-2 rounded-lg border border-warning/30">
                    <CloudSun className="w-5 h-5 text-warning" />
                    <div className="flex-1">
                      <span className="font-semibold text-warning">Sân Ngoài Trời</span>
                      <span className="text-xs text-base-content/60 ml-2">
                        ({outdoorCourts.filter(c => c.isAvailable).length}/{outdoorCourts.length} trống)
                      </span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-3">
                    {outdoorCourts.map((court, idx) => renderCourtCard(court, idx))}
                  </div>
                </div>
              )}
            </div>

            {/* Compact Legend */}
            <div className="mt-4 pt-4 border-t border-base-300">
              <div className="flex items-center justify-center gap-6 text-xs">
                <div className="flex items-center gap-1">
                  <div className="w-4 h-4 rounded bg-primary"></div>
                  <span>Đã chọn</span>
                </div>
                <div className="flex items-center gap-1">
                  <Home className="w-4 h-4 text-info" />
                  <span>Trong nhà</span>
                </div>
                <div className="flex items-center gap-1">
                  <CloudSun className="w-4 h-4 text-warning" />
                  <span>Ngoài trời</span>
                </div>
                <div className="flex items-center gap-1">
                  <XCircle className="w-4 h-4 text-error" />
                  <span>Đã đặt</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Detail View - Show selected court details */}
      {viewMode === 'list' && selectedCourt && (
        <div className="card bg-base-100 shadow-xl max-w-2xl mx-auto">
          <div className="card-body p-8">
            {/* Court Header */}
            <div className="flex items-center gap-4 mb-6">
              <div className={`p-4 rounded-xl ${(selectedCourt.type === 'Indoor' || selectedCourt.isIndoor) ? 'bg-info/20' : 'bg-warning/20'}`}>
                {(selectedCourt.type === 'Indoor' || selectedCourt.isIndoor) ? (
                  <Home className="w-10 h-10 text-info" />
                ) : (
                  <CloudSun className="w-10 h-10 text-warning" />
                )}
              </div>
              <div className="flex-1">
                <h3 className="text-3xl font-bold text-primary mb-1">
                  {selectedCourt.courtName || `Sân ${selectedCourt.courtId}`}
                </h3>
                <div className="flex items-center gap-2">
                  <span className={`badge ${(selectedCourt.type === 'Indoor' || selectedCourt.isIndoor) ? 'badge-info' : 'badge-warning'}`}>
                    {(selectedCourt.type === 'Indoor' || selectedCourt.isIndoor) ? '🏠 Sân trong nhà' : '☀️ Sân ngoài trời'}
                  </span>
                  {selectedCourt.isAvailable ? (
                    <span className="badge badge-success gap-1">
                      <CheckCircle className="w-3 h-3" />
                      Có sẵn
                    </span>
                  ) : (
                    <span className="badge badge-error gap-1">
                      <XCircle className="w-3 h-3" />
                      Đã đặt
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="divider my-4"></div>

            {/* Court Details */}
            <div className="space-y-4">
              {/* Price */}
              <div className="flex items-center justify-between p-4 bg-accent/10 rounded-lg">
                <span className="text-base-content/70 font-medium">Giá thuê:</span>
                <span className="text-3xl font-bold text-accent">
                  {(selectedCourt.price || 200000).toLocaleString()} VNĐ
                  <span className="text-sm text-base-content/60 ml-1">/giờ</span>
                </span>
              </div>

              {/* Features Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-base-200 rounded-lg">
                  <div className="text-xs text-base-content/60 mb-1">Loại sân</div>
                  <div className="font-semibold text-base-content">
                    {selectedCourt.courtType || 'Standard'}
                  </div>
                </div>

                <div className="p-4 bg-base-200 rounded-lg">
                  <div className="text-xs text-base-content/60 mb-1">Mặt sân</div>
                  <div className="font-semibold text-base-content">
                    🎾 {selectedCourt.surfaceName || 'Synthetic'}
                  </div>
                </div>

                <div className="p-4 bg-base-200 rounded-lg">
                  <div className="text-xs text-base-content/60 mb-1">Hệ thống đèn</div>
                  <div className="font-semibold text-base-content">
                    {selectedCourt.hasLighting ? '💡 Có đèn' : '🌙 Không có đèn'}
                  </div>
                </div>

                <div className="p-4 bg-base-200 rounded-lg">
                  <div className="text-xs text-base-content/60 mb-1">Vị trí</div>
                  <div className="font-semibold text-base-content">
                    {(selectedCourt.type === 'Indoor' || selectedCourt.isIndoor) ? '🏠 Trong nhà' : '🌳 Ngoài trời'}
                  </div>
                </div>
              </div>

              {/* Description */}
              {selectedCourt.description && (
                <div className="p-4 bg-base-200 rounded-lg">
                  <div className="text-xs text-base-content/60 mb-2">Mô tả:</div>
                  <p className="text-sm text-base-content/80 leading-relaxed">
                    {selectedCourt.description}
                  </p>
                </div>
              )}

              {/* Additional Info */}
              <div className="alert alert-info">
                <Sparkles className="w-5 h-5" />
                <div>
                  <p className="font-semibold">Thông tin thêm</p>
                  <p className="text-sm">Sân đã được chọn cho thời gian bạn đã đặt. Vui lòng xác nhận để tiếp tục.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Auto-selected Notice */}
      {availableCourts.filter(c => c.isAvailable).length === 1 && selectedCourt && (
        <div className="alert alert-success animate-bounce-in">
          <Sparkles className="w-5 h-5" />
          <div>
            <p className="font-bold">Đã tự động chọn sân!</p>
            <p className="text-sm">Chỉ có 1 sân khả dụng cho thời gian này.</p>
          </div>
        </div>
      )}

      {/* Selected Court Summary */}
      {selectedCourt && (
        <div className="card bg-gradient-to-r from-primary/20 to-secondary/20 shadow-lg animate-slide-up">
          <div className="card-body p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {(selectedCourt.type === 'Indoor' || selectedCourt.isIndoor) ? (
                  <div className="p-4 bg-info/20 rounded-lg">
                    <Home className="w-8 h-8 text-info" />
                  </div>
                ) : (
                  <div className="p-4 bg-warning/20 rounded-lg">
                    <CloudSun className="w-8 h-8 text-warning" />
                  </div>
                )}
                <div>
                  <p className="text-sm text-base-content/70 mb-1">Sân đã chọn:</p>
                  <p className="text-2xl font-bold text-primary">
                    {selectedCourt.courtName || `Sân ${selectedCourt.courtId}`}
                  </p>
                  <p className="text-sm text-base-content/60 mt-1">
                    {(selectedCourt.type === 'Indoor' || selectedCourt.isIndoor) ? '🏠 Sân trong nhà' : '☀️ Sân ngoài trời'}
                  </p>
                </div>
              </div>
              {/* <div className="text-5xl">🎾</div> */}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourtSelection;
