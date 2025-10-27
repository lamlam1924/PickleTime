using System;
using System.Collections.Generic;

namespace PickleTime.Api.Domain.Entities;

public partial class CourtImage
{
    public int ImageId { get; set; }

    public int CourtId { get; set; }

    public string ImageUrl { get; set; } = null!;

    public bool IsMainImage { get; set; }

    public string? Description { get; set; }

    public int DisplayOrder { get; set; }

    public bool IsDeleted { get; set; }

    public string? PublicId { get; set; }

    public virtual Court Court { get; set; } = null!;

    public virtual ICollection<FacilityImage> FacilityImages { get; set; } = new List<FacilityImage>();
}
