using AutoMapper;
using PickleTime.Api.Application.Contracts.Auth;
using PickleTime.Api.Application.Contracts.Notifications;
using PickleTime.Api.Application.Contracts.Owners;
using PickleTime.Api.Application.Contracts.Owners.Dtos;
using PickleTime.Api.Domain.Entities;

namespace PickleTime.Api.Application.Services;

public class OwnerRequestService : IOwnerRequestService
{
    private readonly IOwnerRequestRepository _ownerRequestRepository;
    private readonly IMapper _mapper;
    private readonly INotificationService _notificationService;
    private readonly IUserRepository _userRepository;

    public OwnerRequestService(IOwnerRequestRepository repo, IMapper mapper,
        INotificationService notificationService, IUserRepository userRepository)
    {
        _ownerRequestRepository = repo;
        _mapper = mapper;
        _notificationService = notificationService;
        _userRepository = userRepository;
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

        var result = _mapper.Map<OwnerRequestDto>(entity);

        //1. Gửi notif cho user
        await _notificationService.SendNotificationAsync(
            userId: dto.CreatedUserId,
            typeId: 1,
            title: "Đã gửi yêu cầu",
            message: "Yêu cầu trở thành chủ sân đã được gửi đến admin thành công!",
            requestId: result.RequestId
        );

        //2. Gửi notif cho admin
        var adminIds = await _userRepository.GetUserIdsByRoleAsync(1);
        foreach (var adminId in adminIds)
        {
            await _notificationService.SendNotificationAsync(
                userId: adminId,
                typeId: 4, // Admin: Yêu cầu mới
                title: "Yêu cầu đăng ký mới",
                message: $"Người dùng {dto.FullName} vừa gửi yêu cầu chủ sân.",
                requestId: result.RequestId
            );
        }

        return result;
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
        var result = await ReviewRequestAsync(id, dto);

        // Gửi notification realtime cho user
        if (result?.CreatedUserId > 0)
        {
            await _notificationService.SendNotificationAsync(
                userId: result.CreatedUserId,
                typeId: 2,
                title: "Yêu cầu đã được duyệt",
                message: "Yêu cầu trở thành chủ sân của bạn đã được chấp nhận!",
                requestId: result.RequestId
            );
            
            Console.WriteLine($"[OwnerRequestService.AcceptRequestAsync] Adding Owner role to user {result.CreatedUserId}");
            
            // Thêm role Owner (roleId = 2) cho user
            try
            {
                await _userRepository.AddRoleToUserAsync(result.CreatedUserId, 2);
                Console.WriteLine($"[OwnerRequestService.AcceptRequestAsync] Successfully added Owner role");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[OwnerRequestService.AcceptRequestAsync] Failed to add role: {ex.Message}");
                Console.WriteLine($"[OwnerRequestService.AcceptRequestAsync] Stack trace: {ex.StackTrace}");
                throw; // Re-throw để không silent fail
            }
        }
        
        return result;
    }

    public async Task<OwnerRequestDto> RejectRequestAsync(int id, int adminId)
    {
        var dto = new ReviewOwnerRequestDto { StatusId = 3, ReviewedBy = adminId };
        var result = await ReviewRequestAsync(id, dto);

        if (result?.CreatedUserId > 0)
        {
            await _notificationService.SendNotificationAsync(
                userId: result.CreatedUserId,
                typeId: 3,
                title: "Yêu cầu bị từ chối",
                message: "Yêu cầu trở thành chủ sân của bạn đã bị từ chối.",
                requestId: result.RequestId
            );
        }

        return result;
    }

    public async Task<OwnerRequestDto> ReconsiderRequestAsync(int id, int adminId)
    {
        var dto = new ReviewOwnerRequestDto { StatusId = 1, ReviewedBy = adminId };
        // Bỏ check StatusId trong ReviewRequestAsync nếu muốn allow reconsider
        return await ReviewRequestAsync(id, dto);
    }
}