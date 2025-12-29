using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using PickleTime.Api.Domain.Entities;

namespace PickleTime.Api.Application.Services;

public class JwtService
{
    private readonly IConfiguration _config;

    public JwtService(IConfiguration config)
    {
        _config = config;
    }

    public string GenerateToken(User user, int? selectedRoleId = null)
    {
        var roles = user.Roles?.ToList() ?? [];
        if (roles.Count == 0)
            roles.Add(new Role { RoleId = 3, RoleName = "Customer" });
        // - Có selectedRoleId → dùng nó
        // - Không có → chỉ tự động chọn nếu có đúng 1 role
        // - Có ≥2 role → KHÔNG tự chọn, để frontend xử lý
        Role? activeRole = selectedRoleId.HasValue
            ? roles.FirstOrDefault(r => r.RoleId == selectedRoleId.Value)
            : roles.Count == 1
                ? roles[0]
                : null; // ← QUAN TRỌNG: null → frontend sẽ thấy và đẩy về /select-role

        // NẾU activeRole == null → KHÔNG fallback về Customer!
        // → Đây là điểm khác biệt giữa "tốt" và "hoàn hảo"
        var finalRoleId = activeRole?.RoleId ?? 0; // 0 = chưa chọn role
        var finalRoleName = activeRole?.RoleName ?? "None";
        var claims = new List<Claim>
        {
            new Claim(JwtRegisteredClaimNames.Sub, user.UserId.ToString()),
            new Claim(JwtRegisteredClaimNames.Email, user.Email),
            new Claim(ClaimTypes.Name, user.FullName ?? user.UserName),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),

            new Claim(ClaimTypes.Role, finalRoleName),
            new Claim("role", finalRoleName),
            new Claim("roleId", finalRoleId.ToString()),
            new Claim("roles", string.Join(",", roles.Select(r => r.RoleId)))
        };

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]!));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: _config["Jwt:Issuer"],
            audience: _config["Jwt:Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddHours(24),
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}