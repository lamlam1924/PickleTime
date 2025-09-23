/*******************************************************************************
* DATABASE CREATION
*******************************************************************************/

--23/09/2025

USE master;
GO

IF DB_ID('PICKLEBALLBOOKING') IS NOT NULL
    DROP DATABASE PICKLEBALLBOOKING;
GO

CREATE DATABASE PICKLEBALLBOOKING;
GO

USE PICKLEBALLBOOKING;
GO

/*******************************************************************************
* SECTION 1: LOOKUP TABLES - Create these first
*******************************************************************************/
-- Create all status and reference tables
CREATE TABLE Roles (
                       RoleID INT PRIMARY KEY IDENTITY(1,1),
                       RoleName NVARCHAR(50) NOT NULL UNIQUE
);
GO

CREATE TABLE UserStatuses (
                              StatusID INT PRIMARY KEY IDENTITY(1,1),
                              StatusName NVARCHAR(20) NOT NULL UNIQUE
);
GO

CREATE TABLE FacilityStatuses (
                                  StatusID INT PRIMARY KEY IDENTITY(1,1),
                                  StatusName NVARCHAR(20) NOT NULL UNIQUE
);
GO

CREATE TABLE CourtStatuses (
                               StatusID INT PRIMARY KEY IDENTITY(1,1),
                               StatusName NVARCHAR(20) NOT NULL UNIQUE
);
GO

CREATE TABLE CourtTypes (
                            TypeID INT PRIMARY KEY IDENTITY(1,1),
                            TypeName NVARCHAR(20) NOT NULL UNIQUE
);
GO

CREATE TABLE CourtSurfaces (
                               SurfaceID INT PRIMARY KEY IDENTITY(1,1),
                               SurfaceName NVARCHAR(30) NOT NULL UNIQUE
);
GO

CREATE TABLE TimeSlotStatuses (
                                  TimeSlotStatusID INT PRIMARY KEY IDENTITY(1,1),
                                  StatusName NVARCHAR(20) NOT NULL UNIQUE
);
GO

CREATE TABLE BookingStatuses (
                                 BookingStatusID INT PRIMARY KEY IDENTITY(1,1),
                                 StatusName NVARCHAR(20) NOT NULL UNIQUE
);
GO

CREATE TABLE PaymentStatuses (
                                 PaymentStatusID INT PRIMARY KEY IDENTITY(1,1),
                                 StatusName NVARCHAR(20) NOT NULL UNIQUE
);
GO

CREATE TABLE PromotionStatuses (
                                   PromotionStatusID INT PRIMARY KEY IDENTITY(1,1),
                                   StatusName NVARCHAR(20) NOT NULL UNIQUE
);
GO

CREATE TABLE ReviewStatuses (
                                ReviewStatusID INT PRIMARY KEY IDENTITY(1,1),
                                StatusName NVARCHAR(20) NOT NULL UNIQUE
);
GO

CREATE TABLE BookingHoldStatuses (
                                     BookingHoldStatusID INT PRIMARY KEY IDENTITY(1,1),
                                     StatusName NVARCHAR(20) NOT NULL UNIQUE
);
GO

/*******************************************************************************
* SECTION 2: INSERT LOOKUP DATA
*******************************************************************************/
-- Insert all reference data
INSERT INTO Roles (RoleName) VALUES 
    ('admin'), ('manager'), ('customer');
GO

INSERT INTO UserStatuses (StatusName) VALUES 
    ('active'), ('inactive'), ('pending'), ('banned');
GO

INSERT INTO FacilityStatuses (StatusName) VALUES 
    ('active'), ('inactive'), ('maintenance');
GO

INSERT INTO CourtStatuses (StatusName) VALUES 
    ('available'), ('maintenance'), ('closed');
GO

INSERT INTO CourtTypes (TypeName) VALUES 
    ('Standard'), ('Premium'), ('VIP');
GO

INSERT INTO CourtSurfaces (SurfaceName) VALUES 
    ('Synthetic'), ('Concrete'), ('Wood');
GO

INSERT INTO TimeSlotStatuses (StatusName) VALUES 
    ('available'), ('booked'), ('blocked'), ('maintenance');
GO

INSERT INTO BookingStatuses (StatusName) VALUES 
    ('pending'), ('confirmed'), ('cancelled'), ('completed'), ('no_show');
GO

INSERT INTO PaymentStatuses (StatusName) VALUES 
    ('pending'), ('paid'), ('failed'), ('refunded');
GO

INSERT INTO PromotionStatuses (StatusName) VALUES 
    ('active'), ('inactive'), ('expired');
GO

INSERT INTO ReviewStatuses (StatusName) VALUES 
    ('pending'), ('approved'), ('rejected');
GO

INSERT INTO BookingHoldStatuses (StatusName) VALUES 
    ('active'), ('expired'), ('consumed'), ('cancelled');
GO

/*******************************************************************************
* SECTION 3: CORE TABLES
*******************************************************************************/
-- Create Users table first as other tables depend on it
CREATE TABLE Users (
                       UserID INT PRIMARY KEY IDENTITY(1,1),
                       UserName NVARCHAR(50) NOT NULL UNIQUE,
                       PassWord NVARCHAR(255) NOT NULL,
                       Email NVARCHAR(100) NOT NULL UNIQUE,
                       Phone NVARCHAR(20),
                       FullName NVARCHAR(100),
                       RoleID INT NOT NULL,
                       StatusID INT NOT NULL,
                       DateOfBirth DATE NULL,
                       Gender NVARCHAR(10) CHECK (Gender IN (N'Nam', N'Nữ', N'Khác')),
                       Address NVARCHAR(255),
                       MembershipType NVARCHAR(20) DEFAULT 'Basic' CHECK (MembershipType IN ('Basic', 'Premium', 'VIP')),
                       CreatedAt DATETIME NOT NULL DEFAULT GETDATE(),
                       UpdatedAt DATETIME NOT NULL DEFAULT GETDATE(),
                       LastLogin DATETIME NULL,
                       Avatar NVARCHAR(255),
                       IsDeleted BIT NOT NULL DEFAULT 0,
                       Reset_Token NVARCHAR(10) NULL,
                       Reset_Token_Expiry DATETIME NULL,
                       Google_Id NVARCHAR(100) NULL,
                       FOREIGN KEY (RoleID) REFERENCES Roles(RoleID),
                       FOREIGN KEY (StatusID) REFERENCES UserStatuses(StatusID)
);
GO

CREATE TABLE Facilities (
                            FacilityID INT PRIMARY KEY IDENTITY(1,1),
                            FacilityName NVARCHAR(100) NOT NULL,
                            Address NVARCHAR(255) NOT NULL,
                            Province NVARCHAR(50) NOT NULL,
                            District NVARCHAR(50) NOT NULL,
                            Ward NVARCHAR(50) NOT NULL,
                            Phone NVARCHAR(20),
                            Email NVARCHAR(100),
                            ManagerUserID INT NULL,
                            Description NVARCHAR(MAX),
                            Amenities NVARCHAR(MAX),
                            StatusID INT NOT NULL,
                            Rating DECIMAL(3,2) DEFAULT 0,
                            TotalRatings INT DEFAULT 0,
                            OpenTime TIME NOT NULL DEFAULT '06:00:00',
                            CloseTime TIME NOT NULL DEFAULT '22:00:00',
                            CreatedAt DATETIME NOT NULL DEFAULT GETDATE(),
                            UpdatedAt DATETIME NOT NULL DEFAULT GETDATE(),
                            IsDeleted BIT NOT NULL DEFAULT 0,
                            FOREIGN KEY (ManagerUserID) REFERENCES Users(UserID),
                            FOREIGN KEY (StatusID) REFERENCES FacilityStatuses(StatusID)
);
GO

CREATE TABLE Courts (
                        CourtID INT PRIMARY KEY IDENTITY(1,1),
                        FacilityID INT NOT NULL,
                        CourtName NVARCHAR(50) NOT NULL,
                        TypeID INT NOT NULL,
                        SurfaceID INT NOT NULL,
                        IsIndoor BIT NOT NULL DEFAULT 1,
                        HasLighting BIT NOT NULL DEFAULT 1,
                        StatusID INT NOT NULL,
                        Description NVARCHAR(255),
                        CreatedAt DATETIME NOT NULL DEFAULT GETDATE(),
                        UpdatedAt DATETIME NOT NULL DEFAULT GETDATE(),
                        IsDeleted BIT NOT NULL DEFAULT 0,
                        FOREIGN KEY (FacilityID) REFERENCES Facilities(FacilityID) ON DELETE CASCADE,
                        FOREIGN KEY (TypeID) REFERENCES CourtTypes(TypeID),
                        FOREIGN KEY (SurfaceID) REFERENCES CourtSurfaces(SurfaceID),
                        FOREIGN KEY (StatusID) REFERENCES CourtStatuses(StatusID)
);
GO

CREATE TABLE CourtImages (
                             ImageID INT PRIMARY KEY IDENTITY(1,1),
                             CourtID INT NOT NULL,
                             ImageURL NVARCHAR(255) NOT NULL,
                             IsMainImage BIT NOT NULL DEFAULT 0,
                             Description NVARCHAR(255),
                             DisplayOrder INT NOT NULL DEFAULT 0,
                             IsDeleted BIT NOT NULL DEFAULT 0,
                             FOREIGN KEY (CourtID) REFERENCES Courts(CourtID) ON DELETE CASCADE
);
GO

CREATE TABLE TimeSlots (
                           TimeSlotID INT PRIMARY KEY IDENTITY(1,1),
                           CourtID INT NOT NULL,
                           SlotDate DATE NOT NULL,
                           StartTime TIME NOT NULL,
                           EndTime TIME NOT NULL,
                           TimeSlotStatusID INT NOT NULL,
                           Price DECIMAL(10,2) NOT NULL,
                           CreatedAt DATETIME NOT NULL DEFAULT GETDATE(),
                           FOREIGN KEY (CourtID) REFERENCES Courts(CourtID) ON DELETE CASCADE,
                           FOREIGN KEY (TimeSlotStatusID) REFERENCES TimeSlotStatuses(TimeSlotStatusID)
);
GO

CREATE TABLE Bookings (
                          BookingID INT PRIMARY KEY IDENTITY(1,1),
                          UserID INT NULL,
                          BookingNumber NVARCHAR(50) NOT NULL UNIQUE,
                          BookingDate DATE NOT NULL,
                          TotalAmount DECIMAL(10,2) NOT NULL,
                          DiscountAmount DECIMAL(10,2) NOT NULL DEFAULT 0,
                          BookingStatusID INT NOT NULL,
                          PaymentStatusID INT NOT NULL,
                          CustomerName NVARCHAR(100) NOT NULL,
                          CustomerPhone NVARCHAR(20) NOT NULL,
                          CustomerEmail NVARCHAR(100),
                          Notes NVARCHAR(MAX),
                          CreatedAt DATETIME NOT NULL DEFAULT GETDATE(),
                          UpdatedAt DATETIME NOT NULL DEFAULT GETDATE(),
                          CancelledAt DATETIME NULL,
                          CancellationReason NVARCHAR(255),
                          IsDeleted BIT NOT NULL DEFAULT 0,
                          FOREIGN KEY (UserID) REFERENCES Users(UserID) ON DELETE SET NULL,
                          FOREIGN KEY (BookingStatusID) REFERENCES BookingStatuses(BookingStatusID),
                          FOREIGN KEY (PaymentStatusID) REFERENCES PaymentStatuses(PaymentStatusID),
                          CONSTRAINT CK_Bookings_Amounts CHECK (TotalAmount >= 0 AND DiscountAmount >= 0 AND TotalAmount >= DiscountAmount)
);
GO

-- Add computed column for final amount
ALTER TABLE Bookings ADD
    FinalAmount AS (TotalAmount - DiscountAmount) PERSISTED;
GO

CREATE TABLE BookingDetails (
                                BookingDetailID INT PRIMARY KEY IDENTITY(1,1),
                                BookingID INT NOT NULL,
                                CourtID INT NOT NULL,
                                SlotDate DATE NOT NULL,
                                StartTime TIME NOT NULL,
                                EndTime TIME NOT NULL,
                                LineAmount DECIMAL(10,2) NOT NULL,
                                CreatedAt DATETIME NOT NULL DEFAULT GETDATE(),
                                IsDeleted BIT NOT NULL DEFAULT 0,
                                FOREIGN KEY (BookingID) REFERENCES Bookings(BookingID) ON DELETE CASCADE,
                                FOREIGN KEY (CourtID) REFERENCES Courts(CourtID),
                                CONSTRAINT CK_BookingDetails_Time CHECK (EndTime > StartTime)
);
GO

CREATE TABLE PaymentMethods (
                                PaymentMethodID INT PRIMARY KEY IDENTITY(1,1),
                                MethodName NVARCHAR(100) NOT NULL UNIQUE,
                                Description NVARCHAR(500),
                                IsActive BIT NOT NULL DEFAULT 1,
                                CreatedAt DATETIME NOT NULL DEFAULT GETDATE(),
                                UpdatedAt DATETIME NOT NULL DEFAULT GETDATE(),
                                IsDeleted BIT NOT NULL DEFAULT 0
);
GO

CREATE TABLE Payments (
                          PaymentID INT PRIMARY KEY IDENTITY(1,1),
                          BookingID INT NOT NULL,
                          PaymentMethodID INT,
                          TransactionID NVARCHAR(100) NOT NULL,
                          Amount DECIMAL(12,2) NOT NULL CHECK (Amount >= 0),
                          PaymentStatusID INT NOT NULL,
                          PaymentDate DATETIME NOT NULL DEFAULT GETDATE(),
                          PaymentDetails NVARCHAR(MAX),
                          RefundAmount DECIMAL(12,2) DEFAULT 0,
                          RefundDate DATETIME NULL,
                          IsDeleted BIT NOT NULL DEFAULT 0,
                          FOREIGN KEY (BookingID) REFERENCES Bookings(BookingID) ON DELETE CASCADE,
                          FOREIGN KEY (PaymentMethodID) REFERENCES PaymentMethods(PaymentMethodID) ON DELETE SET NULL,
                          FOREIGN KEY (PaymentStatusID) REFERENCES PaymentStatuses(PaymentStatusID)
);

GO

CREATE TABLE PricingRules (
                              PricingID INT PRIMARY KEY IDENTITY(1,1),
                              CourtID INT NOT NULL,
                              DayType NVARCHAR(20) NOT NULL CHECK (DayType IN ('Weekday', 'Weekend')),
                              TimeSlotStart TIME NOT NULL,
                              TimeSlotEnd TIME NOT NULL,
                              PricePerHour DECIMAL(10,2) NOT NULL,
                              EffectiveFrom DATE NOT NULL,
                              EffectiveTo DATE NULL,
                              IsActive BIT NOT NULL DEFAULT 1,
                              CreatedAt DATETIME NOT NULL DEFAULT GETDATE(),
                              FOREIGN KEY (CourtID) REFERENCES Courts(CourtID) ON DELETE CASCADE,
                              CONSTRAINT CK_PricingRules_Time CHECK (TimeSlotEnd > TimeSlotStart),
                              CONSTRAINT CK_PricingRules_Effective CHECK (EffectiveTo IS NULL OR EffectiveTo >= EffectiveFrom)
);
GO

CREATE TABLE Promotions (
                            PromotionID INT PRIMARY KEY IDENTITY(1,1),
                            Code NVARCHAR(50) NOT NULL UNIQUE,
                            Title NVARCHAR(200) NOT NULL,
                            Description NVARCHAR(MAX),
                            DiscountType NVARCHAR(20) NOT NULL CHECK (DiscountType IN ('percentage', 'fixed_amount', 'buy_x_get_y')),
                            DiscountValue DECIMAL(12,2) NOT NULL CHECK (DiscountValue >= 0),
                            MinimumBookingAmount DECIMAL(12,2) NOT NULL CHECK (MinimumBookingAmount >= 0),
                            MaximumDiscount DECIMAL(12,2) CHECK (MaximumDiscount >= 0),
                            UsageLimit INT NOT NULL CHECK (UsageLimit >= 0),
                            UsageCount INT NOT NULL DEFAULT 0 CHECK (UsageCount >= 0),
                            StartDate DATETIME NOT NULL,
                            EndDate DATETIME NOT NULL,
                            ApplicableCourtTypes NVARCHAR(100),
                            ApplicableDays NVARCHAR(20),
                            PromotionStatusID INT NOT NULL,
                            CreatedAt DATETIME NOT NULL DEFAULT GETDATE(),
                            UpdatedAt DATETIME NOT NULL DEFAULT GETDATE(),
                            IsDeleted BIT NOT NULL DEFAULT 0,
                            FOREIGN KEY (PromotionStatusID) REFERENCES PromotionStatuses(PromotionStatusID)
);
GO

CREATE TABLE Reviews (
                         ReviewID INT PRIMARY KEY IDENTITY(1,1),
                         FacilityID INT NOT NULL,
                         CourtID INT NULL,
                         UserID INT NOT NULL,
                         BookingID INT,
                         Rating INT NOT NULL CHECK (Rating BETWEEN 1 AND 5),
                         Comment NVARCHAR(MAX),
                         Aspects NVARCHAR(MAX),
                         ReviewDate DATETIME NOT NULL DEFAULT GETDATE(),
                         ReviewStatusID INT NOT NULL,
                         IsVerifiedBooking BIT NOT NULL DEFAULT 0,
                         IsDeleted BIT NOT NULL DEFAULT 0,
                         FOREIGN KEY (FacilityID) REFERENCES Facilities(FacilityID) ON DELETE CASCADE,
                         FOREIGN KEY (CourtID) REFERENCES Courts(CourtID) ON DELETE NO ACTION,
                         FOREIGN KEY (UserID) REFERENCES Users(UserID) ON DELETE CASCADE,
                         FOREIGN KEY (BookingID) REFERENCES Bookings(BookingID) ON DELETE SET NULL,
                         FOREIGN KEY (ReviewStatusID) REFERENCES ReviewStatuses(ReviewStatusID)
);
GO

CREATE TABLE FacilityOperatingHours (
                                        FacilityID INT NOT NULL,
                                        DayOfWeek TINYINT NOT NULL CHECK (DayOfWeek BETWEEN 0 AND 6),
                                        OpenTime TIME NOT NULL,
                                        CloseTime TIME NOT NULL,
                                        IsClosed BIT NOT NULL DEFAULT 0,
                                        PRIMARY KEY (FacilityID, DayOfWeek),
                                        FOREIGN KEY (FacilityID) REFERENCES Facilities(FacilityID) ON DELETE CASCADE,
                                        CONSTRAINT CK_FOH_Time CHECK (IsClosed = 1 OR CloseTime > OpenTime)
);
GO

CREATE TABLE CourtMaintenance (
                                  MaintenanceID INT IDENTITY PRIMARY KEY,
                                  CourtID INT NOT NULL,
                                  StartDateTime DATETIME2 NOT NULL,
                                  EndDateTime DATETIME2 NOT NULL,
                                  Reason NVARCHAR(200),
                                  FOREIGN KEY (CourtID) REFERENCES Courts(CourtID),
                                  CONSTRAINT CK_CM_Time CHECK (EndDateTime > StartDateTime)
);
GO

CREATE TABLE BookingHolds (
                              HoldID INT IDENTITY PRIMARY KEY,
                              CourtID INT NOT NULL,
                              SlotDate DATE NOT NULL,
                              StartTime TIME NOT NULL,
                              EndTime TIME NOT NULL,
                              UserID INT NULL,
                              ExpiresAt DATETIME2 NOT NULL,
                              BookingHoldStatusID INT NOT NULL,
                              CreatedAt DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
                              FOREIGN KEY (CourtID) REFERENCES Courts(CourtID),
                              FOREIGN KEY (UserID) REFERENCES Users(UserID),
                              FOREIGN KEY (BookingHoldStatusID) REFERENCES BookingHoldStatuses(BookingHoldStatusID)
);
GO

CREATE TABLE BookingStatusHistory (
                                      HistoryID INT IDENTITY PRIMARY KEY,
                                      BookingID INT NOT NULL,
                                      OldStatus NVARCHAR(20) NULL,
                                      NewStatus NVARCHAR(20) NOT NULL,
                                      ChangedByUserID INT NULL,
                                      ChangedAt DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
                                      Note NVARCHAR(200) NULL,
                                      FOREIGN KEY (BookingID) REFERENCES Bookings(BookingID),
                                      FOREIGN KEY (ChangedByUserID) REFERENCES Users(UserID)
);
GO

/*******************************************************************************
* SECTION 4: INDEXES
*******************************************************************************/
-- Create indexes after all tables are created
CREATE UNIQUE INDEX UX_Courts_Facility_CourtName
    ON Courts(FacilityID, CourtName)
    WHERE IsDeleted = 0;
GO

CREATE UNIQUE INDEX UX_CourtImages_Main
    ON CourtImages(CourtID)
    WHERE IsMainImage = 1;
GO

CREATE UNIQUE INDEX UX_TimeSlots_CourtDateStartEnd
    ON TimeSlots(CourtID, SlotDate, StartTime, EndTime);
GO

CREATE NONCLUSTERED INDEX IX_BookingDetails_Active 
ON BookingDetails(CourtID, SlotDate, StartTime, EndTime)
WHERE IsDeleted = 0;
GO

CREATE INDEX IX_Bookings_Status
    ON Bookings(BookingStatusID)
    INCLUDE (BookingDate, IsDeleted);
GO

CREATE INDEX IX_TimeSlots_Availability
    ON TimeSlots(CourtID, SlotDate, TimeSlotStatusID);
GO

/*******************************************************************************
* SECTION 5: TRIGGERS
*******************************************************************************/
CREATE TRIGGER TRG_Users_SetUpdatedAt
    ON Users
    AFTER UPDATE
              AS
BEGIN
    SET NOCOUNT ON;
UPDATE U SET UpdatedAt = GETDATE()
    FROM Users U INNER JOIN inserted i ON U.UserID = i.UserID;
END;
GO

CREATE TRIGGER TRG_Facilities_SetUpdatedAt
    ON Facilities
    AFTER UPDATE
              AS
BEGIN
    SET NOCOUNT ON;
UPDATE F SET UpdatedAt = GETDATE()
    FROM Facilities F INNER JOIN inserted i ON F.FacilityID = i.FacilityID;
END;
GO

CREATE TRIGGER TRG_Courts_SetUpdatedAt
    ON Courts
    AFTER UPDATE
              AS
BEGIN
    SET NOCOUNT ON;
UPDATE C SET UpdatedAt = GETDATE()
    FROM Courts C INNER JOIN inserted i ON C.CourtID = i.CourtID;
END;
GO

CREATE TRIGGER TRG_Bookings_SetUpdatedAt
    ON Bookings
    AFTER UPDATE
              AS
BEGIN
    SET NOCOUNT ON;
UPDATE B SET UpdatedAt = GETDATE()
    FROM Bookings B INNER JOIN inserted i ON B.BookingID = i.BookingID;
END;
GO

CREATE TRIGGER TRG_PaymentMethods_SetUpdatedAt
    ON PaymentMethods
    AFTER UPDATE
              AS
BEGIN
    SET NOCOUNT ON;
UPDATE PM SET UpdatedAt = GETDATE()
    FROM PaymentMethods PM INNER JOIN inserted i ON PM.PaymentMethodID = i.PaymentMethodID;
END;
GO

CREATE TRIGGER TRG_Promotions_SetUpdatedAt
    ON Promotions
    AFTER UPDATE
              AS
BEGIN
    SET NOCOUNT ON;
UPDATE P SET UpdatedAt = GETDATE()
    FROM Promotions P INNER JOIN inserted i ON P.PromotionID = i.PromotionID;
END;
GO

CREATE TRIGGER TRG_BookingDetails_NoOverlap
    ON BookingDetails
    AFTER INSERT, UPDATE
                      AS
BEGIN
    SET NOCOUNT ON;
    IF EXISTS (
        SELECT 1 FROM BookingDetails bd
        JOIN inserted i ON bd.CourtID = i.CourtID
            AND bd.SlotDate = i.SlotDate
            AND bd.BookingDetailID <> i.BookingDetailID
            AND i.StartTime < bd.EndTime
            AND i.EndTime > bd.StartTime
        JOIN Bookings b ON b.BookingID = bd.BookingID
        JOIN BookingStatuses bs ON bs.BookingStatusID = b.BookingStatusID
        WHERE bs.StatusName IN ('pending','confirmed')
    )
BEGIN
        RAISERROR('Court is already booked for this time range', 16, 1);
ROLLBACK TRANSACTION;
RETURN;
END
END;
GO

/*******************************************************************************
* SECTION 6: SAMPLE DATA
*******************************************************************************/
-- Insert sample users
DECLARE @AdminRoleID INT = (SELECT RoleID FROM Roles WHERE RoleName='admin');
DECLARE @ManagerRoleID INT = (SELECT RoleID FROM Roles WHERE RoleName='manager');
DECLARE @CustomerRoleID INT = (SELECT RoleID FROM Roles WHERE RoleName='customer');
DECLARE @ActiveStatusID INT = (SELECT StatusID FROM UserStatuses WHERE StatusName='active');

INSERT INTO Users (UserName, PassWord, Email, Phone, FullName, RoleID, StatusID, DateOfBirth, Gender, Address, MembershipType)
VALUES
    ('admin1', 'hashed_password_1', 'admin@pickleball.vn', '0901234567', N'Nguyễn Văn Admin',
     @AdminRoleID, @ActiveStatusID,
     '1990-01-01', N'Nam', N'123 Đường ABC, TP.HCM', 'VIP'),

    ('manager1', 'hashed_password_2', 'manager1@pickleball.vn', '0902345678', N'Trần Thị Manager',
     @ManagerRoleID, @ActiveStatusID,
     '1985-05-15', N'Nữ', N'456 Đường XYZ, TP.HCM', 'Premium'),

    ('customer1', 'hashed_password_3', 'customer1@pickleball.vn', '0908765432', N'Lê Hoàng Khách',
     @CustomerRoleID, @ActiveStatusID,
     '1995-03-20', N'Nam', N'789 Đường DEF, TP.HCM', 'Basic');
GO

-- Insert sample facilities
INSERT INTO Facilities (
    FacilityName, Address, Province, District, Ward, 
    Phone, Email, ManagerUserID, Description, Amenities, 
    StatusID, OpenTime, CloseTime)
VALUES 
(N'Pickleball Center Q1', 
 N'123 Lê Lợi', N'TP Hồ Chí Minh', N'Quận 1', N'Phường Bến Nghé',
 '02838123456', 'q1@pickleball.vn',
 (SELECT UserID FROM Users WHERE UserName='manager1'),
 N'Trung tâm pickleball hiện đại với 8 sân chất lượng cao',
 '["Parking", "Toilet", "Shower", "Cafe", "Pro Shop", "Air Conditioning"]',
 (SELECT StatusID FROM FacilityStatuses WHERE StatusName='active'),
 '06:00:00', '22:00:00'),

(N'Sporting Complex Q7',
 N'456 Nguyễn Văn Linh', N'TP Hồ Chí Minh', N'Quận 7', N'Phường Tân Phú',
 '02837654321', 'q7@pickleball.vn',
 (SELECT UserID FROM Users WHERE UserName='manager1'),
 N'Khu thể thao đa năng với sân pickleball outdoor',
 '["Parking", "Toilet", "Restaurant", "Swimming Pool"]',
 (SELECT StatusID FROM FacilityStatuses WHERE StatusName='active'),
 '05:30:00', '23:00:00');
GO

-- Insert sample courts
INSERT INTO Courts (
    FacilityID, CourtName, TypeID, SurfaceID,
    IsIndoor, HasLighting, StatusID, Description)
VALUES 
-- Facility 1 courts
(1, N'Sân 1A', 
 (SELECT TypeID FROM CourtTypes WHERE TypeName='Standard'),
 (SELECT SurfaceID FROM CourtSurfaces WHERE SurfaceName='Synthetic'),
 1, 1, 
 (SELECT StatusID FROM CourtStatuses WHERE StatusName='available'),
 N'Sân trong nhà tiêu chuẩn, phù hợp mọi cấp độ'),

(1, N'Sân 1B',
 (SELECT TypeID FROM CourtTypes WHERE TypeName='Premium'),
 (SELECT SurfaceID FROM CourtSurfaces WHERE SurfaceName='Wood'),
 1, 1,
 (SELECT StatusID FROM CourtStatuses WHERE StatusName='available'),
 N'Sân gỗ cao cấp, trải nghiệm chơi tuyệt vời'),

-- Facility 2 courts
(2, N'Sân Ngoài 2A',
 (SELECT TypeID FROM CourtTypes WHERE TypeName='Standard'),
 (SELECT SurfaceID FROM CourtSurfaces WHERE SurfaceName='Concrete'),
 0, 1,
 (SELECT StatusID FROM CourtStatuses WHERE StatusName='available'),
 N'Sân ngoài trời có đèn chiếu sáng');
GO

-- Insert sample payment methods
INSERT INTO PaymentMethods (MethodName, Description)
VALUES 
(N'Tiền mặt tại quầy', N'Thanh toán bằng tiền mặt tại quầy lễ tân'),
(N'Chuyển khoản ngân hàng', N'Chuyển khoản qua tài khoản ngân hàng'),
(N'Ví điện tử MoMo', N'Thanh toán qua ví MoMo'),
(N'Ví điện tử ZaloPay', N'Thanh toán qua ví ZaloPay');
GO

-- Insert sample pricing rules
INSERT INTO PricingRules (
    CourtID, DayType, TimeSlotStart, TimeSlotEnd,
    PricePerHour, EffectiveFrom)
VALUES 
-- Standard court (Sân 1A) pricing
(1, 'Weekday', '06:00:00', '17:00:00', 150000, '2025-01-01'),
(1, 'Weekday', '17:00:00', '22:00:00', 200000, '2025-01-01'),
(1, 'Weekend', '06:00:00', '22:00:00', 250000, '2025-01-01'),

-- Premium court (Sân 1B) pricing
(2, 'Weekday', '06:00:00', '17:00:00', 200000, '2025-01-01'),
(2, 'Weekday', '17:00:00', '22:00:00', 280000, '2025-01-01'),
(2, 'Weekend', '06:00:00', '22:00:00', 350000, '2025-01-01');
GO

-- Insert sample bookings
DECLARE @CustomerUserID INT = (SELECT UserID FROM Users WHERE UserName = 'customer1');
DECLARE @ConfirmedStatusID INT = (SELECT BookingStatusID FROM BookingStatuses WHERE StatusName='confirmed');
DECLARE @PaidStatusID INT = (SELECT PaymentStatusID FROM PaymentStatuses WHERE StatusName='paid');

INSERT INTO Bookings (
    UserID, BookingNumber, BookingDate, TotalAmount,
    BookingStatusID, PaymentStatusID,
    CustomerName, CustomerPhone, CustomerEmail, Notes)
VALUES
    (@CustomerUserID, 'PB202501001', '2025-08-21', 300000,
     @ConfirmedStatusID,
     @PaidStatusID,
     N'Lê Hoàng Khách', '0908765432', 'customer1@pickleball.vn',
     N'Đặt sân cho nhóm 4 người');
GO

-- Insert sample booking details
INSERT INTO BookingDetails (
    BookingID, CourtID, SlotDate,
    StartTime, EndTime, LineAmount)
VALUES 
(1, 1, '2025-08-21', '07:00:00', '09:00:00', 300000);
GO

-- Insert sample facility operating hours
INSERT INTO FacilityOperatingHours (
    FacilityID, DayOfWeek, OpenTime, CloseTime, IsClosed)
VALUES
-- Facility 1 operating hours (Mon-Sun)
(1, 0, '06:00:00', '22:00:00', 0),
(1, 1, '06:00:00', '22:00:00', 0),
(1, 2, '06:00:00', '22:00:00', 0),
(1, 3, '06:00:00', '22:00:00', 0),
(1, 4, '06:00:00', '22:00:00', 0),
(1, 5, '06:00:00', '22:00:00', 0),
(1, 6, '06:00:00', '22:00:00', 0),

-- Facility 2 operating hours (Mon-Sun)
(2, 0, '05:30:00', '23:00:00', 0),
(2, 1, '05:30:00', '23:00:00', 0),
(2, 2, '05:30:00', '23:00:00', 0),
(2, 3, '05:30:00', '23:00:00', 0),
(2, 4, '05:30:00', '23:00:00', 0),
(2, 5, '05:30:00', '23:00:00', 0),
(2, 6, '05:30:00', '23:00:00', 0);
GO

/*******************************************************************************
*******************************************************************************/
--00/00/2025


/*******************************************************************************
*******************************************************************************/
--00/00/2025


/*******************************************************************************
*******************************************************************************/
--00/00/2025