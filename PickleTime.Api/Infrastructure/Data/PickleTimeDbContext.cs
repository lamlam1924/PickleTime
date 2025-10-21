using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using PickleTime.Api.Domain.Entities;

namespace PickleTime.Api.Infrastructure.Data;

public partial class PickleTimeDbContext : DbContext
{
    public PickleTimeDbContext()
    {
    }

    public PickleTimeDbContext(DbContextOptions<PickleTimeDbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Booking> Bookings { get; set; }

    public virtual DbSet<BookingDetail> BookingDetails { get; set; }

    public virtual DbSet<BookingHold> BookingHolds { get; set; }

    public virtual DbSet<BookingHoldStatus> BookingHoldStatuses { get; set; }

    public virtual DbSet<BookingStatus> BookingStatuses { get; set; }

    public virtual DbSet<BookingStatusHistory> BookingStatusHistories { get; set; }

    public virtual DbSet<Court> Courts { get; set; }

    public virtual DbSet<CourtImage> CourtImages { get; set; }

    public virtual DbSet<CourtMaintenance> CourtMaintenances { get; set; }

    public virtual DbSet<CourtStatus> CourtStatuses { get; set; }

    public virtual DbSet<CourtSurface> CourtSurfaces { get; set; }

    public virtual DbSet<CourtType> CourtTypes { get; set; }

    public virtual DbSet<Facility> Facilities { get; set; }

    public virtual DbSet<FacilityOperatingHour> FacilityOperatingHours { get; set; }

    public virtual DbSet<FacilityStatus> FacilityStatuses { get; set; }

    public virtual DbSet<Payment> Payments { get; set; }

    public virtual DbSet<PaymentMethod> PaymentMethods { get; set; }

    public virtual DbSet<PaymentStatus> PaymentStatuses { get; set; }

    public virtual DbSet<PricingRule> PricingRules { get; set; }

    public virtual DbSet<Promotion> Promotions { get; set; }

    public virtual DbSet<PromotionStatus> PromotionStatuses { get; set; }

    public virtual DbSet<Review> Reviews { get; set; }

    public virtual DbSet<ReviewStatus> ReviewStatuses { get; set; }

    public virtual DbSet<Role> Roles { get; set; }

    public virtual DbSet<TimeSlot> TimeSlots { get; set; }

    public virtual DbSet<TimeSlotStatus> TimeSlotStatuses { get; set; }

    public virtual DbSet<User> Users { get; set; }

    public virtual DbSet<UserStatus> UserStatuses { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        => optionsBuilder.UseSqlServer("Name=ConnectionStrings:DefaultConnection");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Booking>(entity =>
        {
            entity.HasKey(e => e.BookingId).HasName("PK__Bookings__73951ACD83738A6B");

            entity.ToTable(tb => tb.HasTrigger("TRG_Bookings_SetUpdatedAt"));

            entity.HasIndex(e => e.BookingStatusId, "IX_Bookings_Status");

            entity.HasIndex(e => e.BookingNumber, "UQ__Bookings__AAC320BFC43B5A85").IsUnique();

            entity.Property(e => e.BookingId).HasColumnName("BookingID");
            entity.Property(e => e.BookingNumber).HasMaxLength(50);
            entity.Property(e => e.BookingStatusId).HasColumnName("BookingStatusID");
            entity.Property(e => e.CancellationReason).HasMaxLength(255);
            entity.Property(e => e.CancelledAt).HasColumnType("datetime");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.CustomerEmail).HasMaxLength(100);
            entity.Property(e => e.CustomerName).HasMaxLength(100);
            entity.Property(e => e.CustomerPhone).HasMaxLength(20);
            entity.Property(e => e.DiscountAmount).HasColumnType("decimal(10, 2)");
            entity.Property(e => e.FinalAmount)
                .HasComputedColumnSql("([TotalAmount]-[DiscountAmount])", true)
                .HasColumnType("decimal(11, 2)");
            entity.Property(e => e.PaymentStatusId).HasColumnName("PaymentStatusID");
            entity.Property(e => e.TotalAmount).HasColumnType("decimal(10, 2)");
            entity.Property(e => e.UpdatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.UserId).HasColumnName("UserID");

            entity.HasOne(d => d.BookingStatus).WithMany(p => p.Bookings)
                .HasForeignKey(d => d.BookingStatusId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Bookings__Bookin__778AC167");

            entity.HasOne(d => d.PaymentStatus).WithMany(p => p.Bookings)
                .HasForeignKey(d => d.PaymentStatusId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Bookings__Paymen__787EE5A0");

            entity.HasOne(d => d.User).WithMany(p => p.Bookings)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.SetNull)
                .HasConstraintName("FK__Bookings__UserID__76969D2E");
        });

        modelBuilder.Entity<BookingDetail>(entity =>
        {
            entity.HasKey(e => e.BookingDetailId).HasName("PK__BookingD__8136D47AB1AC0B9A");

            entity.ToTable(tb => tb.HasTrigger("TRG_BookingDetails_NoOverlap"));

            entity.HasIndex(e => new { e.CourtId, e.SlotDate, e.StartTime, e.EndTime }, "IX_BookingDetails_Active").HasFilter("([IsDeleted]=(0))");

            entity.Property(e => e.BookingDetailId).HasColumnName("BookingDetailID");
            entity.Property(e => e.BookingId).HasColumnName("BookingID");
            entity.Property(e => e.CourtId).HasColumnName("CourtID");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.LineAmount).HasColumnType("decimal(10, 2)");

            entity.HasOne(d => d.Booking).WithMany(p => p.BookingDetails)
                .HasForeignKey(d => d.BookingId)
                .HasConstraintName("FK__BookingDe__Booki__7E37BEF6");

            entity.HasOne(d => d.Court).WithMany(p => p.BookingDetails)
                .HasForeignKey(d => d.CourtId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__BookingDe__Court__7F2BE32F");
        });

        modelBuilder.Entity<BookingHold>(entity =>
        {
            entity.HasKey(e => e.HoldId).HasName("PK__BookingH__6E24DA249A205139");

            entity.Property(e => e.HoldId).HasColumnName("HoldID");
            entity.Property(e => e.BookingHoldStatusId).HasColumnName("BookingHoldStatusID");
            entity.Property(e => e.CourtId).HasColumnName("CourtID");
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("(sysdatetime())");
            entity.Property(e => e.UserId).HasColumnName("UserID");

            entity.HasOne(d => d.BookingHoldStatus).WithMany(p => p.BookingHolds)
                .HasForeignKey(d => d.BookingHoldStatusId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__BookingHo__Booki__3E1D39E1");

            entity.HasOne(d => d.Court).WithMany(p => p.BookingHolds)
                .HasForeignKey(d => d.CourtId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__BookingHo__Court__3C34F16F");

            entity.HasOne(d => d.User).WithMany(p => p.BookingHolds)
                .HasForeignKey(d => d.UserId)
                .HasConstraintName("FK__BookingHo__UserI__3D2915A8");
        });

        modelBuilder.Entity<BookingHoldStatus>(entity =>
        {
            entity.HasKey(e => e.BookingHoldStatusId).HasName("PK__BookingH__B0C044E5339FC300");

            entity.HasIndex(e => e.StatusName, "UQ__BookingH__05E7698A7BF48EAC").IsUnique();

            entity.Property(e => e.BookingHoldStatusId).HasColumnName("BookingHoldStatusID");
            entity.Property(e => e.StatusName).HasMaxLength(20);
        });

        modelBuilder.Entity<BookingStatus>(entity =>
        {
            entity.HasKey(e => e.BookingStatusId).HasName("PK__BookingS__54F9C0BD40ED5DE8");

            entity.HasIndex(e => e.StatusName, "UQ__BookingS__05E7698A82C45465").IsUnique();

            entity.Property(e => e.BookingStatusId).HasColumnName("BookingStatusID");
            entity.Property(e => e.StatusName).HasMaxLength(20);
        });

        modelBuilder.Entity<BookingStatusHistory>(entity =>
        {
            entity.HasKey(e => e.HistoryId).HasName("PK__BookingS__4D7B4ADDA6D9E60B");

            entity.ToTable("BookingStatusHistory");

            entity.Property(e => e.HistoryId).HasColumnName("HistoryID");
            entity.Property(e => e.BookingId).HasColumnName("BookingID");
            entity.Property(e => e.ChangedAt).HasDefaultValueSql("(sysdatetime())");
            entity.Property(e => e.ChangedByUserId).HasColumnName("ChangedByUserID");
            entity.Property(e => e.NewStatus).HasMaxLength(20);
            entity.Property(e => e.Note).HasMaxLength(200);
            entity.Property(e => e.OldStatus).HasMaxLength(20);

            entity.HasOne(d => d.Booking).WithMany(p => p.BookingStatusHistories)
                .HasForeignKey(d => d.BookingId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__BookingSt__Booki__41EDCAC5");

            entity.HasOne(d => d.ChangedByUser).WithMany(p => p.BookingStatusHistories)
                .HasForeignKey(d => d.ChangedByUserId)
                .HasConstraintName("FK__BookingSt__Chang__42E1EEFE");
        });

        modelBuilder.Entity<Court>(entity =>
        {
            entity.HasKey(e => e.CourtId).HasName("PK__Courts__C3A67CFA2986E948");

            entity.ToTable(tb => tb.HasTrigger("TRG_Courts_SetUpdatedAt"));

            entity.HasIndex(e => new { e.FacilityId, e.CourtName }, "UX_Courts_Facility_CourtName")
                .IsUnique()
                .HasFilter("([IsDeleted]=(0))");

            entity.Property(e => e.CourtId).HasColumnName("CourtID");
            entity.Property(e => e.CourtName).HasMaxLength(50);
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.Description).HasMaxLength(255);
            entity.Property(e => e.FacilityId).HasColumnName("FacilityID");
            entity.Property(e => e.HasLighting).HasDefaultValue(true);
            entity.Property(e => e.IsIndoor).HasDefaultValue(true);
            entity.Property(e => e.StatusId).HasColumnName("StatusID");
            entity.Property(e => e.SurfaceId).HasColumnName("SurfaceID");
            entity.Property(e => e.TypeId).HasColumnName("TypeID");
            entity.Property(e => e.UpdatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");

            entity.HasOne(d => d.Facility).WithMany(p => p.Courts)
                .HasForeignKey(d => d.FacilityId)
                .HasConstraintName("FK__Courts__Facility__619B8048");

            entity.HasOne(d => d.Status).WithMany(p => p.Courts)
                .HasForeignKey(d => d.StatusId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Courts__StatusID__6477ECF3");

            entity.HasOne(d => d.Surface).WithMany(p => p.Courts)
                .HasForeignKey(d => d.SurfaceId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Courts__SurfaceI__6383C8BA");

            entity.HasOne(d => d.Type).WithMany(p => p.Courts)
                .HasForeignKey(d => d.TypeId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Courts__TypeID__628FA481");
        });

        modelBuilder.Entity<CourtImage>(entity =>
        {
            entity.HasKey(e => e.ImageId).HasName("PK__CourtIma__7516F4EC49558BAC");

            entity.HasIndex(e => e.CourtId, "UX_CourtImages_Main")
                .IsUnique()
                .HasFilter("([IsMainImage]=(1))");

            entity.Property(e => e.ImageId).HasColumnName("ImageID");
            entity.Property(e => e.CourtId).HasColumnName("CourtID");
            entity.Property(e => e.Description).HasMaxLength(255);
            entity.Property(e => e.ImageUrl)
                .HasMaxLength(255)
                .HasColumnName("ImageURL");

            entity.HasOne(d => d.Court).WithOne(p => p.CourtImage)
                .HasForeignKey<CourtImage>(d => d.CourtId)
                .HasConstraintName("FK__CourtImag__Court__6A30C649");
        });

        modelBuilder.Entity<CourtMaintenance>(entity =>
        {
            entity.HasKey(e => e.MaintenanceId).HasName("PK__CourtMai__E60542B565382291");

            entity.ToTable("CourtMaintenance");

            entity.Property(e => e.MaintenanceId).HasColumnName("MaintenanceID");
            entity.Property(e => e.CourtId).HasColumnName("CourtID");
            entity.Property(e => e.Reason).HasMaxLength(200);

            entity.HasOne(d => d.Court).WithMany(p => p.CourtMaintenances)
                .HasForeignKey(d => d.CourtId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__CourtMain__Court__37703C52");
        });

        modelBuilder.Entity<CourtStatus>(entity =>
        {
            entity.HasKey(e => e.StatusId).HasName("PK__CourtSta__C8EE2043444729C8");

            entity.HasIndex(e => e.StatusName, "UQ__CourtSta__05E7698AA45AC670").IsUnique();

            entity.Property(e => e.StatusId).HasColumnName("StatusID");
            entity.Property(e => e.StatusName).HasMaxLength(20);
        });

        modelBuilder.Entity<CourtSurface>(entity =>
        {
            entity.HasKey(e => e.SurfaceId).HasName("PK__CourtSur__BF4A4766D076912D");

            entity.HasIndex(e => e.SurfaceName, "UQ__CourtSur__8124EF245C33F6B0").IsUnique();

            entity.Property(e => e.SurfaceId).HasColumnName("SurfaceID");
            entity.Property(e => e.SurfaceName).HasMaxLength(30);
        });

        modelBuilder.Entity<CourtType>(entity =>
        {
            entity.HasKey(e => e.TypeId).HasName("PK__CourtTyp__516F0395C8AA3150");

            entity.HasIndex(e => e.TypeName, "UQ__CourtTyp__D4E7DFA854FFD60B").IsUnique();

            entity.Property(e => e.TypeId).HasColumnName("TypeID");
            entity.Property(e => e.TypeName).HasMaxLength(20);
        });

        modelBuilder.Entity<Facility>(entity =>
        {
            entity.HasKey(e => e.FacilityId).HasName("PK__Faciliti__5FB08B94573CEE08");

            entity.ToTable(tb => tb.HasTrigger("TRG_Facilities_SetUpdatedAt"));

            entity.Property(e => e.FacilityId).HasColumnName("FacilityID");
            entity.Property(e => e.Address).HasMaxLength(255);
            entity.Property(e => e.CloseTime).HasDefaultValue(new TimeOnly(22, 0, 0));
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.District).HasMaxLength(50);
            entity.Property(e => e.Email).HasMaxLength(100);
            entity.Property(e => e.FacilityName).HasMaxLength(100);
            entity.Property(e => e.ManagerUserId).HasColumnName("ManagerUserID");
            entity.Property(e => e.OpenTime).HasDefaultValue(new TimeOnly(6, 0, 0));
            entity.Property(e => e.Phone).HasMaxLength(20);
            entity.Property(e => e.Province).HasMaxLength(50);
            entity.Property(e => e.Rating)
                .HasDefaultValue(0m)
                .HasColumnType("decimal(3, 2)");
            entity.Property(e => e.StatusId).HasColumnName("StatusID");
            entity.Property(e => e.TotalRatings).HasDefaultValue(0);
            entity.Property(e => e.UpdatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.Ward).HasMaxLength(50);

            entity.HasOne(d => d.ManagerUser).WithMany(p => p.Facilities)
                .HasForeignKey(d => d.ManagerUserId)
                .HasConstraintName("FK__Facilitie__Manag__59063A47");

            entity.HasOne(d => d.Status).WithMany(p => p.Facilities)
                .HasForeignKey(d => d.StatusId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Facilitie__Statu__59FA5E80");
        });

        modelBuilder.Entity<FacilityOperatingHour>(entity =>
        {
            entity.HasKey(e => new { e.FacilityId, e.DayOfWeek }).HasName("PK__Facility__8FBDCB99BFEB81A6");

            entity.Property(e => e.FacilityId).HasColumnName("FacilityID");

            entity.HasOne(d => d.Facility).WithMany(p => p.FacilityOperatingHours)
                .HasForeignKey(d => d.FacilityId)
                .HasConstraintName("FK__FacilityO__Facil__339FAB6E");
        });

        modelBuilder.Entity<FacilityStatus>(entity =>
        {
            entity.HasKey(e => e.StatusId).HasName("PK__Facility__C8EE2043D9979403");

            entity.HasIndex(e => e.StatusName, "UQ__Facility__05E7698A7FE34FE7").IsUnique();

            entity.Property(e => e.StatusId).HasColumnName("StatusID");
            entity.Property(e => e.StatusName).HasMaxLength(20);
        });

        modelBuilder.Entity<Payment>(entity =>
        {
            entity.HasKey(e => e.PaymentId).HasName("PK__Payments__9B556A5872303271");

            entity.Property(e => e.PaymentId).HasColumnName("PaymentID");
            entity.Property(e => e.Amount).HasColumnType("decimal(12, 2)");
            entity.Property(e => e.BookingId).HasColumnName("BookingID");
            entity.Property(e => e.PaymentDate)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.PaymentMethodId).HasColumnName("PaymentMethodID");
            entity.Property(e => e.PaymentStatusId).HasColumnName("PaymentStatusID");
            entity.Property(e => e.RefundAmount)
                .HasDefaultValue(0m)
                .HasColumnType("decimal(12, 2)");
            entity.Property(e => e.RefundDate).HasColumnType("datetime");
            entity.Property(e => e.TransactionId)
                .HasMaxLength(100)
                .HasColumnName("TransactionID");

            entity.HasOne(d => d.Booking).WithMany(p => p.Payments)
                .HasForeignKey(d => d.BookingId)
                .HasConstraintName("FK__Payments__Bookin__0D7A0286");

            entity.HasOne(d => d.PaymentMethod).WithMany(p => p.Payments)
                .HasForeignKey(d => d.PaymentMethodId)
                .OnDelete(DeleteBehavior.SetNull)
                .HasConstraintName("FK__Payments__Paymen__0E6E26BF");

            entity.HasOne(d => d.PaymentStatus).WithMany(p => p.Payments)
                .HasForeignKey(d => d.PaymentStatusId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Payments__Paymen__0F624AF8");
        });

        modelBuilder.Entity<PaymentMethod>(entity =>
        {
            entity.HasKey(e => e.PaymentMethodId).HasName("PK__PaymentM__DC31C1F3715C28B5");

            entity.ToTable(tb => tb.HasTrigger("TRG_PaymentMethods_SetUpdatedAt"));

            entity.HasIndex(e => e.MethodName, "UQ__PaymentM__218CFB17D1E86FEE").IsUnique();

            entity.Property(e => e.PaymentMethodId).HasColumnName("PaymentMethodID");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.Description).HasMaxLength(500);
            entity.Property(e => e.IsActive).HasDefaultValue(true);
            entity.Property(e => e.MethodName).HasMaxLength(100);
            entity.Property(e => e.UpdatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
        });

        modelBuilder.Entity<PaymentStatus>(entity =>
        {
            entity.HasKey(e => e.PaymentStatusId).HasName("PK__PaymentS__34F8AC1F59CD8CE5");

            entity.HasIndex(e => e.StatusName, "UQ__PaymentS__05E7698A9F6FA231").IsUnique();

            entity.Property(e => e.PaymentStatusId).HasColumnName("PaymentStatusID");
            entity.Property(e => e.StatusName).HasMaxLength(20);
        });

        modelBuilder.Entity<PricingRule>(entity =>
        {
            entity.HasKey(e => e.PricingId).HasName("PK__PricingR__EC306B72E7A4711C");

            entity.Property(e => e.PricingId).HasColumnName("PricingID");
            entity.Property(e => e.CourtId).HasColumnName("CourtID");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.DayType).HasMaxLength(20);
            entity.Property(e => e.IsActive).HasDefaultValue(true);
            entity.Property(e => e.PricePerHour).HasColumnType("decimal(10, 2)");

            entity.HasOne(d => d.Court).WithMany(p => p.PricingRules)
                .HasForeignKey(d => d.CourtId)
                .HasConstraintName("FK__PricingRu__Court__151B244E");
        });

        modelBuilder.Entity<Promotion>(entity =>
        {
            entity.HasKey(e => e.PromotionId).HasName("PK__Promotio__52C42F2F6468058C");

            entity.ToTable(tb => tb.HasTrigger("TRG_Promotions_SetUpdatedAt"));

            entity.HasIndex(e => e.Code, "UQ__Promotio__A25C5AA7CDBE295A").IsUnique();

            entity.Property(e => e.PromotionId).HasColumnName("PromotionID");
            entity.Property(e => e.ApplicableCourtTypes).HasMaxLength(100);
            entity.Property(e => e.ApplicableDays).HasMaxLength(20);
            entity.Property(e => e.Code).HasMaxLength(50);
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.DiscountType).HasMaxLength(20);
            entity.Property(e => e.DiscountValue).HasColumnType("decimal(12, 2)");
            entity.Property(e => e.EndDate).HasColumnType("datetime");
            entity.Property(e => e.MaximumDiscount).HasColumnType("decimal(12, 2)");
            entity.Property(e => e.MinimumBookingAmount).HasColumnType("decimal(12, 2)");
            entity.Property(e => e.PromotionStatusId).HasColumnName("PromotionStatusID");
            entity.Property(e => e.StartDate).HasColumnType("datetime");
            entity.Property(e => e.Title).HasMaxLength(200);
            entity.Property(e => e.UpdatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");

            entity.HasOne(d => d.PromotionStatus).WithMany(p => p.Promotions)
                .HasForeignKey(d => d.PromotionStatusId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Promotion__Promo__245D67DE");
        });

        modelBuilder.Entity<PromotionStatus>(entity =>
        {
            entity.HasKey(e => e.PromotionStatusId).HasName("PK__Promotio__808F8D38BBC73D6D");

            entity.HasIndex(e => e.StatusName, "UQ__Promotio__05E7698AAA128E3D").IsUnique();

            entity.Property(e => e.PromotionStatusId).HasColumnName("PromotionStatusID");
            entity.Property(e => e.StatusName).HasMaxLength(20);
        });

        modelBuilder.Entity<Review>(entity =>
        {
            entity.HasKey(e => e.ReviewId).HasName("PK__Reviews__74BC79AE0687835D");

            entity.Property(e => e.ReviewId).HasColumnName("ReviewID");
            entity.Property(e => e.BookingId).HasColumnName("BookingID");
            entity.Property(e => e.CourtId).HasColumnName("CourtID");
            entity.Property(e => e.FacilityId).HasColumnName("FacilityID");
            entity.Property(e => e.ReviewDate)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.ReviewStatusId).HasColumnName("ReviewStatusID");
            entity.Property(e => e.UserId).HasColumnName("UserID");

            entity.HasOne(d => d.Booking).WithMany(p => p.Reviews)
                .HasForeignKey(d => d.BookingId)
                .OnDelete(DeleteBehavior.SetNull)
                .HasConstraintName("FK__Reviews__Booking__2DE6D218");

            entity.HasOne(d => d.Court).WithMany(p => p.Reviews)
                .HasForeignKey(d => d.CourtId)
                .HasConstraintName("FK__Reviews__CourtID__2BFE89A6");

            entity.HasOne(d => d.Facility).WithMany(p => p.Reviews)
                .HasForeignKey(d => d.FacilityId)
                .HasConstraintName("FK__Reviews__Facilit__2B0A656D");

            entity.HasOne(d => d.ReviewStatus).WithMany(p => p.Reviews)
                .HasForeignKey(d => d.ReviewStatusId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Reviews__ReviewS__2EDAF651");

            entity.HasOne(d => d.User).WithMany(p => p.Reviews)
                .HasForeignKey(d => d.UserId)
                .HasConstraintName("FK__Reviews__UserID__2CF2ADDF");
        });

        modelBuilder.Entity<ReviewStatus>(entity =>
        {
            entity.HasKey(e => e.ReviewStatusId).HasName("PK__ReviewSt__FA9C9719EC2F6AA8");

            entity.HasIndex(e => e.StatusName, "UQ__ReviewSt__05E7698A927D549F").IsUnique();

            entity.Property(e => e.ReviewStatusId).HasColumnName("ReviewStatusID");
            entity.Property(e => e.StatusName).HasMaxLength(20);
        });

        modelBuilder.Entity<Role>(entity =>
        {
            entity.HasKey(e => e.RoleId).HasName("PK__Roles__8AFACE3AAF19D51F");

            entity.HasIndex(e => e.RoleName, "UQ__Roles__8A2B61604B377AB3").IsUnique();

            entity.Property(e => e.RoleId).HasColumnName("RoleID");
            entity.Property(e => e.RoleName).HasMaxLength(50);
        });

        modelBuilder.Entity<TimeSlot>(entity =>
        {
            entity.HasKey(e => e.TimeSlotId).HasName("PK__TimeSlot__41CC1F5216ADAB95");

            entity.HasIndex(e => new { e.CourtId, e.SlotDate, e.TimeSlotStatusId }, "IX_TimeSlots_Availability");

            entity.HasIndex(e => new { e.CourtId, e.SlotDate, e.StartTime, e.EndTime }, "UX_TimeSlots_CourtDateStartEnd").IsUnique();

            entity.Property(e => e.TimeSlotId).HasColumnName("TimeSlotID");
            entity.Property(e => e.CourtId).HasColumnName("CourtID");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.Price).HasColumnType("decimal(10, 2)");
            entity.Property(e => e.TimeSlotStatusId).HasColumnName("TimeSlotStatusID");

            entity.HasOne(d => d.Court).WithMany(p => p.TimeSlots)
                .HasForeignKey(d => d.CourtId)
                .HasConstraintName("FK__TimeSlots__Court__6E01572D");

            entity.HasOne(d => d.TimeSlotStatus).WithMany(p => p.TimeSlots)
                .HasForeignKey(d => d.TimeSlotStatusId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__TimeSlots__TimeS__6EF57B66");
        });

        modelBuilder.Entity<TimeSlotStatus>(entity =>
        {
            entity.HasKey(e => e.TimeSlotStatusId).HasName("PK__TimeSlot__12E1B4BB13B26D49");

            entity.HasIndex(e => e.StatusName, "UQ__TimeSlot__05E7698AC88D353F").IsUnique();

            entity.Property(e => e.TimeSlotStatusId).HasColumnName("TimeSlotStatusID");
            entity.Property(e => e.StatusName).HasMaxLength(20);
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.UserId).HasName("PK__Users__1788CCACA9FB72FB");

            entity.ToTable(tb => tb.HasTrigger("TRG_Users_SetUpdatedAt"));

            entity.HasIndex(e => e.Email, "UQ__Users__A9D10534AF71CCE6").IsUnique();

            entity.HasIndex(e => e.UserName, "UQ__Users__C9F284561A83B1AA").IsUnique();

            entity.Property(e => e.UserId).HasColumnName("UserID");
            entity.Property(e => e.Address).HasMaxLength(255);
            entity.Property(e => e.Avatar).HasMaxLength(255);
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.Email).HasMaxLength(100);
            entity.Property(e => e.FullName).HasMaxLength(100);
            entity.Property(e => e.Gender).HasMaxLength(10);
            entity.Property(e => e.GoogleId)
                .HasMaxLength(100)
                .HasColumnName("Google_Id");
            entity.Property(e => e.LastLogin).HasColumnType("datetime");
            entity.Property(e => e.MembershipType)
                .HasMaxLength(20)
                .HasDefaultValue("Basic");
            entity.Property(e => e.PassWord).HasMaxLength(255);
            entity.Property(e => e.Phone).HasMaxLength(20);
            entity.Property(e => e.ResetToken)
                .HasMaxLength(50)
                .HasColumnName("Reset_Token");
            entity.Property(e => e.ResetTokenExpiry)
                .HasColumnType("datetime")
                .HasColumnName("Reset_Token_Expiry");
            entity.Property(e => e.RoleId).HasColumnName("RoleID");
            entity.Property(e => e.StatusId).HasColumnName("StatusID");
            entity.Property(e => e.UpdatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.UserName).HasMaxLength(50);

            entity.HasOne(d => d.Role).WithMany(p => p.Users)
                .HasForeignKey(d => d.RoleId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Users__RoleID__4E88ABD4");

            entity.HasOne(d => d.Status).WithMany(p => p.Users)
                .HasForeignKey(d => d.StatusId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Users__StatusID__4F7CD00D");
        });

        modelBuilder.Entity<UserStatus>(entity =>
        {
            entity.HasKey(e => e.StatusId).HasName("PK__UserStat__C8EE2043977B8763");

            entity.HasIndex(e => e.StatusName, "UQ__UserStat__05E7698A64A48702").IsUnique();

            entity.Property(e => e.StatusId).HasColumnName("StatusID");
            entity.Property(e => e.StatusName).HasMaxLength(20);
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
