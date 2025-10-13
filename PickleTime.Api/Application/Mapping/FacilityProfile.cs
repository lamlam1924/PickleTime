using AutoMapper;
using PickleTime.Api.Application.Contracts.Facilities.Dtos;
using PickleTime.Api.Domain.Entities;

namespace PickleTime.Api.Application.Services.MappingProfiles;

public class FacilityProfile : Profile
{
    public FacilityProfile()
    {
        CreateMap<Facility, FacilityDto>()
            .ForMember(dest => dest.ImageUrls,
                opt => opt.MapFrom(src => src.FacilityImages
                    .Where(img => !img.IsDeleted)
                    .OrderBy(img => img.DisplayOrder)
                    .Select(img => img.ImageUrl)))
            .ForMember(dest => dest.MainImageUrl,
                opt => opt.MapFrom(src =>
                    src.FacilityImages
                        .Where(img => !img.IsDeleted && img.IsMainImage)
                        .OrderBy(img => img.DisplayOrder)
                        .Select(img => img.ImageUrl)
                        .FirstOrDefault()
                    ?? src.FacilityImages
                        .Where(img => !img.IsDeleted)
                        .OrderBy(img => img.DisplayOrder)
                        .Select(img => img.ImageUrl)
                        .FirstOrDefault() ));

        CreateMap<Facility, FacilityDetailDto>()
            .ForMember(dest => dest.StatusName, opt => opt.MapFrom(src => src.Status.StatusName))
            .ForMember(dest => dest.OperatingHours, opt => opt.MapFrom(src => src.FacilityOperatingHours));

        CreateMap<FacilityImage, FacilityImageDto>();
        CreateMap<CourtImage, CourtImageDto>();
        CreateMap<FacilityOperatingHour, FacilityOperatingHourDto>();

        CreateMap<Court, CourtDto>()
            .ForMember(dest => dest.TypeName, opt => opt.MapFrom(src => src.Type.TypeName))
            .ForMember(dest => dest.SurfaceName, opt => opt.MapFrom(src => src.Surface.SurfaceName))
            .ForMember(dest => dest.StatusName, opt => opt.MapFrom(src => src.Status.StatusName));

    }
}