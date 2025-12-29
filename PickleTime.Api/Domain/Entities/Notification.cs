using System;
using System.Collections.Generic;

namespace PickleTime.Api.Domain.Entities;

public partial class Notification
{
    public long Id { get; set; }

    public int TypeId { get; set; }

    public string Title { get; set; } = null!;

    public string? Message { get; set; }

    public long? RequestId { get; set; }

    public DateTime CreatedAt { get; set; }

    public bool IsDeleted { get; set; }

    public virtual ICollection<NotificationStatus> NotificationStatuses { get; set; } = new List<NotificationStatus>();

    public virtual NotificationType Type { get; set; } = null!;
}
