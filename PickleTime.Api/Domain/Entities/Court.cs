using System;
using System.Collections.Generic;

namespace PickleTime.Api.Domain.Entities;

public partial class Court
{
    public int CourtId { get; set; }

    public int FacilityId { get; set; }

    public string CourtName { get; set; } = null!;

    public int TypeId { get; set; }

    public int SurfaceId { get; set; }

    public bool IsIndoor { get; set; }

    public bool HasLighting { get; set; }

    public int StatusId { get; set; }

    public string? Description { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }

    public bool IsDeleted { get; set; }

    public virtual ICollection<BookingDetail> BookingDetails { get; set; } = new List<BookingDetail>();

    public virtual ICollection<BookingHold> BookingHolds { get; set; } = new List<BookingHold>();

    public virtual CourtImage? CourtImage { get; set; }

    public virtual ICollection<CourtMaintenance> CourtMaintenances { get; set; } = new List<CourtMaintenance>();

    public virtual Facility Facility { get; set; } = null!;

    public virtual ICollection<PricingRule> PricingRules { get; set; } = new List<PricingRule>();

    public virtual ICollection<Review> Reviews { get; set; } = new List<Review>();

    public virtual CourtStatus Status { get; set; } = null!;

    public virtual CourtSurface Surface { get; set; } = null!;

    public virtual ICollection<TimeSlot> TimeSlots { get; set; } = new List<TimeSlot>();

    public virtual CourtType Type { get; set; } = null!;
}
