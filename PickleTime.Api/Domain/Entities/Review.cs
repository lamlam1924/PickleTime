using System;
using System.Collections.Generic;

namespace PickleTime.Api.Domain.Entities;

public partial class Review
{
    public int ReviewId { get; set; }

    public int FacilityId { get; set; }

    public int? CourtId { get; set; }

    public int UserId { get; set; }

    public int? BookingId { get; set; }

    public int Rating { get; set; }

    public string? Comment { get; set; }

    public string? Aspects { get; set; }

    public DateTime ReviewDate { get; set; }

    public int ReviewStatusId { get; set; }

    public bool IsVerifiedBooking { get; set; }

    public bool IsDeleted { get; set; }

    public virtual Booking? Booking { get; set; }

    public virtual Court? Court { get; set; }

    public virtual Facility Facility { get; set; } = null!;

    public virtual ReviewStatus ReviewStatus { get; set; } = null!;

    public virtual User User { get; set; } = null!;
}
