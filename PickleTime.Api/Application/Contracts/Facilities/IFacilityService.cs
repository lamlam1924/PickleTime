using PickleTime.Api.Application.Contracts.Facilities.Dtos;

namespace PickleTime.Api.Application.Contracts.Facilities;

public interface IFacilityService
{
    /// <summary>
    /// Tìm kiếm Facility theo từ khóa.
    /// </summary>
    Task<IEnumerable<FacilityDto>> SearchFacilitiesAsync(string keyword);

    /// <summary>
    /// Tìm kiếm nâng cao với filter và sort.
    /// </summary>
    Task<FacilitySearchResultDto> AdvancedSearchAsync(FacilitySearchFilterDto filter);

    /// <summary>
    /// Lấy danh sách tất cả Facility.
    /// </summary>
    Task<IEnumerable<FacilityDto>> GetAllAsync();

    /// <summary>
    /// Lấy Facility cơ bản theo ID.
    /// </summary>
    Task<FacilityDto?> GetByIdAsync(int id);

    /// <summary>
    /// Lấy Facility chi tiết theo ID (gồm sân, hình ảnh, tiện ích...).
    /// </summary>
    Task<FacilityDetailDto?> GetFacilityByIdAsync(int id);
}