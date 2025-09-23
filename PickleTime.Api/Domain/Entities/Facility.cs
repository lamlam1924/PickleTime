using System;
using System.Collections.Generic;

namespace PickleTime.Api.Domain.Entities;

public partial class Facility
{
    public int FacilityId { get; set; }

    public string FacilityName { get; set; } = null!;

    public string Address { get; set; } = null!;

    public string Province { get; set; } = null!;

    public string District { get; set; } = null!;

    public string Ward { get; set; } = null!;

    public string? Phone { get; set; }

    public string? Email { get; set; }

    public int? ManagerUserId { get; set; }

    public string? Description { get; set; }

    public string? Amenities { get; set; }

    public int StatusId { get; set; }

    public decimal? Rating { get; set; }

    public int? TotalRatings { get; set; }

    public TimeOnly OpenTime { get; set; }

    public TimeOnly CloseTime { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }

    public bool IsDeleted { get; set; }

    public virtual ICollection<Court> Courts { get; set; } = new List<Court>();

    public virtual ICollection<FacilityOperatingHour> FacilityOperatingHours { get; set; } = new List<FacilityOperatingHour>();

    public virtual User? ManagerUser { get; set; }

    public virtual ICollection<Review> Reviews { get; set; } = new List<Review>();

    public virtual FacilityStatus Status { get; set; } = null!;
}
