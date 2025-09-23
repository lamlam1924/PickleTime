using System;
using System.Collections.Generic;

namespace PickleTime.Api.Domain.Entities;

public partial class Payment
{
    public int PaymentId { get; set; }

    public int BookingId { get; set; }

    public int? PaymentMethodId { get; set; }

    public string TransactionId { get; set; } = null!;

    public decimal Amount { get; set; }

    public int PaymentStatusId { get; set; }

    public DateTime PaymentDate { get; set; }

    public string? PaymentDetails { get; set; }

    public decimal? RefundAmount { get; set; }

    public DateTime? RefundDate { get; set; }

    public bool IsDeleted { get; set; }

    public virtual Booking Booking { get; set; } = null!;

    public virtual PaymentMethod? PaymentMethod { get; set; }

    public virtual PaymentStatus PaymentStatus { get; set; } = null!;
}
