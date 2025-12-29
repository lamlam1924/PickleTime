using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PickleTime.Api.Application.Contract.Auth.Dto;
using PickleTime.Api.Application.Contracts.Auth;
using PickleTime.Api.Application.Contracts.Auth.Dtos;
using PickleTime.Api.Common.Exceptions;

namespace PickleTime.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;
    private readonly IRoleSwitchService _roleSwitchService;

    public AuthController(IAuthService authService, IRoleSwitchService roleSwitchService)
    {
        _authService = authService;
        _roleSwitchService = roleSwitchService;
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequestDto request)
    {
        try
        {
            var result = await _authService.LoginAsync(request);
            return Ok(result);
        }
        catch (UnauthorizedAccessException ex)
        {
            return Unauthorized(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            // Log the full exception for debugging
            Console.WriteLine($"Login error: {ex.Message}");
            Console.WriteLine($"Stack trace: {ex.StackTrace}");
            return StatusCode(500, new { message = "An error occurred during login", details = ex.Message });
        }
    }

    [HttpGet("google-login")]
    public IActionResult GoogleLoginRedirect()
    {
        // Build Google OAuth URL manually
        var clientId = "32187435926-56kge5ab9q02ou9ic2uv658h6uf0e4ep.apps.googleusercontent.com";
        var redirectUri = "http://localhost:5104/signin-google";
        var scope = "openid profile email";

        var googleAuthUrl = $"https://accounts.google.com/o/oauth2/v2/auth?" +
                            $"client_id={Uri.EscapeDataString(clientId)}&" +
                            $"redirect_uri={Uri.EscapeDataString(redirectUri)}&" +
                            $"response_type=code&" +
                            $"scope={Uri.EscapeDataString(scope)}&" +
                            $"access_type=offline&" +
                            $"prompt=select_account";

        return Redirect(googleAuthUrl);
    }

    [HttpGet("/signin-google")]
    public async Task<IActionResult> GoogleCallback([FromQuery] string? code, [FromQuery] string? error)
    {
        if (!string.IsNullOrEmpty(error))
        {
            return Redirect($"http://localhost:5174/login?error={Uri.EscapeDataString(error)}");
        }

        if (string.IsNullOrEmpty(code))
        {
            return Redirect("http://localhost:5174/login?error=no_authorization_code");
        }

        try
        {
            // Exchange code for tokens
            var clientId = "32187435926-56kge5ab9q02ou9ic2uv658h6uf0e4ep.apps.googleusercontent.com";
            var clientSecret = "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";
            var redirectUri = "http://localhost:5104/signin-google";

            using var httpClient = new HttpClient();
            var tokenRequest = new Dictionary<string, string>
            {
                { "code", code },
                { "client_id", clientId },
                { "client_secret", clientSecret },
                { "redirect_uri", redirectUri },
                { "grant_type", "authorization_code" }
            };

            var tokenResponse = await httpClient.PostAsync(
                "https://oauth2.googleapis.com/token",
                new FormUrlEncodedContent(tokenRequest)
            );

            var tokenContent = await tokenResponse.Content.ReadAsStringAsync();
            var tokenData = System.Text.Json.JsonSerializer.Deserialize<Dictionary<string, object>>(tokenContent);

            if (!tokenData.ContainsKey("id_token"))
            {
                return Redirect("http://localhost:5174/login?error=no_id_token");
            }

            var idToken = tokenData["id_token"].ToString();

            // Verify and use the ID token
            var request = new GoogleLoginRequestDto { Credential = idToken };
            var result = await _authService.GoogleLoginAsync(request);
            var rolesJson = Uri.EscapeDataString(
                System.Text.Json.JsonSerializer.Serialize(result.Roles)
            );
            // Redirect to frontend with all user info
            var redirectUrl = ($"http://localhost:5174/auth/google-success?" +
                               $"token={result.Token}&" +
                               // $"role={Uri.EscapeDataString(result.Role)}&" +
                               $"userId={result.UserId}&" +
                               $"email={Uri.EscapeDataString(result.Email)}&" +
                               $"userName={Uri.EscapeDataString(result.UserName)}&" +
                               $"fullName={Uri.EscapeDataString(result.FullName)}&") +
                              $"roles={rolesJson}&" +
                              $"hasMultipleRoles={result.HasMultipleRoles}";
            return Redirect(redirectUrl);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Google callback error: {ex.Message}");
            return Redirect($"http://localhost:5174/login?error={Uri.EscapeDataString(ex.Message)}");
        }
    }

    [HttpPost("google-login")]
    public async Task<IActionResult> GoogleLogin([FromBody] GoogleLoginRequestDto request)
    {
        try
        {
            var result = await _authService.GoogleLoginAsync(request);
            return Ok(result);
        }
        catch (UnauthorizedAccessException ex)
        {
            return Unauthorized(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPost("request-password-reset")]
    [AllowAnonymous]
    public async Task<IActionResult> RequestPasswordReset([FromBody] PasswordResetRequestDto request)
    {
        try
        {
            await _authService.RequestPasswordResetAsync(request);
            return Ok(new { message = "If your email exists in our system, you will receive a password reset link." });
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPost("reset-password")]
    [AllowAnonymous]
    public async Task<IActionResult> ResetPassword([FromBody] PasswordResetConfirmDto request)
    {
        try
        {
            await _authService.ResetPasswordAsync(request);
            return Ok(new { message = "Password reset successfully." });
        }
        catch (UnauthorizedAccessException ex)
        {
            return Unauthorized(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterRequestDto request)
    {
        try
        {
            var result = await _authService.RegisterAsync(request);
            return Ok(result);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [Authorize]
    [HttpPost("select-role")]
    public async Task<IActionResult> SelectRole([FromBody] SelectRoleRequest request)
    {
        try
        {
            var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier)
                              ?? User.FindFirstValue(JwtRegisteredClaimNames.Sub)
                              ?? throw new UnauthorizedAccessException("User ID claim not found");

            var userId = int.Parse(userIdClaim);

            Console.WriteLine($"[SelectRole] UserId from token: {userId}, Requested roleId: {request.RoleId}");

            var result = await _roleSwitchService.SwitchRoleAsync(userId, request.RoleId);
            return Ok(result);
        }
        catch (ForbidException ex)
        {
            return StatusCode(403, new { message = ex.Message });
        }
        catch (UnauthorizedAccessException ex)
        {
            return Unauthorized(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            Console.WriteLine($"[SelectRole] Error: {ex.Message}");
            return StatusCode(500, new { message = "An error occurred while switching role", details = ex.Message });
        }
    }
}