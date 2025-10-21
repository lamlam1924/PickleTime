using PickleTime.Api.Application.Contract.Auth.Dto;
using PickleTime.Api.Application.Contracts.Auth;
using PickleTime.Api.Application.Contracts.Auth.Dtos;
using PickleTime.Api.Common.Helpers;
using BCrypt.Net;

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
        var user = await _userRepository.GetByEmailAsync(request.Email);

        if (user == null)
            throw new UnauthorizedAccessException("Invalid email or password");

        // Verify password with BCrypt
        if (!BCrypt.Net.BCrypt.Verify(request.Password, user.PassWord))
            throw new UnauthorizedAccessException("Invalid email or password");

        // Check if user is active
        if (user.StatusId != 1) // 1 = Active
            throw new UnauthorizedAccessException("Your account is not active");

        // Update LastLogin
        user.LastLogin = DateTime.UtcNow;
        await _userRepository.UpdateAsync(user);
        
        // Reload user with Role navigation property after update
        user = await _userRepository.GetByEmailAsync(user.Email);
        if (user == null)
            throw new UnauthorizedAccessException("Failed to reload user data");

        var token = _jwtService.GenerateToken(user);

        return new LoginResponseDto
        {
            Token = token,
            Message = "Login successful",
            Role = user.Role?.RoleName ?? "Unknown",
            UserId = user.UserId,
            UserName = user.UserName,
            Email = user.Email,
            FullName = user.FullName
        };
    }

    public async Task<LoginResponseDto> GoogleLoginAsync(GoogleLoginRequestDto request)
    {
        // Verify Google ID token
        var payload = await Google.Apis.Auth.GoogleJsonWebSignature.ValidateAsync(request.Credential);
        
        if (payload == null)
            throw new UnauthorizedAccessException("Invalid Google credential");

        string email = payload.Email;
        string name = payload.Name ?? email.Split('@')[0];
        string googleId = payload.Subject; // Google User ID
        
        // Check if user exists by Google ID or Email
        var user = await _userRepository.GetByGoogleIdAsync(googleId);
        
        if (user == null)
        {
            // Try to find by email
            user = await _userRepository.GetByEmailAsync(email);
            
            if (user != null)
            {
                // Link Google ID to existing account
                user.GoogleId = googleId;
                await _userRepository.UpdateAsync(user);
            }
            else
            {
                // Create new user with Google account
                user = new Domain.Entities.User
                {
                    Email = email,
                    UserName = email.Split('@')[0],
                    FullName = name,
                    GoogleId = googleId,
                    PassWord = BCrypt.Net.BCrypt.HashPassword(Guid.NewGuid().ToString()), // Random password
                    RoleId = 3, // User role
                    StatusId = 1, // Active
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow,
                    IsDeleted = false
                };
                
                await _userRepository.CreateAsync(user);
            }
        }

        // Check if user is active
        if (user.StatusId != 1)
            throw new UnauthorizedAccessException("Your account is not active");

        // Update LastLogin
        user.LastLogin = DateTime.UtcNow;
        await _userRepository.UpdateAsync(user);
        
        // Reload user with Role navigation property after update
        user = await _userRepository.GetByEmailAsync(user.Email);
        if (user == null)
            throw new UnauthorizedAccessException("Failed to reload user data");

        var token = _jwtService.GenerateToken(user);

        return new LoginResponseDto
        {
            Token = token,
            Message = "Google login successful",
            Role = user.Role?.RoleName ?? "Unknown",
            UserId = user.UserId,
            UserName = user.UserName,
            Email = user.Email,
            FullName = user.FullName
        };
    }

    public async Task<bool> RequestPasswordResetAsync(PasswordResetRequestDto request)
    {
        var user = await _userRepository.GetByEmailAsync(request.Email);

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
            throw new UnauthorizedAccessException("Invalid reset token");

        // Validate token expiry with debug logging
        var currentTime = DateTime.Now;
        var expiryTime = user.ResetTokenExpiry;
        
        Console.WriteLine($"Current Local Time: {currentTime}");
        Console.WriteLine($"Token Expiry Time: {expiryTime}");
        Console.WriteLine($"Is Expired: {expiryTime == null || expiryTime < currentTime}");
        
        if (expiryTime == null)
            throw new UnauthorizedAccessException("Reset token has no expiry time");
            
        if (expiryTime.Value < currentTime)
            throw new UnauthorizedAccessException($"Reset token has expired. Expiry: {expiryTime}, Current: {currentTime}");

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
        var existingUser = await _userRepository.GetByEmailAsync(request.Email);
        if (existingUser != null)
            throw new InvalidOperationException("Email already registered");

        // Create new user with BCrypt hashed password
        var user = new Domain.Entities.User
        {
            Email = request.Email,
            UserName = request.UserName,
            FullName = request.FullName,
            Phone = request.Phone,
            PassWord = BCrypt.Net.BCrypt.HashPassword(request.Password),
            RoleId = 3, // Customer role by default
            StatusId = 1, // Active
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow,
            IsDeleted = false
        };

        await _userRepository.CreateAsync(user);

        // Reload user with Role for token generation
        user = await _userRepository.GetByEmailAsync(user.Email);
        if (user == null)
            throw new InvalidOperationException("Failed to create user");

        var token = _jwtService.GenerateToken(user);

        return new LoginResponseDto
        {
            Token = token,
            Message = "Registration successful",
            Role = user.Role?.RoleName ?? "Unknown",
            UserId = user.UserId,
            UserName = user.UserName,
            Email = user.Email,
            FullName = user.FullName
        };
    }
}