using PickleTime.Api.Application.Contracts.Auth.Dtos;

namespace PickleTime.Api.Application.Contracts.Admin
{
    public interface IAdminService
    {
        Task<DashboardStatsDto> GetDashboardStatsAsync();
        Task<List<OwnerListDto>> GetAllOwnersAsync();
        Task<List<UserListDto>> GetAllUsersAsync();
        Task<UserListDto?> GetUserByIdAsync(int userId);
        Task<bool> UpdateUserStatusAsync(int userId, int statusId);
        Task<bool> UpdateUserAsync(int userId, UpdateUserDto dto);
        Task<bool> SoftDeleteUserAsync(int userId);
        Task<List<UserListDto>> GetDeletedUsersAsync();
        Task<bool> RestoreUserAsync(int userId);
    }
}

