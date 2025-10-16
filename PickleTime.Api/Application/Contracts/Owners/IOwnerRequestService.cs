using PickleTime.Api.Application.Contracts.Owners.Dtos;
using PickleTime.Api.Domain.Entities;

namespace PickleTime.Api.Application.Contracts.Owners;

public interface IOwnerRequestService
{
    Task<List<OwnerRequestDto>> GetAllRequestsAsync();
    Task<List<OwnerRequestDto>> GetRequestsByUserAsync(int userId);
    Task<OwnerRequestDto> CreateRequestAsync(CreateOwnerRequestDto dto);
    Task<OwnerRequestDto> ReviewRequestAsync(int id, ReviewOwnerRequestDto dto);
}