using AutoMapper;
using PickleTime.Api.Application.Contracts.Courts.Dtos;
using PickleTime.Api.Application.Contracts.Facilities.Dtos;
using PickleTime.Api.Application.Contracts.Images.Dtos;
using PickleTime.Api.Application.Contracts.Reviews.Dtos;
using PickleTime.Api.Domain.Entities;
using FacilityImageDto = PickleTime.Api.Application.Contracts.Facilities.Dtos.FacilityImageDto;

namespace PickleTime.Api.Application.Mapping;

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
            .ForMember(dest => dest.FacilityImages, opt => opt.MapFrom(src => 
                src.FacilityImages.Where(img => !img.IsDeleted).OrderBy(img => img.DisplayOrder)))
            .ForMember(dest => dest.Amenities, opt => opt.MapFrom(src => 
                src.FacilityAmenities.Where(fa => fa.Amenity.IsActive).Select(fa => fa.Amenity)))
            .ForMember(dest => dest.Courts, opt => opt.MapFrom(src => 
                src.Courts.Where(c => !c.IsDeleted)))
            .ForMember(dest => dest.OperatingHours, opt => opt.MapFrom(src => 
                src.FacilityOperatingHours.OrderBy(oh => oh.DayOfWeek)))
            .ForMember(dest => dest.Reviews, opt => opt.MapFrom(src => 
                src.Reviews.Where(r => !r.IsDeleted && r.ReviewStatus.StatusName == "Approved")))
            .ForMember(dest => dest.AverageRating, opt => opt.MapFrom(src =>
                src.Reviews.Where(r => !r.IsDeleted && r.ReviewStatus.StatusName == "Approved").Any()
                    ? src.Reviews.Where(r => !r.IsDeleted && r.ReviewStatus.StatusName == "Approved").Average(r => r.Rating)
                    : 0
            ));

        CreateMap<FacilityImage, FacilityImageDto>()
            .ForMember(dest => dest.CourtImage, opt => opt.MapFrom(src => src.CourtImage));
        
        CreateMap<CourtImage, CourtImageDto>();
        
        CreateMap<Amenity, AmenityDto>();
        
        CreateMap<FacilityOperatingHour, FacilityOperatingHourDto>();

        CreateMap<Court, CourtDto>()
            .ForMember(dest => dest.TypeName, opt => opt.MapFrom(src => src.Type.TypeName))
            .ForMember(dest => dest.SurfaceName, opt => opt.MapFrom(src => src.Surface.SurfaceName))
            .ForMember(dest => dest.StatusName, opt => opt.MapFrom(src => src.Status.StatusName));
       
        CreateMap<Review, ReviewDto>()
            .ForMember(dest => dest.UserName, opt => opt.MapFrom(src => src.User.FullName));
    }
}