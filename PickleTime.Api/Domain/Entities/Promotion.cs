using System;
using System.Collections.Generic;

namespace PickleTime.Api.Domain.Entities;

public partial class Promotion
{
    public int PromotionId { get; set; }

    public string Code { get; set; } = null!;

    public string Title { get; set; } = null!;

    public string? Description { get; set; }

    public string DiscountType { get; set; } = null!;

    public decimal DiscountValue { get; set; }

    public decimal MinimumBookingAmount { get; set; }

    public decimal? MaximumDiscount { get; set; }

    public int UsageLimit { get; set; }

    public int UsageCount { get; set; }

    public DateTime StartDate { get; set; }

    public DateTime EndDate { get; set; }

    public string? ApplicableCourtTypes { get; set; }

    public string? ApplicableDays { get; set; }

    public int PromotionStatusId { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }

    public bool IsDeleted { get; set; }

    public virtual PromotionStatus PromotionStatus { get; set; } = null!;
}
