using PickleTime.Api.Application.Contracts.Profile.Dtos;

namespace PickleTime.Api.Application.Contracts.Profile;

public interface IProfileService
{
    Task<ProfileDto> GetProfileAsync(int userId);
    Task<ProfileDto> UpdateProfileAsync(int userId, UpdateProfileDto request);
    Task<bool> ChangePasswordAsync(int userId, ChangePasswordDto request);
    Task<List<BookingHistoryDto>> GetBookingHistoryAsync(int userId, int page, int pageSize);
    Task<UserStatisticsDto> GetUserStatisticsAsync(int userId);
    Task<bool> DeactivateAccountAsync(int userId, string password);
}
