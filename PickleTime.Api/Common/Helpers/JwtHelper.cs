using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace PickleTime.Api.Common.Helpers;

public static class JwtHelper
{
    // Hàm lấy UserId từ ClaimsPrincipal
    public static int GetUserId(ClaimsPrincipal user)
    {
        if (user == null)
            throw new ArgumentNullException(nameof(user));

        var userIdClaim = user.FindFirst(JwtRegisteredClaimNames.Sub)?.Value
                          ?? user.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        if (string.IsNullOrEmpty(userIdClaim))
            throw new UnauthorizedAccessException("Missing UserId in token.");

        if (!int.TryParse(userIdClaim, out int userId))
            throw new UnauthorizedAccessException("Invalid UserId in token.");

        return userId;
    }
}