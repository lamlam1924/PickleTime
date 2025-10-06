using PickleTime.Api.Application.Contract.Auth.Dto;

namespace PickleTime.Api.Application.Contracts.Auth;

public interface IAuthService
{
    Task<LoginResponseDto> LoginAsync(LoginRequestDto request);
    Task<RegisterResponseDto> RegisterAsync(RegisterRequestDto request);
}
