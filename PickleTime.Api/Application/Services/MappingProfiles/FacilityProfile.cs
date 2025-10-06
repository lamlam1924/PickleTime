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
                        .FirstOrDefault()
                ));




    }
}