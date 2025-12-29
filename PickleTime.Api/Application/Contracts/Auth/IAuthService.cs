using PickleTime.Api.Application.Contract.Auth.Dto;
using PickleTime.Api.Application.Contracts.Auth.Dtos;

namespace PickleTime.Api.Application.Contracts.Auth;

public interface IAuthService
{
    Task<LoginResponseDto> LoginAsync(LoginRequestDto request);
    Task<LoginResponseDto> GoogleLoginAsync(GoogleLoginRequestDto request);
    Task<bool> RequestPasswordResetAsync(PasswordResetRequestDto request);
    Task<bool> ResetPasswordAsync(PasswordResetConfirmDto request);
    Task<LoginResponseDto> RegisterAsync(RegisterRequestDto request);
}
