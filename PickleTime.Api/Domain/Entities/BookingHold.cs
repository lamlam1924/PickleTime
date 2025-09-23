using System;
using System.Collections.Generic;

namespace PickleTime.Api.Domain.Entities;

public partial class BookingHold
{
    public int HoldId { get; set; }

    public int CourtId { get; set; }

    public DateOnly SlotDate { get; set; }

    public TimeOnly StartTime { get; set; }

    public TimeOnly EndTime { get; set; }

    public int? UserId { get; set; }

    public DateTime ExpiresAt { get; set; }

    public int BookingHoldStatusId { get; set; }

    public DateTime CreatedAt { get; set; }

    public virtual BookingHoldStatus BookingHoldStatus { get; set; } = null!;

    public virtual Court Court { get; set; } = null!;

    public virtual User? User { get; set; }
}
