using PickleTime.Api.Domain.Entities;

namespace PickleTime.Api.Application.Contracts.Owners;

public interface IOwnerRequestRepository
{
    Task<List<OwnerRequest>> GetAllAsync();
    Task<List<OwnerRequest>> GetByUserAsync(int userId);
    Task<OwnerRequest?> GetByIdAsync(int id);
    Task AddAsync(OwnerRequest request);
    Task UpdateAsync(OwnerRequest request);
    Task SaveChangesAsync();
}