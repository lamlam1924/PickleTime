-- Fix Reset_Token column to support GUID (36 characters)
-- Current: NVARCHAR(10) - Too small for GUID
-- Required: NVARCHAR(100) - Enough for GUID format

USE PICKLEBALLBOOKING;
GO

-- Alter the Reset_Token column to increase size
ALTER TABLE Users
ALTER COLUMN Reset_Token NVARCHAR(100) NULL;
GO

-- Verify the change
SELECT 
    COLUMN_NAME,
    DATA_TYPE,
    CHARACTER_MAXIMUM_LENGTH
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_NAME = 'Users' 
  AND COLUMN_NAME IN ('Reset_Token', 'Reset_Token_Expiry');
GO

PRINT 'Reset_Token column size updated successfully!';
