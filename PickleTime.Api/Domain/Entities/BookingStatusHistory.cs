using System;
using System.Collections.Generic;

namespace PickleTime.Api.Domain.Entities;

public partial class BookingStatusHistory
{
    public int HistoryId { get; set; }

    public int BookingId { get; set; }

    public string? OldStatus { get; set; }

    public string NewStatus { get; set; } = null!;

    public int? ChangedByUserId { get; set; }

    public DateTime ChangedAt { get; set; }

    public string? Note { get; set; }

    public virtual Booking Booking { get; set; } = null!;

    public virtual User? ChangedByUser { get; set; }
}
