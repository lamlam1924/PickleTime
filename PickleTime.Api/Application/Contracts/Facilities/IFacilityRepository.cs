using PickleTime.Api.Domain.Entities;

namespace PickleTime.Api.Application.Contracts.Facilities;

public interface IFacilityRepository
{
    /// <summary>Tìm kiếm sân theo từ khóa (tên, địa chỉ, tỉnh/thành, quận, phường).</summary>
    Task<IEnumerable<Facility>> SearchAsync(string keyword);

    /// <summary>Lấy danh sách tất cả sân (chỉ thông tin cơ bản, không ảnh, không sân con).</summary>
    Task<IEnumerable<Facility>> GetAllAsync();

    /// <summary>Lấy danh sách tất cả sân với courts và types (dùng cho advanced search).</summary>
    Task<IEnumerable<Facility>> GetAllWithDetailsAsync();

    /// <summary>Lấy chi tiết đầy đủ 1 sân (ảnh, sân con, đánh giá, giờ hoạt động...).</summary>
    Task<Facility?> GetByIdWithDetailsAsync(int id);

    /// <summary>Lấy thông tin cơ bản của 1 sân (có trạng thái và manager).</summary>
    Task<Facility?> GetByIdAsync(int id);

    /// <summary>Lấy tất cả ảnh của sân (dùng riêng để load lazy).</summary>
    Task<List<FacilityImage>> GetImagesByFacilityIdAsync(int facilityId);

    /// <summary>Lấy tất cả sân con của một sân (có ảnh, loại sân, mặt sân).</summary>
    Task<List<Court>> GetCourtsByFacilityIdAsync(int facilityId);
}