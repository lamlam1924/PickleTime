using System;
using System.Collections.Generic;

namespace PickleTime.Api.Domain.Entities;

public partial class NotificationStatus
{
    public long Id { get; set; }

    public long NotificationId { get; set; }

    public int UserId { get; set; }

    public bool IsRead { get; set; }

    public DateTime CreatedAt { get; set; }

    public bool IsDeleted { get; set; }

    public virtual Notification Notification { get; set; } = null!;

    public virtual User User { get; set; } = null!;
}
