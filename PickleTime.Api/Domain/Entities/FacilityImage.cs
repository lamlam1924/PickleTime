using System;
using System.Collections.Generic;

namespace PickleTime.Api.Domain.Entities;

public partial class FacilityImage
{
    public int ImageId { get; set; }

    public int FacilityId { get; set; }

    public string ImageUrl { get; set; } = null!;

    public bool IsMainImage { get; set; }

    public int DisplayOrder { get; set; }

    public string? Description { get; set; }

    public int? CourtImageId { get; set; }

    public bool IsDeleted { get; set; }

    public string? PublicId { get; set; }

    public virtual CourtImage? CourtImage { get; set; }

    public virtual Facility Facility { get; set; } = null!;
}
