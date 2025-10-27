using System.IdentityModel.Tokens.Jwt;
using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using PickleTime.Api.Application.Contracts.Admin;
using PickleTime.Api.Application.Contracts.Auth;
using PickleTime.Api.Application.Contracts.Facilities;
using PickleTime.Api.Application.Contracts.Files;
using PickleTime.Api.Application.Contracts.Images;
using PickleTime.Api.Application.Contracts.OwnerProfile;
using PickleTime.Api.Application.Contracts.Owners;
using PickleTime.Api.Application.Contracts.Profile;
using PickleTime.Api.Application.Contracts.Reviews;
using PickleTime.Api.Application.Contracts.Roles;
using PickleTime.Api.Application.Mapping;
using PickleTime.Api.Application.Services;
using PickleTime.Api.Common.Helpers;
using PickleTime.Api.Infrastructure.Data;
using PickleTime.Api.Infrastructure.Repositories;
using PickleTime.Api.Infrastructure.Repositories.Bookings;

// Clear default claim type mapping
JwtSecurityTokenHandler.DefaultInboundClaimTypeMap.Clear();

var builder = WebApplication.CreateBuilder(args);

// =============================================================
// 1. Add services to DI container
// =============================================================
// Đăng ký DbContext (EF Core, Database First)
builder.Services.AddDbContext<PickleTimeDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Đăng ký Repository
builder.Services.AddScoped<ICourtImageRepository, CourtImageRepository>();
builder.Services.AddScoped<IFacilityRepository, FacilityRepository>();
builder.Services.AddScoped<IFacilityImageRepository, FacilityImageRepository>();
builder.Services.AddScoped<IReviewRepository, ReviewRepository>();
builder.Services.AddScoped<IOwnerRequestRepository, OwnerRequestRepository>();
builder.Services.AddScoped<IRoleRepository, RoleRepository>();

//Đăng ký Service
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IEmailService, EmailService>();
builder.Services.AddScoped<IAdminService, AdminService>();
builder.Services.AddScoped<IProfileService, ProfileService>();
builder.Services.AddScoped<IOwnerProfileService, OwnerProfileService>();
builder.Services.AddSingleton<JwtService>();
builder.Services.AddScoped<ICourtImageService, CourtImageService>();
builder.Services.AddScoped<IFacilityService, FacilityService>();
builder.Services.AddScoped<IFacilityImageService, FacilityImageService>();
builder.Services.AddScoped<IReviewService, ReviewService>();
builder.Services.AddScoped<IOwnerRequestService, OwnerRequestService>();

// Đăng ký AutoMapper
builder.Services.AddAutoMapper(typeof(FacilityProfile));
builder.Services.AddAutoMapper(typeof(OwnerProfile));

// Đăng ký Cloudinary
builder.Services.Configure<CloudinarySettings>(
    builder.Configuration.GetSection("CloudinarySettings"));
builder.Services.AddScoped<IFileStorageService, CloudinaryService>();

builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        // Convert PascalCase to camelCase for JSON responses
        options.JsonSerializerOptions.PropertyNamingPolicy = System.Text.Json.JsonNamingPolicy.CamelCase;
    });
    
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:5173")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

// =============================================================
// Authentication
// =============================================================
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
.AddJwtBearer(JwtBearerDefaults.AuthenticationScheme, options =>
{
    var key = builder.Configuration["Jwt:Key"] ?? "";
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = builder.Configuration["Jwt:Issuer"],
        ValidAudience = builder.Configuration["Jwt:Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key)),
        RoleClaimType = System.Security.Claims.ClaimTypes.Role,
        NameClaimType = System.Security.Claims.ClaimTypes.Name
    };
});

// Add Authorization (sẽ dùng [Authorize] ở Controller)
builder.Services.AddAuthorization();

var app = builder.Build();

// =============================================================
// 2. Configure Middleware pipeline
// =============================================================
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseRouting();

app.UseCors("AllowFrontend");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers(); // ✅ dùng MapControllers thay vì UseEndpoints

app.Run();

