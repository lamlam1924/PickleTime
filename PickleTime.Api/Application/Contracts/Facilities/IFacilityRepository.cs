using PickleTime.Api.Domain.Entities;

namespace PickleTime.Api.Application.Contracts.Facilities;

public interface IFacilityRepository
{
    /// <summary>
    /// Tìm kiếm Facility theo từ khóa.
    /// </summary>
    Task<IEnumerable<Facility>> SearchAsync(string keyword);

    /// <summary>
    /// Lấy tất cả Facility đang hoạt động.
    /// </summary>
    Task<IEnumerable<Facility>> GetAllAsync();

    /// <summary>
    /// Lấy Facility theo ID (kèm trạng thái và sân).
    /// </summary>
    Task<Facility?> GetByIdAsync(int id);

    /// <summary>
    /// Lấy Facility theo ID (bao gồm hình ảnh và chi tiết sân).
    /// </summary>
    Task<Facility?> GetByIdWithDetailsAsync(int id);
    
}