namespace PickleTime.Api.Domain.Entities;

public class AuditLog
{
    public int AuditLogId { get; set; }
    
    /// <summary>
    /// User ID who performed the action
    /// </summary>
    public int ActorUserId { get; set; }
    
    /// <summary>
    /// Target User ID (if the action is on another user)
    /// </summary>
    public int? TargetUserId { get; set; }
    
    /// <summary>
    /// Action performed (UPDATE_USER, DELETE_USER, RESTORE_USER, UPDATE_STATUS, etc.)
    /// </summary>
    public string Action { get; set; } = null!;
    
    /// <summary>
    /// Entity type being acted upon (USER, BOOKING, etc.)
    /// </summary>
    public string EntityType { get; set; } = "USER";
    
    /// <summary>
    /// Entity ID (e.g., UserId, BookingId)
    /// </summary>
    public int EntityId { get; set; }
    
    /// <summary>
    /// JSON details of what changed
    /// </summary>
    public string? Details { get; set; }
    
    /// <summary>
    /// IP Address of the action
    /// </summary>
    public string? IpAddress { get; set; }
    
    /// <summary>
    /// User agent (browser info)
    /// </summary>
    public string? UserAgent { get; set; }
    
    /// <summary>
    /// When the action was performed
    /// </summary>
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    /// <summary>
    /// Result of the action (SUCCESS, FAILED, UNAUTHORIZED)
    /// </summary>
    public string Result { get; set; } = "SUCCESS";
    
    /// <summary>
    /// Error message if action failed
    /// </summary>
    public string? ErrorMessage { get; set; }
    
    // Navigation properties
    public virtual User ActorUser { get; set; } = null!;
    public virtual User? TargetUser { get; set; }
}