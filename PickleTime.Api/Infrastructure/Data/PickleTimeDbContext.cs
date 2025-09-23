using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using PickleTime.Api.Domain.Entities;

namespace PickleTime.Api.Infrastructure.Data;

public partial class PickleTimeDbContext : DbContext
{
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

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Booking>(entity =>
        {
            entity.HasKey(e => e.BookingId).HasName("PK__Bookings__73951ACD1F3DE4FC");

            entity.ToTable(tb => tb.HasTrigger("TRG_Bookings_SetUpdatedAt"));

            entity.HasIndex(e => e.BookingStatusId, "IX_Bookings_Status");

            entity.HasIndex(e => e.BookingNumber, "UQ__Bookings__AAC320BF7F9C0AEF").IsUnique();

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
                .HasConstraintName("FK__Bookings__Bookin__0A9D95DB");

            entity.HasOne(d => d.PaymentStatus).WithMany(p => p.Bookings)
                .HasForeignKey(d => d.PaymentStatusId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Bookings__Paymen__0B91BA14");

            entity.HasOne(d => d.User).WithMany(p => p.Bookings)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.SetNull)
                .HasConstraintName("FK__Bookings__UserID__09A971A2");
        });

        modelBuilder.Entity<BookingDetail>(entity =>
        {
            entity.HasKey(e => e.BookingDetailId).HasName("PK__BookingD__8136D47A445A6CED");

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
                .HasConstraintName("FK__BookingDe__Booki__114A936A");

            entity.HasOne(d => d.Court).WithMany(p => p.BookingDetails)
                .HasForeignKey(d => d.CourtId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__BookingDe__Court__123EB7A3");
        });

        modelBuilder.Entity<BookingHold>(entity =>
        {
            entity.HasKey(e => e.HoldId).HasName("PK__BookingH__6E24DA2412032ACA");

            entity.Property(e => e.HoldId).HasColumnName("HoldID");
            entity.Property(e => e.BookingHoldStatusId).HasColumnName("BookingHoldStatusID");
            entity.Property(e => e.CourtId).HasColumnName("CourtID");
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("(sysdatetime())");
            entity.Property(e => e.UserId).HasColumnName("UserID");

            entity.HasOne(d => d.BookingHoldStatus).WithMany(p => p.BookingHolds)
                .HasForeignKey(d => d.BookingHoldStatusId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__BookingHo__Booki__51300E55");

            entity.HasOne(d => d.Court).WithMany(p => p.BookingHolds)
                .HasForeignKey(d => d.CourtId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__BookingHo__Court__4F47C5E3");

            entity.HasOne(d => d.User).WithMany(p => p.BookingHolds)
                .HasForeignKey(d => d.UserId)
                .HasConstraintName("FK__BookingHo__UserI__503BEA1C");
        });

        modelBuilder.Entity<BookingHoldStatus>(entity =>
        {
            entity.HasKey(e => e.BookingHoldStatusId).HasName("PK__BookingH__B0C044E57A914565");

            entity.HasIndex(e => e.StatusName, "UQ__BookingH__05E7698A897B151D").IsUnique();

            entity.Property(e => e.BookingHoldStatusId).HasColumnName("BookingHoldStatusID");
            entity.Property(e => e.StatusName).HasMaxLength(20);
        });

        modelBuilder.Entity<BookingStatus>(entity =>
        {
            entity.HasKey(e => e.BookingStatusId).HasName("PK__BookingS__54F9C0BDAA9A4EF3");

            entity.HasIndex(e => e.StatusName, "UQ__BookingS__05E7698ADC22F4F0").IsUnique();

            entity.Property(e => e.BookingStatusId).HasColumnName("BookingStatusID");
            entity.Property(e => e.StatusName).HasMaxLength(20);
        });

        modelBuilder.Entity<BookingStatusHistory>(entity =>
        {
            entity.HasKey(e => e.HistoryId).HasName("PK__BookingS__4D7B4ADD17BC8AE0");

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
                .HasConstraintName("FK__BookingSt__Booki__55009F39");

            entity.HasOne(d => d.ChangedByUser).WithMany(p => p.BookingStatusHistories)
                .HasForeignKey(d => d.ChangedByUserId)
                .HasConstraintName("FK__BookingSt__Chang__55F4C372");
        });

        modelBuilder.Entity<Court>(entity =>
        {
            entity.HasKey(e => e.CourtId).HasName("PK__Courts__C3A67CFA964950CB");

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
                .HasConstraintName("FK__Courts__Facility__74AE54BC");

            entity.HasOne(d => d.Status).WithMany(p => p.Courts)
                .HasForeignKey(d => d.StatusId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Courts__StatusID__778AC167");

            entity.HasOne(d => d.Surface).WithMany(p => p.Courts)
                .HasForeignKey(d => d.SurfaceId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Courts__SurfaceI__76969D2E");

            entity.HasOne(d => d.Type).WithMany(p => p.Courts)
                .HasForeignKey(d => d.TypeId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Courts__TypeID__75A278F5");
        });

        modelBuilder.Entity<CourtImage>(entity =>
        {
            entity.HasKey(e => e.ImageId).HasName("PK__CourtIma__7516F4ECC353213D");

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
                .HasConstraintName("FK__CourtImag__Court__7D439ABD");
        });

        modelBuilder.Entity<CourtMaintenance>(entity =>
        {
            entity.HasKey(e => e.MaintenanceId).HasName("PK__CourtMai__E60542B5D55E68CB");

            entity.ToTable("CourtMaintenance");

            entity.Property(e => e.MaintenanceId).HasColumnName("MaintenanceID");
            entity.Property(e => e.CourtId).HasColumnName("CourtID");
            entity.Property(e => e.Reason).HasMaxLength(200);

            entity.HasOne(d => d.Court).WithMany(p => p.CourtMaintenances)
                .HasForeignKey(d => d.CourtId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__CourtMain__Court__4A8310C6");
        });

        modelBuilder.Entity<CourtStatus>(entity =>
        {
            entity.HasKey(e => e.StatusId).HasName("PK__CourtSta__C8EE20437C690E1A");

            entity.HasIndex(e => e.StatusName, "UQ__CourtSta__05E7698ADA658099").IsUnique();

            entity.Property(e => e.StatusId).HasColumnName("StatusID");
            entity.Property(e => e.StatusName).HasMaxLength(20);
        });

        modelBuilder.Entity<CourtSurface>(entity =>
        {
            entity.HasKey(e => e.SurfaceId).HasName("PK__CourtSur__BF4A47669395E912");

            entity.HasIndex(e => e.SurfaceName, "UQ__CourtSur__8124EF24A0EAC545").IsUnique();

            entity.Property(e => e.SurfaceId).HasColumnName("SurfaceID");
            entity.Property(e => e.SurfaceName).HasMaxLength(30);
        });

        modelBuilder.Entity<CourtType>(entity =>
        {
            entity.HasKey(e => e.TypeId).HasName("PK__CourtTyp__516F039543AC7FB2");

            entity.HasIndex(e => e.TypeName, "UQ__CourtTyp__D4E7DFA82D33F939").IsUnique();

            entity.Property(e => e.TypeId).HasColumnName("TypeID");
            entity.Property(e => e.TypeName).HasMaxLength(20);
        });

        modelBuilder.Entity<Facility>(entity =>
        {
            entity.HasKey(e => e.FacilityId).HasName("PK__Faciliti__5FB08B942AE495AC");

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
                .HasConstraintName("FK__Facilitie__Manag__6C190EBB");

            entity.HasOne(d => d.Status).WithMany(p => p.Facilities)
                .HasForeignKey(d => d.StatusId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Facilitie__Statu__6D0D32F4");
        });

        modelBuilder.Entity<FacilityOperatingHour>(entity =>
        {
            entity.HasKey(e => new { e.FacilityId, e.DayOfWeek }).HasName("PK__Facility__8FBDCB99FC61F8CA");

            entity.Property(e => e.FacilityId).HasColumnName("FacilityID");

            entity.HasOne(d => d.Facility).WithMany(p => p.FacilityOperatingHours)
                .HasForeignKey(d => d.FacilityId)
                .HasConstraintName("FK__FacilityO__Facil__46B27FE2");
        });

        modelBuilder.Entity<FacilityStatus>(entity =>
        {
            entity.HasKey(e => e.StatusId).HasName("PK__Facility__C8EE20432FD64073");

            entity.HasIndex(e => e.StatusName, "UQ__Facility__05E7698ABA130595").IsUnique();

            entity.Property(e => e.StatusId).HasColumnName("StatusID");
            entity.Property(e => e.StatusName).HasMaxLength(20);
        });

        modelBuilder.Entity<Payment>(entity =>
        {
            entity.HasKey(e => e.PaymentId).HasName("PK__Payments__9B556A5891D25A6D");

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
                .HasConstraintName("FK__Payments__Bookin__208CD6FA");

            entity.HasOne(d => d.PaymentMethod).WithMany(p => p.Payments)
                .HasForeignKey(d => d.PaymentMethodId)
                .OnDelete(DeleteBehavior.SetNull)
                .HasConstraintName("FK__Payments__Paymen__2180FB33");

            entity.HasOne(d => d.PaymentStatus).WithMany(p => p.Payments)
                .HasForeignKey(d => d.PaymentStatusId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Payments__Paymen__22751F6C");
        });

        modelBuilder.Entity<PaymentMethod>(entity =>
        {
            entity.HasKey(e => e.PaymentMethodId).HasName("PK__PaymentM__DC31C1F386166C2E");

            entity.ToTable(tb => tb.HasTrigger("TRG_PaymentMethods_SetUpdatedAt"));

            entity.HasIndex(e => e.MethodName, "UQ__PaymentM__218CFB171EC85EF8").IsUnique();

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
            entity.HasKey(e => e.PaymentStatusId).HasName("PK__PaymentS__34F8AC1F92088694");

            entity.HasIndex(e => e.StatusName, "UQ__PaymentS__05E7698ABE2AF229").IsUnique();

            entity.Property(e => e.PaymentStatusId).HasColumnName("PaymentStatusID");
            entity.Property(e => e.StatusName).HasMaxLength(20);
        });

        modelBuilder.Entity<PricingRule>(entity =>
        {
            entity.HasKey(e => e.PricingId).HasName("PK__PricingR__EC306B72D24BC25D");

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
                .HasConstraintName("FK__PricingRu__Court__282DF8C2");
        });

        modelBuilder.Entity<Promotion>(entity =>
        {
            entity.HasKey(e => e.PromotionId).HasName("PK__Promotio__52C42F2F3D29BC76");

            entity.ToTable(tb => tb.HasTrigger("TRG_Promotions_SetUpdatedAt"));

            entity.HasIndex(e => e.Code, "UQ__Promotio__A25C5AA789540305").IsUnique();

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
                .HasConstraintName("FK__Promotion__Promo__37703C52");
        });

        modelBuilder.Entity<PromotionStatus>(entity =>
        {
            entity.HasKey(e => e.PromotionStatusId).HasName("PK__Promotio__808F8D3833550EF8");

            entity.HasIndex(e => e.StatusName, "UQ__Promotio__05E7698AF65B13A8").IsUnique();

            entity.Property(e => e.PromotionStatusId).HasColumnName("PromotionStatusID");
            entity.Property(e => e.StatusName).HasMaxLength(20);
        });

        modelBuilder.Entity<Review>(entity =>
        {
            entity.HasKey(e => e.ReviewId).HasName("PK__Reviews__74BC79AE7168098F");

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
                .HasConstraintName("FK__Reviews__Booking__40F9A68C");

            entity.HasOne(d => d.Court).WithMany(p => p.Reviews)
                .HasForeignKey(d => d.CourtId)
                .HasConstraintName("FK__Reviews__CourtID__3F115E1A");

            entity.HasOne(d => d.Facility).WithMany(p => p.Reviews)
                .HasForeignKey(d => d.FacilityId)
                .HasConstraintName("FK__Reviews__Facilit__3E1D39E1");

            entity.HasOne(d => d.ReviewStatus).WithMany(p => p.Reviews)
                .HasForeignKey(d => d.ReviewStatusId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Reviews__ReviewS__41EDCAC5");

            entity.HasOne(d => d.User).WithMany(p => p.Reviews)
                .HasForeignKey(d => d.UserId)
                .HasConstraintName("FK__Reviews__UserID__40058253");
        });

        modelBuilder.Entity<ReviewStatus>(entity =>
        {
            entity.HasKey(e => e.ReviewStatusId).HasName("PK__ReviewSt__FA9C9719485B2575");

            entity.HasIndex(e => e.StatusName, "UQ__ReviewSt__05E7698A461B1AFA").IsUnique();

            entity.Property(e => e.ReviewStatusId).HasColumnName("ReviewStatusID");
            entity.Property(e => e.StatusName).HasMaxLength(20);
        });

        modelBuilder.Entity<Role>(entity =>
        {
            entity.HasKey(e => e.RoleId).HasName("PK__Roles__8AFACE3ABC0777E4");

            entity.HasIndex(e => e.RoleName, "UQ__Roles__8A2B61603F801926").IsUnique();

            entity.Property(e => e.RoleId).HasColumnName("RoleID");
            entity.Property(e => e.RoleName).HasMaxLength(50);
        });

        modelBuilder.Entity<TimeSlot>(entity =>
        {
            entity.HasKey(e => e.TimeSlotId).HasName("PK__TimeSlot__41CC1F525E7E275A");

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
                .HasConstraintName("FK__TimeSlots__Court__01142BA1");

            entity.HasOne(d => d.TimeSlotStatus).WithMany(p => p.TimeSlots)
                .HasForeignKey(d => d.TimeSlotStatusId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__TimeSlots__TimeS__02084FDA");
        });

        modelBuilder.Entity<TimeSlotStatus>(entity =>
        {
            entity.HasKey(e => e.TimeSlotStatusId).HasName("PK__TimeSlot__12E1B4BB3EA041D8");

            entity.HasIndex(e => e.StatusName, "UQ__TimeSlot__05E7698A41A9D463").IsUnique();

            entity.Property(e => e.TimeSlotStatusId).HasColumnName("TimeSlotStatusID");
            entity.Property(e => e.StatusName).HasMaxLength(20);
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.UserId).HasName("PK__Users__1788CCAC0F3FE797");

            entity.ToTable(tb => tb.HasTrigger("TRG_Users_SetUpdatedAt"));

            entity.HasIndex(e => e.Email, "UQ__Users__A9D10534EC1ABA17").IsUnique();

            entity.HasIndex(e => e.UserName, "UQ__Users__C9F28456C898F08A").IsUnique();

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
                .HasMaxLength(10)
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
                .HasConstraintName("FK__Users__RoleID__619B8048");

            entity.HasOne(d => d.Status).WithMany(p => p.Users)
                .HasForeignKey(d => d.StatusId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Users__StatusID__628FA481");
        });

        modelBuilder.Entity<UserStatus>(entity =>
        {
            entity.HasKey(e => e.StatusId).HasName("PK__UserStat__C8EE204347D55589");

            entity.HasIndex(e => e.StatusName, "UQ__UserStat__05E7698AC0060AC8").IsUnique();

            entity.Property(e => e.StatusId).HasColumnName("StatusID");
            entity.Property(e => e.StatusName).HasMaxLength(20);
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
