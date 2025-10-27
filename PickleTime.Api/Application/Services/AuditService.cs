using System.Text.Json;
using PickleTime.Api.Domain.Entities;
using PickleTime.Api.Infrastructure.Data;

namespace PickleTime.Api.Application.Services;

public interface IAuditService
{
    Task LogAsync(string action, string entityType, int entityId, int actorUserId, int? targetUserId = null, object? details = null);
    Task LogUserActionAsync(string action, int actorUserId, int targetUserId, object? details = null);
    Task LogFailedActionAsync(string action, string entityType, int entityId, int actorUserId, string errorMessage);
}

public class AuditService : IAuditService
{
    private readonly PickleTimeDbContext _context;
    private readonly IHttpContextAccessor _httpContextAccessor;

    public AuditService(PickleTimeDbContext context, IHttpContextAccessor httpContextAccessor)
    {
        _context = context;
        _httpContextAccessor = httpContextAccessor;
    }

    public async Task LogAsync(string action, string entityType, int entityId, int actorUserId, int? targetUserId = null, object? details = null)
    {
        var httpContext = _httpContextAccessor.HttpContext;
        
        var auditLog = new AuditLog
        {
            Action = action,
            EntityType = entityType,
            EntityId = entityId,
            ActorUserId = actorUserId,
            TargetUserId = targetUserId,
            Details = details != null ? JsonSerializer.Serialize(details) : null,
            IpAddress = GetClientIpAddress(httpContext),
            UserAgent = httpContext?.Request.Headers["User-Agent"].ToString(),
            Result = "SUCCESS",
            CreatedAt = DateTime.UtcNow
        };

        // TODO: AuditLogs table not in current schema - add later
        // _context.AuditLogs.Add(auditLog);
        // await _context.SaveChangesAsync();
        await Task.CompletedTask; // Placeholder
    }

    public async Task LogUserActionAsync(string action, int actorUserId, int targetUserId, object? details = null)
    {
        await LogAsync(action, "USER", targetUserId, actorUserId, targetUserId, details);
    }

    public async Task LogFailedActionAsync(string action, string entityType, int entityId, int actorUserId, string errorMessage)
    {
        var httpContext = _httpContextAccessor.HttpContext;
        
        var auditLog = new AuditLog
        {
            Action = action,
            EntityType = entityType,
            EntityId = entityId,
            ActorUserId = actorUserId,
            IpAddress = GetClientIpAddress(httpContext),
            UserAgent = httpContext?.Request.Headers["User-Agent"].ToString(),
            Result = "FAILED",
            ErrorMessage = errorMessage,
            CreatedAt = DateTime.UtcNow
        };

        // TODO: AuditLogs table not in current schema - add later
        // _context.AuditLogs.Add(auditLog);
        // await _context.SaveChangesAsync();
        await Task.CompletedTask; // Placeholder
    }

    private string? GetClientIpAddress(HttpContext? httpContext)
    {
        if (httpContext == null) return null;
        
        // Check for forwarded IP first (for load balancers/proxies)
        var forwardedFor = httpContext.Request.Headers["X-Forwarded-For"].FirstOrDefault();
        if (!string.IsNullOrEmpty(forwardedFor))
        {
            var ip = forwardedFor.Split(',').FirstOrDefault()?.Trim();
            if (!string.IsNullOrEmpty(ip)) return ip;
        }

        // Check X-Real-IP header
        var realIp = httpContext.Request.Headers["X-Real-IP"].FirstOrDefault();
        if (!string.IsNullOrEmpty(realIp)) return realIp;

        // Fallback to direct connection IP
        return httpContext.Connection.RemoteIpAddress?.ToString();
    }
}