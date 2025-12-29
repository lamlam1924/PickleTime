using AutoMapper;
using PickleTime.Api.Application.Contracts.Notifications.Dtos;
using PickleTime.Api.Domain.Entities;

namespace PickleTime.Api.Application.Mapping;

public class NotificationProfile : Profile
{
    public NotificationProfile()
    {
        CreateMap<Notification, NotificationDto>()
            .ForMember(dest => dest.Read, opt => opt.Ignore()) // sẽ được gán từ Status
            .ForMember(dest => dest.Timestamp, opt => opt.MapFrom(src => src.CreatedAt));
    }
}