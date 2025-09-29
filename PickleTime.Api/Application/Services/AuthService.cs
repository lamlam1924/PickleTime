using PickleTime.Api.Application.Contract.Auth.Dto;
using PickleTime.Api.Application.Contracts.Auth;
using PickleTime.Api.Common.Helpers;

namespace PickleTime.Api.Application.Services;

public class AuthService : IAuthService
{
    private readonly IUserRepository _userRepository;
    private readonly JwtService _jwtService;

    public AuthService(IUserRepository userRepository, JwtService jwtService)
    {
        _userRepository = userRepository;
        _jwtService = jwtService;
    }

    public async Task<LoginResponseDto> LoginAsync(LoginRequestDto request)
    {
        var user = await _userRepository.GetByEmailAsync(request.Email);

        if (user == null)
            throw new UnauthorizedAccessException("Invalid email or password");

        // TODO: hash + verify password bằng BCrypt
        if (user.PassWord != request.Password)
            throw new UnauthorizedAccessException("Invalid email or password");

        // cập nhật LastLogin chẳng hạn
        user.LastLogin = DateTime.UtcNow;
        await _userRepository.UpdateAsync(user);

        var token = _jwtService.GenerateToken(user);

        return new LoginResponseDto
        {
            Token = token,
            Message = "Login successful"
        };
    }
    
    
}