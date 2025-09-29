using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using PickleTime.Api.Application.Contracts.Auth;
using PickleTime.Api.Application.Services;
using PickleTime.Api.Common.Helpers;
using PickleTime.Api.Infrastructure.Data;
using PickleTime.Api.Infrastructure.Repositories.Bookings;

var builder = WebApplication.CreateBuilder(args);

// =============================================================
// 1. Add services to DI container
// =============================================================
// Đăng ký DbContext (EF Core, Database First)
builder.Services.AddDbContext<PickleTimeDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Đăng ký Service và Jwt helper
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddSingleton<JwtService>();
builder.Services.AddScoped<IUserRepository, UserRepository>();

// Đăng ký CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:5173") // React dev server
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

// Add Authentication với JWT
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        // Quy định cách validate token
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true, // Có validate Issuer không
            ValidateAudience = true, // Có validate Audience không
            ValidateLifetime = true, // Có kiểm tra hết hạn không
            ValidateIssuerSigningKey = true, // Có check chữ ký không

            ValidIssuer = builder.Configuration["Jwt:Issuer"], // Issuer hợp lệ
            ValidAudience = builder.Configuration["Jwt:Audience"], // Audience hợp lệ
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"])) // Key để verify token
        };
    });

// Add Authorization (sẽ dùng [Authorize] ở Controller)
builder.Services.AddAuthorization();

// Add Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Add Controllers (nếu bạn có controller class)
builder.Services.AddControllers();

// =============================================================
// 2. Configure Middleware pipeline
// =============================================================
var app = builder.Build();

// Quan trọng: bật Auth middleware
app.UseAuthentication();
app.UseAuthorization();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// ⚠️ Quan trọng: CORS phải trước Authentication
app.UseCors("AllowFrontend");

app.MapControllers();

app.Run();

