using AutoMapper;
using PickleTime.Api.Application.Contracts.Owners;
using PickleTime.Api.Application.Contracts.Owners.Dtos;
using PickleTime.Api.Domain.Entities;

namespace PickleTime.Api.Application.Services;

public class OwnerRequestService : IOwnerRequestService
{
    private readonly IOwnerRequestRepository _ownerRequestRepository;
    private readonly IMapper _mapper;

    public OwnerRequestService(IOwnerRequestRepository repo, IMapper mapper)
    {
        _ownerRequestRepository = repo;
        _mapper = mapper;
    }

    public async Task<List<OwnerRequestDto>> GetAllRequestsAsync()
    {
        var requests = await _ownerRequestRepository.GetAllAsync();
        return _mapper.Map<List<OwnerRequestDto>>(requests);
    }

    public async Task<List<OwnerRequestDto>> GetRequestsByUserAsync(int userId)
    {
        var requests = await _ownerRequestRepository.GetByUserAsync(userId);
        return _mapper.Map<List<OwnerRequestDto>>(requests);
    }

    public async Task<OwnerRequestDto> CreateRequestAsync(CreateOwnerRequestDto dto)
    {
        var entity = _mapper.Map<OwnerRequest>(dto);
        await _ownerRequestRepository.AddAsync(entity);
        await _ownerRequestRepository.SaveChangesAsync();

        return _mapper.Map<OwnerRequestDto>(entity);
    }

    public async Task<OwnerRequestDto> ReviewRequestAsync(int id, ReviewOwnerRequestDto dto)
    {
        var entity = await _ownerRequestRepository.GetByIdAsync(id);
        if (entity == null)
            throw new Exception("Request not found.");

        // Chỉ kiểm tra trạng thái nếu không phải Reconsider
        if (dto.StatusId != 1 && entity.StatusId != 1)
            throw new Exception("Request has already been reviewed.");

        _mapper.Map(dto, entity);

        // Cập nhật thời gian review
        entity.ReviewedAt = DateTime.UtcNow;
        
        await _ownerRequestRepository.UpdateAsync(entity);
        await _ownerRequestRepository.SaveChangesAsync();

        return _mapper.Map<OwnerRequestDto>(entity);
    }
    public async Task<OwnerRequestDto> AcceptRequestAsync(int id, int adminId)
    {
        var dto = new ReviewOwnerRequestDto { StatusId = 2, ReviewedBy = adminId };
        return await ReviewRequestAsync(id, dto);
    }

    public async Task<OwnerRequestDto> RejectRequestAsync(int id, int adminId)
    {
        var dto = new ReviewOwnerRequestDto { StatusId = 3, ReviewedBy = adminId };
        return await ReviewRequestAsync(id, dto);
    }

    public async Task<OwnerRequestDto> ReconsiderRequestAsync(int id, int adminId)
    {
        var dto = new ReviewOwnerRequestDto { StatusId = 1, ReviewedBy = adminId, AdminNote = null };
        // Bỏ check StatusId trong ReviewRequestAsync nếu muốn allow reconsider
        return await ReviewRequestAsync(id, dto);
    }

}
