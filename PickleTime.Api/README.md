`cd PickleTime.Api`

dotnet ef dbcontext scaffold \
"Server=localhost;Database=PICKLEBALLBOOKING;User Id=sa;Password=123;TrustServerCertificate=True;" \
Microsoft.EntityFrameworkCore.SqlServer \
--context PickleTimeDbContext \
--context-dir Infrastructure/Data \
--output-dir Domain/Entities \
--force \
--no-onconfiguring


