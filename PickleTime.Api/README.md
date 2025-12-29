cd PickleTime.Api

dotnet ef dbcontext scaffold "Server=localhost;Database=PICKLEBALLBOOKING;User Id=sa;Password=123;TrustServerCertificate=True;" Microsoft.EntityFrameworkCore.SqlServer --context PickleTimeDbContext --context-dir Infrastructure/Data --output-dir Domain/Entities --force --no-onconfiguring


Application
┣ Contracts
┃ ┣ Auth
┃ ┃ ┣ Dto
┃ ┃ ┣ IAuthService.cs
┃ ┃ ┗ IUserRepository.cs
┃ ┗ Facilities
┃    ┣ Dto
┃    ┃ ┗ FacilityDto.cs
┃    ┣ IFacilityService.cs
┃    ┗ IFacilityRepository.cs
┗ Services
┣ AuthService.cs
┗ FacilityService.cs
Common
┣ Exceptions
┗ Helpers
┃    ┣JwtHelper
Controllers
┣ AuthController.cs
┗ FacilitiesController.cs
Domain
┗ Entities
┣ Facility.cs
┣ Court.cs
┗ FacilityStatus.cs
Infrastructure
┣ Data
┃ ┣ IUnitOfWork.cs
┃ ┗ PickleTimeDbContext.cs
┗ Repositories
┣ UserRepository.cs
┗ FacilityRepository.cs


------ Flow upload image --------
client(gửi form) -> controller(Upload nhận requets) -> service(UploadAsync gọi IFileStorageService) -> IFileStorageService(gọi CloudinaryService) 
-> CLoudinary(upload file) -> return (SecureUrl, PublicId) -> Tạo model CourtImage gán các thuộc tính -> ICourtImageRepository(AddSync lưu vào DB) 
-> CourtImageDto(map từ model) -> return CourtImageDto -> controller(Trả về client)

