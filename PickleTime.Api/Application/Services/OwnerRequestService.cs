using AutoMapper;
using PickleTime.Api.Application.Contracts.Owners;
using PickleTime.Api.Application.Contracts.Owners.Dtos;
using PickleTime.Api.Domain.Entities;

namespace PickleTime.Api.Application.Services;

public class OwnerRequestService : IOwnerRequestService
{
    private readonly IOwnerRequestRepository _repo;
    private readonly IMapper _mapper;

    public OwnerRequestService(IOwnerRequestRepository repo, IMapper mapper)
    {
        _repo = repo;
        _mapper = mapper;
    }

    public async Task<List<OwnerRequestDto>> GetAllRequestsAsync()
    {
        var requests = await _repo.GetAllAsync();
        return _mapper.Map<List<OwnerRequestDto>>(requests);
    }

    public async Task<List<OwnerRequestDto>> GetRequestsByUserAsync(int userId)
    {
        var requests = await _repo.GetByUserAsync(userId);
        return _mapper.Map<List<OwnerRequestDto>>(requests);
    }

    public async Task<OwnerRequestDto> CreateRequestAsync(CreateOwnerRequestDto dto)
    {
        var entity = _mapper.Map<OwnerRequest>(dto);
        await _repo.AddAsync(entity);
        await _repo.SaveChangesAsync();

        return _mapper.Map<OwnerRequestDto>(entity);
    }

    public async Task<OwnerRequestDto> ReviewRequestAsync(int id, ReviewOwnerRequestDto dto)
    {
        var entity = await _repo.GetByIdAsync(id);
        if (entity == null)
            throw new Exception("Request not found.");

        if (entity.StatusId != 1)
            throw new Exception("Request has already been reviewed.");

        _mapper.Map(dto, entity);

        await _repo.UpdateAsync(entity);
        await _repo.SaveChangesAsync();

        return _mapper.Map<OwnerRequestDto>(entity);
    }
}
