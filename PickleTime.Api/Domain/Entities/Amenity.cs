using System;
using System.Collections.Generic;

namespace PickleTime.Api.Domain.Entities;

public partial class Amenity
{
    public int AmenityId { get; set; }

    public string AmenityCode { get; set; } = null!;

    public string AmenityName { get; set; } = null!;

    public string? Description { get; set; }

    public bool IsActive { get; set; }

    public virtual ICollection<FacilityAmenity> FacilityAmenities { get; set; } = new List<FacilityAmenity>();
}
