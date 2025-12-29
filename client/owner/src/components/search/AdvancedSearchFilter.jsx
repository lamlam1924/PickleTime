import { useState } from "react";
import { Filter, X } from "lucide-react";

const AdvancedSearchFilter = ({ onFilterChange, onReset }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState({
    searchTerm: "",
    province: "",
    district: "",
    minRating: 0,
    isIndoor: null, // null = all, true = indoor, false = outdoor
    hasLighting: null,
    courtTypes: [], // pickleball, tennis, badminton
    sortBy: "relevance", // relevance, rating, price, distance
    priceRange: [0, 500000],
  });

  const provinces = [
    "Hồ Chí Minh", "Hà Nội", "Đà Nẵng", "Cần Thơ", 
    "Hải Phòng", "Biên Hòa", "Nha Trang"
  ];

  const courtTypes = [
    { id: "pickleball", label: "Pickleball" },
    { id: "tennis", label: "Tennis" },
    { id: "badminton", label: "Cầu lông" },
  ];

  const sortOptions = [
    { value: "relevance", label: "Liên quan nhất" },
    { value: "rating", label: "Đánh giá cao nhất" },
    { value: "name", label: "Tên A-Z" },
    { value: "newest", label: "Mới nhất" },
  ];

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleCourtTypeToggle = (typeId) => {
    const newTypes = filters.courtTypes.includes(typeId)
      ? filters.courtTypes.filter((t) => t !== typeId)
      : [...filters.courtTypes, typeId];
    handleFilterChange("courtTypes", newTypes);
  };

  const handleReset = () => {
    const resetFilters = {
      searchTerm: "",
      province: "",
      district: "",
      minRating: 0,
      isIndoor: null,
      hasLighting: null,
      courtTypes: [],
      sortBy: "relevance",
      priceRange: [0, 500000],
    };
    setFilters(resetFilters);
    onReset();
  };

  const activeFiltersCount = Object.values(filters).filter((v) => {
    if (Array.isArray(v)) return v.length > 0;
    if (typeof v === "string") return v !== "";
    if (typeof v === "number") return v !== 0;
    if (v === null) return false;
    return false;
  }).length;

  return (
    <div className="w-full mb-6">
      {/* Search Bar */}
      <div className="flex gap-2 mb-4">
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Tìm theo tên sân, địa chỉ..."
            className="input input-bordered w-full pr-10"
            value={filters.searchTerm}
            onChange={(e) => handleFilterChange("searchTerm", e.target.value)}
          />
          {filters.searchTerm && (
            <button
              onClick={() => handleFilterChange("searchTerm", "")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`btn ${activeFiltersCount > 0 ? "btn-primary" : "btn-outline"}`}
        >
          <Filter className="w-5 h-5 mr-2" />
          Lọc {activeFiltersCount > 0 && `(${activeFiltersCount})`}
        </button>
      </div>

      {/* Filter Panel */}
      {isOpen && (
        <div className="card bg-base-100 shadow-lg">
          <div className="card-body">
            <div className="flex justify-between items-center mb-4">
              <h3 className="card-title text-lg">Bộ lọc nâng cao</h3>
              <button onClick={handleReset} className="btn btn-ghost btn-sm">
                <X className="w-4 h-4 mr-1" />
                Xóa tất cả
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Location Filters */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Tỉnh/Thành phố</span>
                </label>
                <select
                  className="select select-bordered"
                  value={filters.province}
                  onChange={(e) => handleFilterChange("province", e.target.value)}
                >
                  <option value="">Tất cả</option>
                  {provinces.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Quận/Huyện</span>
                </label>
                <input
                  type="text"
                  placeholder="Nhập quận/huyện"
                  className="input input-bordered"
                  value={filters.district}
                  onChange={(e) => handleFilterChange("district", e.target.value)}
                />
              </div>

              {/* Rating Filter */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">
                    Đánh giá tối thiểu: {filters.minRating > 0 ? `${filters.minRating}⭐` : "Tất cả"}
                  </span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="5"
                  step="0.5"
                  value={filters.minRating}
                  onChange={(e) => handleFilterChange("minRating", parseFloat(e.target.value))}
                  className="range range-primary"
                />
                <div className="flex justify-between text-xs px-2 mt-1">
                  <span>0⭐</span>
                  <span>5⭐</span>
                </div>
              </div>

              {/* Court Type Filter */}
              <div className="form-control col-span-1 md:col-span-2 lg:col-span-3">
                <label className="label">
                  <span className="label-text font-semibold">Loại sân</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {courtTypes.map((type) => (
                    <label key={type.id} className="cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.courtTypes.includes(type.id)}
                        onChange={() => handleCourtTypeToggle(type.id)}
                        className="checkbox checkbox-primary checkbox-sm mr-2"
                      />
                      <span className="label-text">{type.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Indoor/Outdoor */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Loại sân</span>
                </label>
                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      handleFilterChange("isIndoor", filters.isIndoor === null ? true : null)
                    }
                    className={`btn btn-sm flex-1 ${
                      filters.isIndoor === true ? "btn-primary" : "btn-outline"
                    }`}
                  >
                    Trong nhà
                  </button>
                  <button
                    onClick={() =>
                      handleFilterChange("isIndoor", filters.isIndoor === null ? false : null)
                    }
                    className={`btn btn-sm flex-1 ${
                      filters.isIndoor === false ? "btn-primary" : "btn-outline"
                    }`}
                  >
                    Ngoài trời
                  </button>
                </div>
              </div>

              {/* Lighting */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Chiếu sáng</span>
                </label>
                <label className="cursor-pointer label justify-start gap-2">
                  <input
                    type="checkbox"
                    checked={filters.hasLighting === true}
                    onChange={(e) => handleFilterChange("hasLighting", e.target.checked || null)}
                    className="checkbox checkbox-primary"
                  />
                  <span className="label-text">Có đèn chiếu sáng</span>
                </label>
              </div>

              {/* Sort By */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Sắp xếp theo</span>
                </label>
                <select
                  className="select select-bordered"
                  value={filters.sortBy}
                  onChange={(e) => handleFilterChange("sortBy", e.target.value)}
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Apply Button */}
            <div className="card-actions justify-end mt-4">
              <button onClick={() => setIsOpen(false)} className="btn btn-primary">
                Áp dụng bộ lọc
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Active Filters Display */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {filters.province && (
            <div className="badge badge-primary gap-2">
              {filters.province}
              <X
                className="w-3 h-3 cursor-pointer"
                onClick={() => handleFilterChange("province", "")}
              />
            </div>
          )}
          {filters.district && (
            <div className="badge badge-primary gap-2">
              {filters.district}
              <X
                className="w-3 h-3 cursor-pointer"
                onClick={() => handleFilterChange("district", "")}
              />
            </div>
          )}
          {filters.minRating > 0 && (
            <div className="badge badge-primary gap-2">
              ≥ {filters.minRating}⭐
              <X
                className="w-3 h-3 cursor-pointer"
                onClick={() => handleFilterChange("minRating", 0)}
              />
            </div>
          )}
          {filters.courtTypes.map((type) => (
            <div key={type} className="badge badge-primary gap-2">
              {courtTypes.find((t) => t.id === type)?.label}
              <X
                className="w-3 h-3 cursor-pointer"
                onClick={() => handleCourtTypeToggle(type)}
              />
            </div>
          ))}
          {filters.isIndoor !== null && (
            <div className="badge badge-primary gap-2">
              {filters.isIndoor ? "Trong nhà" : "Ngoài trời"}
              <X
                className="w-3 h-3 cursor-pointer"
                onClick={() => handleFilterChange("isIndoor", null)}
              />
            </div>
          )}
          {filters.hasLighting && (
            <div className="badge badge-primary gap-2">
              Có đèn chiếu sáng
              <X
                className="w-3 h-3 cursor-pointer"
                onClick={() => handleFilterChange("hasLighting", null)}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdvancedSearchFilter;
