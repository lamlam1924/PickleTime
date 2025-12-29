using System;
using System.Collections.Generic;

namespace PickleTime.Api.Domain.Entities;

public partial class NotificationType
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public bool IsActive { get; set; }

    public DateTime CreatedAt { get; set; }

    public virtual ICollection<Notification> Notifications { get; set; } = new List<Notification>();
}
