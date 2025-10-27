using AutoMapper;
using PickleTime.Api.Application.Contracts.Owners.Dtos;
using PickleTime.Api.Domain.Entities;

namespace PickleTime.Api.Application.Mapping;

public class OwnerProfile : Profile
{
    public OwnerProfile()
    {
        // Entity → DTO (Response)
        CreateMap<OwnerRequest, OwnerRequestDto>()
            .ForMember(dest => dest.StatusName, opt => opt.MapFrom(src => src.Status.StatusName))
            .ForMember(dest => dest.ReviewedByName, opt => opt.MapFrom(src => src.ReviewedByNavigation != null ? src.ReviewedByNavigation.FullName : null));

        // DTO → Entity (Create)
        CreateMap<CreateOwnerRequestDto, OwnerRequest>()
            .ForMember(dest => dest.RequestId, opt => opt.Ignore())
            .ForMember(dest => dest.StatusId, opt => opt.MapFrom(_ => 1)) // Pending
            .ForMember(dest => dest.SubmittedAt, opt => opt.MapFrom(_ => DateTime.Now))
            .ForMember(dest => dest.ReviewedAt, opt => opt.Ignore())
            .ForMember(dest => dest.ReviewedBy, opt => opt.Ignore())
            .ForMember(dest => dest.AdminNote, opt => opt.Ignore())
            .ForMember(dest => dest.Status, opt => opt.Ignore())
            .ForMember(dest => dest.ReviewedByNavigation, opt => opt.Ignore())
            .ForMember(dest => dest.CreatedUser, opt => opt.Ignore());

        // DTO → Entity (Admin review)
        CreateMap<ReviewOwnerRequestDto, OwnerRequest>()
            .ForMember(dest => dest.ReviewedAt, opt => opt.MapFrom(_ => DateTime.Now))
            .ForMember(dest => dest.AdminNote, opt => opt.MapFrom(src => src.AdminNote))
            .ForMember(dest => dest.ReviewedBy, opt => opt.MapFrom(src => src.ReviewedBy))
            .ForMember(dest => dest.StatusId, opt => opt.MapFrom(src => src.StatusId));
    }
}