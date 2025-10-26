using PickleTime.Api.Application.Contract.Auth.Dto;
using PickleTime.Api.Application.Contracts.Auth;
using PickleTime.Api.Application.Contracts.Roles;
using PickleTime.Api.Common.Helpers;

namespace PickleTime.Api.Application.Services;

public class AuthService : IAuthService
{
    private readonly IUserRepository _userRepository;
    private readonly JwtService _jwtService;
    private readonly IRoleRepository _roleRepository;

    public AuthService(IUserRepository userRepository, JwtService jwtService
    , IRoleRepository roleRepository)
    {
        _userRepository = userRepository;
        _jwtService = jwtService;
        _roleRepository = roleRepository;
    }

    public async Task<LoginResponseDto> LoginAsync(LoginRequestDto request)
    {
        // Bước 1: tìm tài khoản theo email (tùy thuộc loại account)
        var user = await _userRepository.GetByEmailAsync(request.Email);
        if (user == null)
            throw new UnauthorizedAccessException("Invalid email or password");
        
        if (user.Role == null)
            user.Role = await _roleRepository.GetByIdAsync(user.RoleId);

        // Bước 2: xác thực mật khẩu 
        var isBcryptHash = user.PassWord.StartsWith("$2");
        bool passwordValid;
        if (isBcryptHash)
        {
            passwordValid = BCrypt.Net.BCrypt.Verify(request.Password, user.PassWord);
        }
        else
        {
            passwordValid = string.Equals(user.PassWord, request.Password);
            if (passwordValid)
            {
                user.PassWord = BCrypt.Net.BCrypt.HashPassword(request.Password);
                await _userRepository.UpdateAsync(user);
            }
        }
        if (!passwordValid)
            throw new UnauthorizedAccessException("Invalid email or password");
       
        // Bước 3: cập nhật thông tin login
        user.LastLogin = DateTime.UtcNow;
        await _userRepository.UpdateAsync(user);
        
        // Bước 4: sinh token – dùng role thực tế trong hệ thống
        var token = _jwtService.GenerateToken(user);

        return new LoginResponseDto
        {
            Token = token,
            Message = "Login successful",
            Role = user.Role.RoleName 
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