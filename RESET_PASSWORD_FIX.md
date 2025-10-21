# Reset Password Token Issue - Root Cause Analysis

## Problem Summary
Reset password functionality fails with "Reset token has no expiry time" error immediately after token creation.

## Root Cause
**Database Column Size Mismatch:**
- Database schema: `Reset_Token NVARCHAR(10)`
- GUID token format: 36 characters (e.g., `dd4a9184-f0e2-4b88-b028-b81af325e5c4`)
- **Result:** Token is truncated from 36 characters to 10 characters when saved

## Evidence from Logs
```
Creating reset token for sonhuynh.0811@gmail.com
Token: dd4a9184-f0e2-4b88-b028-b81af325e5c4  ← Full token (36 chars)
Current Local Time: 10/21/2025 3:34:33 PM
Expiry Time: 10/21/2025 4:34:33 PM

UPDATE [Users] SET ... [Reset_Token] = @p13 ...  ← Saved to database

Token Expiry Time:                               ← Empty when retrieved!
Is Expired: True                                 ← Validation fails
```

## Why This Happens
1. Code generates 36-character GUID token
2. Database column only accepts 10 characters
3. SQL Server **silently truncates** the token to 10 characters
4. Token lookup by full GUID fails (no match in database)
5. Returns NULL user, causing "no expiry time" error

## Solution
**Execute the SQL migration script:**

```bash
# Run the fix script in SQL Server
sqlcmd -S localhost -d PICKLEBALLBOOKING -i fix_reset_token_column.sql
```

Or manually execute:
```sql
ALTER TABLE Users
ALTER COLUMN Reset_Token NVARCHAR(100) NULL;
```

## Additional Fixes Already Applied
✅ Changed `DateTime.UtcNow` to `DateTime.Now` (timezone fix)
✅ Updated token generation from 6-digit to GUID format
✅ Updated PickleTime.sql schema to NVARCHAR(100)

## Testing After Fix
1. Restart backend API
2. Request password reset
3. Check console logs - token should be full GUID
4. Click reset link immediately
5. Should NOT show expired error
6. Password reset should succeed

## Files Modified
- `/PickleTime.Api/Application/Services/AuthService.cs` - DateTime.Now fixes
- `/PickleTime.Api/PickleTime.sql` - Updated schema to NVARCHAR(100)
- `/PickleTime.Api/fix_reset_token_column.sql` - Migration script created
