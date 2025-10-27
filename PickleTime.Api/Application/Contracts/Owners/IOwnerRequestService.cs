using PickleTime.Api.Application.Contracts.Owners.Dtos;

namespace PickleTime.Api.Application.Contracts.Owners;

public interface IOwnerRequestService
{
    /// <summary>
    /// Lấy danh sách tất cả yêu cầu trở thành Chủ sân (bao gồm thông tin người gửi và trạng thái duyệt).
    /// </summary>
    Task<List<OwnerRequestDto>> GetAllRequestsAsync();

    /// <summary>
    /// Lấy danh sách yêu cầu của một người dùng cụ thể theo UserId.
    /// </summary>
    /// <param name="userId">ID của người dùng.</param>
    Task<List<OwnerRequestDto>> GetRequestsByUserAsync(int userId);

    /// <summary>
    /// Tạo mới một yêu cầu trở thành Chủ sân.
    /// </summary>
    /// <param name="dto">Thông tin yêu cầu được gửi từ người dùng.</param>
    Task<OwnerRequestDto> CreateRequestAsync(CreateOwnerRequestDto dto);

    /// <summary>
    /// Duyệt hoặc từ chối một yêu cầu trở thành Chủ sân.
    /// </summary>
    /// <param name="id">ID của yêu cầu cần duyệt.</param>
    /// <param name="dto">Thông tin phản hồi của admin (trạng thái duyệt, ghi chú, ...).</param>
    Task<OwnerRequestDto> ReviewRequestAsync(int id, ReviewOwnerRequestDto dto);
    
    /// <summary>
    /// Chấp nhận một yêu cầu trở thành Chủ sân.
    /// </summary>
    /// <param name="id">ID của yêu cầu cần chấp nhận.</param>
    /// <param name="adminId">ID của admin thực hiện thao tác.</param>
    Task<OwnerRequestDto> AcceptRequestAsync(int id, int adminId);

    /// <summary>
    /// Từ chối một yêu cầu trở thành Chủ sân.
    /// </summary>
    /// <param name="id">ID của yêu cầu cần từ chối.</param>
    /// <param name="adminId">ID của admin thực hiện thao tác.</param>
    Task<OwnerRequestDto> RejectRequestAsync(int id, int adminId);

    /// <summary>
    /// Đặt lại trạng thái yêu cầu thành Pending (Reconsider) để admin xem lại.
    /// </summary>
    /// <param name="id">ID của yêu cầu cần reconsider.</param>
    /// <param name="adminId">ID của admin thực hiện thao tác.</param>
    Task<OwnerRequestDto> ReconsiderRequestAsync(int id, int adminId);
}