using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PickleTime.Api.Application.Contract.Auth.Dto;
using PickleTime.Api.Application.Services;
using PickleTime.Api.Infrastructure.Data;

namespace PickleTime.Api.Controller
{
    [ApiController]
    [Route("api/[controller]/auth")]
    public class UserController : ControllerBase
    {
        private readonly PickleTimeDbContext _context;
        private readonly AuthService _authService;

        public UserController(PickleTimeDbContext context, AuthService authService)
        {
            _context = context;
            _authService = authService;
        }

        
    }
}