using System;
using System.Collections.Generic;

namespace PickleTime.Api.Domain.Entities;

public partial class OwnerRequest
{
    public int RequestId { get; set; }

    public string FullName { get; set; } = null!;

    public string Email { get; set; } = null!;

    public string Phone { get; set; } = null!;

    public int StatusId { get; set; }

    public DateTime SubmittedAt { get; set; }

    public DateTime? ReviewedAt { get; set; }

    public int? ReviewedBy { get; set; }

    public string? AdminNote { get; set; }

    public int? CreatedUserId { get; set; }

    public virtual User? CreatedUser { get; set; }

    public virtual User? ReviewedByNavigation { get; set; }

    public virtual RequestStatus Status { get; set; } = null!;
}
