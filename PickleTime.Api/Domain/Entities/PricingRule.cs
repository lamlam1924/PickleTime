using System;
using System.Collections.Generic;

namespace PickleTime.Api.Domain.Entities;

public partial class PricingRule
{
    public int PricingId { get; set; }

    public int CourtId { get; set; }

    public string DayType { get; set; } = null!;

    public TimeOnly TimeSlotStart { get; set; }

    public TimeOnly TimeSlotEnd { get; set; }

    public decimal PricePerHour { get; set; }

    public DateOnly EffectiveFrom { get; set; }

    public DateOnly? EffectiveTo { get; set; }

    public bool IsActive { get; set; }

    public DateTime CreatedAt { get; set; }

    public virtual Court Court { get; set; } = null!;
}
