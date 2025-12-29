using System;
using System.Collections.Generic;

namespace PickleTime.Api.Domain.Entities;

public partial class FacilityAmenity
{
    public int FacilityId { get; set; }

    public int AmenityId { get; set; }

    public DateTime CreatedAt { get; set; }

    public virtual Amenity Amenity { get; set; } = null!;

    public virtual Facility Facility { get; set; } = null!;
}
