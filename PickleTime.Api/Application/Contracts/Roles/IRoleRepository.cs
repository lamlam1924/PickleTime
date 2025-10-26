using PickleTime.Api.Domain.Entities;

namespace PickleTime.Api.Application.Contracts.Roles;

public interface IRoleRepository
{
    Task<Role?> GetByIdAsync(int roleId);
    Task<Role?> GetByNameAsync(string roleName);
    Task<IEnumerable<Role>> GetAllAsync();
}