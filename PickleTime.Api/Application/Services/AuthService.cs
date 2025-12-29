using Google.Apis.Auth;
using PickleTime.Api.Application.Contract.Auth.Dto;
using PickleTime.Api.Application.Contracts.Auth;
using PickleTime.Api.Application.Contracts.Auth.Dtos;
using PickleTime.Api.Common.Helpers;
using PickleTime.Api.Domain.Entities;

namespace PickleTime.Api.Application.Services;

public class AuthService : IAuthService
{
    private readonly IUserRepository _userRepository;
    private readonly JwtService _jwtService;
    private readonly IEmailService _emailService;

    public AuthService(IUserRepository userRepository, JwtService jwtService, IEmailService emailService)
    {
        _userRepository = userRepository;
        _jwtService = jwtService;
        _emailService = emailService;
    }

    public async Task<LoginResponseDto> LoginAsync(LoginRequestDto request)
    {
        var user = await _userRepository.GetByEmailWithRolesAsync(request.Email);

        if (user == null)
            throw new UnauthorizedAccessException("Email hoặc mật khẩu không chính xác");

        // Verify password with BCrypt
        if (!BCrypt.Net.BCrypt.Verify(request.Password, user.PassWord))
            throw new UnauthorizedAccessException("Email hoặc mật khẩu không chính xác");

        // Check if user is active
        if (user.StatusId != 1) // 1 = Active
            throw new UnauthorizedAccessException("Tài khoản của bạn chưa được kích hoạt");

        // Update LastLogin
        user.LastLogin = DateTime.UtcNow;
        await _userRepository.UpdateAsync(user);

        // Reload user with Role navigation property after update
        // user = await _userRepository.GetByEmailAsync(user.Email);
        // if (user == null)
        //     throw new UnauthorizedAccessException("Failed to reload user data");

        var token = _jwtService.GenerateToken(user);

        return new LoginResponseDto
        {
            Token = token,
            Message = "Đăng nhập thành công",
            // Role = user.Roles?.RoleName ?? "Unknown",
            UserId = user.UserId,
            UserName = user.UserName,
            Email = user.Email,
            FullName = user.FullName,
            Roles = user.Roles.Select(r => new RoleDto
            {
                RoleId = r.RoleId,
                RoleName = r.RoleName,
                DisplayName = RoleHelper.GetDisplayName(r.RoleId)
            }).ToList()
        };
    }

    public async Task<LoginResponseDto> GoogleLoginAsync(GoogleLoginRequestDto request)
    {
        // Verify Google ID token
        var payload = await GoogleJsonWebSignature.ValidateAsync(request.Credential);

        if (payload == null)
            throw new UnauthorizedAccessException("Thông tin đăng nhập Google không hợp lệ");

        var email = payload.Email;
        var name = payload.Name ?? email.Split('@')[0];
        var googleId = payload.Subject; // Google User ID

        // Check if user exists by Google ID or Email
        var user = await _userRepository.GetByGoogleIdWithRolesAsync(googleId);

        if (user == null)
        {
            // Try to find by email
            user = await _userRepository.GetByEmailWithRolesAsync(email);

            if (user != null)
            {
                // Link Google ID to existing account
                if (string.IsNullOrEmpty(user.GoogleId))
                {
                    user.GoogleId = googleId;
                    await _userRepository.UpdateAsync(user);
                }

                // ĐẢM BẢO USER LUÔN CÓ ÍT NHẤT 1 ROLE
                if (!user.Roles.Any())
                {
                    user.Roles.Add(new Role { RoleId = 3 });
                    await _userRepository.UpdateAsync(user);
                }
            }
            else
            {
                // Create new user with Google account
                user = new User
                {
                    Email = email,
                    UserName = email.Split('@')[0],
                    FullName = name,
                    GoogleId = googleId,
                    PassWord = BCrypt.Net.BCrypt.HashPassword(Guid.NewGuid().ToString()), // Random password
                    // RoleId = 3, // User role
                    StatusId = 1, // Active
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow,
                    IsDeleted = false,
                };
                user.Roles.Add(new Role { RoleId = 3 }); // Customer
                await _userRepository.CreateAsync(user);
            }
        }

        // Check if user is active
        if (user.StatusId != 1)
            throw new UnauthorizedAccessException("Tài khoản của bạn chưa được kích hoạt");

        // Update LastLogin
        user.LastLogin = DateTime.UtcNow;
        await _userRepository.UpdateAsync(user);

        // Reload user with Role navigation property after update
        // user = await _userRepository.GetByEmailAsync(user.Email);
        // if (user == null)
        //     throw new UnauthorizedAccessException("Failed to reload user data");

        var token = _jwtService.GenerateToken(user);

        return new LoginResponseDto
        {
            Token = token,
            Message = "Đăng nhập Google thành công",
            // Role = user.Role?.RoleName ?? "Unknown",
            UserId = user.UserId,
            UserName = user.UserName,
            Email = user.Email,
            FullName = user.FullName,
            Roles = user.Roles.Select(r => new RoleDto
            {
                RoleId = r.RoleId,
                RoleName = r.RoleName,
                DisplayName = r.RoleId switch
                {
                    1 => "Quản trị viên",
                    2 => "Chủ sân",
                    3 => "Khách hàng",
                    _ => "Không xác định"
                }
            }).ToList()
        };
    }

    public async Task<bool> RequestPasswordResetAsync(PasswordResetRequestDto request)
    {
        var user = await _userRepository.GetByEmailWithRolesAsync(request.Email);

        if (user == null)
        {
            // Return true anyway to prevent email enumeration
            return true;
        }

        // Generate reset token (GUID for security)
        var resetToken = Guid.NewGuid().ToString();

        // Store token with expiration (1 hour for better UX)
        var expiryTime = DateTime.Now.AddHours(1);
        user.ResetToken = resetToken;
        user.ResetTokenExpiry = expiryTime;
        user.UpdatedAt = DateTime.Now;

        Console.WriteLine($"Creating reset token for {user.Email}");
        Console.WriteLine($"Token: {resetToken}");
        Console.WriteLine($"Current Local Time: {DateTime.Now}");
        Console.WriteLine($"Expiry Time: {expiryTime}");

        await _userRepository.UpdateAsync(user);

        // Send email with reset token
        await _emailService.SendPasswordResetEmailAsync(user.Email, resetToken, user.FullName ?? user.UserName);

        return true;
    }

    public async Task<bool> ResetPasswordAsync(PasswordResetConfirmDto request)
    {
        var user = await _userRepository.GetByResetTokenAsync(request.Token);

        if (user == null)
            throw new UnauthorizedAccessException("Mã xác thực không hợp lệ");

        // Validate token expiry with debug logging
        var currentTime = DateTime.Now;
        var expiryTime = user.ResetTokenExpiry;

        Console.WriteLine($"Current Local Time: {currentTime}");
        Console.WriteLine($"Token Expiry Time: {expiryTime}");
        Console.WriteLine($"Is Expired: {expiryTime == null || expiryTime < currentTime}");

        if (expiryTime == null)
            throw new UnauthorizedAccessException("Mã xác thực không có thời gian hết hạn");

        if (expiryTime.Value < currentTime)
            throw new UnauthorizedAccessException(
                $"Mã xác thực đã hết hạn. Hết hạn lúc: {expiryTime}, Hiện tại: {currentTime}");

        // Hash new password
        user.PassWord = BCrypt.Net.BCrypt.HashPassword(request.NewPassword);
        user.UpdatedAt = DateTime.Now;

        // Clear reset token fields
        user.ResetToken = null;
        user.ResetTokenExpiry = null;

        await _userRepository.UpdateAsync(user);

        return true;
    }

    public async Task<LoginResponseDto> RegisterAsync(RegisterRequestDto request)
    {
        // Check if user already exists
        var existingUser = await _userRepository.GetByEmailWithRolesAsync(request.Email);
        if (existingUser != null)
            throw new InvalidOperationException("Email này đã được đăng ký");

        // Create new user with BCrypt hashed password
        var user = new User
        {
            Email = request.Email,
            UserName = request.UserName,
            FullName = request.FullName,
            Phone = request.Phone,
            PassWord = BCrypt.Net.BCrypt.HashPassword(request.Password),
            // RoleId = 3, // Customer role by default
            StatusId = 1, // Active
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow,
            IsDeleted = false,
        };
        user.Roles.Add(new Role { RoleId = 3 }); // Customer

        await _userRepository.CreateAsync(user);

        // Reload user with Role for token generation
        // user = await _userRepository.GetByEmailAsync(user.Email);
        // if (user == null)
        //     throw new InvalidOperationException("Failed to create user");

        var token = _jwtService.GenerateToken(user);

        return new LoginResponseDto
        {
            Token = token,
            Message = "Đăng ký thành công",
            // Role = user.Role?.RoleName ?? "Unknown",
            UserId = user.UserId,
            UserName = user.UserName,
            Email = user.Email,
            FullName = user.FullName,
            Roles = user.Roles.Select(r => new RoleDto
            {
                RoleId = r.RoleId,
                RoleName = r.RoleName,
                DisplayName = "Khách hàng"
            }).ToList()
        };
    }
}