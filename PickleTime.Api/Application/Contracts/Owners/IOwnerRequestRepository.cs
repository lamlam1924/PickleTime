using PickleTime.Api.Domain.Entities;

namespace PickleTime.Api.Application.Contracts.Owners;

public interface IOwnerRequestRepository
{
    /// <summary>
    /// Lấy danh sách tất cả các yêu cầu trở thành Chủ sân.
    /// </summary>
    Task<List<OwnerRequest>> GetAllAsync();

    /// <summary>
    /// Lấy danh sách yêu cầu của người dùng cụ thể theo UserId.
    /// </summary>
    /// <param name="userId">ID của người dùng.</param>
    Task<List<OwnerRequest>> GetByUserAsync(int userId);

    /// <summary>
    /// Lấy thông tin chi tiết của một yêu cầu theo ID.
    /// </summary>
    /// <param name="id">ID của yêu cầu.</param>
    Task<OwnerRequest?> GetByIdAsync(int id);

    /// <summary>
    /// Thêm mới một yêu cầu trở thành Chủ sân.
    /// </summary>
    /// <param name="request">Đối tượng OwnerRequest cần thêm.</param>
    Task AddAsync(OwnerRequest request);

    /// <summary>
    /// Cập nhật thông tin của một yêu cầu trở thành Chủ sân.
    /// </summary>
    /// <param name="request">Đối tượng OwnerRequest cần cập nhật.</param>
    Task UpdateAsync(OwnerRequest request);

    /// <summary>
    /// Lưu thay đổi vào cơ sở dữ liệu.
    /// </summary>
    Task SaveChangesAsync();
}