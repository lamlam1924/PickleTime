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

        // Verify password; support legacy plaintext passwords and auto-upgrade to BCrypt
        var isBcryptHash = user.PassWord.StartsWith("$2");
        bool passwordValid;
        if (isBcryptHash)
        {
            passwordValid = BCrypt.Net.BCrypt.Verify(request.Password, user.PassWord);
        }
        else
        {
            // Legacy plaintext compare once, then upgrade to bcrypt if valid
            passwordValid = string.Equals(user.PassWord, request.Password);
            if (passwordValid)
            {
                user.PassWord = BCrypt.Net.BCrypt.HashPassword(request.Password);
                await _userRepository.UpdateAsync(user);
            }
        }

        if (!passwordValid)
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

    public async Task<RegisterResponseDto> RegisterAsync(RegisterRequestDto request)
    {
        if (string.IsNullOrWhiteSpace(request.Email) || string.IsNullOrWhiteSpace(request.Password))
            throw new ArgumentException("Email and password are required");

        if (request.Password != request.ConfirmPassword)
            throw new ArgumentException("Passwords do not match");

        var existing = await _userRepository.GetByEmailAsync(request.Email);
        if (existing != null)
            throw new ArgumentException("User with this email already exists");

        var now = DateTime.UtcNow;

        var user = new Domain.Entities.User
        {
            Email = request.Email,
            UserName = request.Email,
            PassWord = BCrypt.Net.BCrypt.HashPassword(request.Password),
            FullName = $"{request.FirstName} {request.LastName}".Trim(),
            Phone = request.PhoneNumber,
            RoleId = 3, // default to customer per seed data
            StatusId = 1, // active per seed data
            CreatedAt = now,
            UpdatedAt = now,
            LastLogin = null,
            IsDeleted = false
        };

        user = await _userRepository.CreateAsync(user);
        // Reload to include Role navigation for JWT claims
        user = await _userRepository.GetByEmailAsync(user.Email) ?? user;
        var token = _jwtService.GenerateToken(user);

        return new RegisterResponseDto
        {
            Token = token,
            Message = "Registration successful",
            Success = true
        };
    }
}