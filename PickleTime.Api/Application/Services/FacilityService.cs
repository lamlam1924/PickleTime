using AutoMapper;
using Microsoft.EntityFrameworkCore;
using PickleTime.Api.Application.Contracts.Facilities;
using PickleTime.Api.Application.Contracts.Facilities.Dtos;

namespace PickleTime.Api.Application.Services;

public class FacilityService : IFacilityService
{
    private readonly IFacilityRepository _facilityRepository;
    private readonly IMapper _mapper;

    public FacilityService(IFacilityRepository repository, IMapper mapper)
    {
        _facilityRepository = repository;
        _mapper = mapper;
    }
    
    public async Task<IEnumerable<FacilityDto>> SearchFacilitiesAsync(string keyword)
    {
        var facilities = await _facilityRepository.SearchAsync(keyword);
        return _mapper.Map<IEnumerable<FacilityDto>>(facilities);
    }

    public async Task<FacilitySearchResultDto> AdvancedSearchAsync(FacilitySearchFilterDto filter)
    {
        var facilities = await _facilityRepository.GetAllWithDetailsAsync();
        
        // Apply filters
        var query = facilities.AsQueryable();

        // Search term filter
        if (!string.IsNullOrWhiteSpace(filter.SearchTerm))
        {
            var searchLower = filter.SearchTerm.ToLower();
            query = query.Where(f => 
                f.FacilityName.ToLower().Contains(searchLower) ||
                f.Address.ToLower().Contains(searchLower) ||
                (f.Description != null && f.Description.ToLower().Contains(searchLower))
            );
        }

        // Location filters
        if (!string.IsNullOrWhiteSpace(filter.Province))
        {
            query = query.Where(f => f.Province == filter.Province);
        }
        
        if (!string.IsNullOrWhiteSpace(filter.District))
        {
            var districtLower = filter.District.ToLower();
            query = query.Where(f => f.District.ToLower().Contains(districtLower));
        }

        // Rating filter
        if (filter.MinRating > 0)
        {
            query = query.Where(f => f.Rating >= filter.MinRating);
        }

        // Court type filter
        if (filter.CourtTypes != null && filter.CourtTypes.Any())
        {
            query = query.Where(f => f.Courts.Any(c => 
                filter.CourtTypes.Any(type => 
                    c.Type.TypeName.ToLower().Contains(type.ToLower())
                )
            ));
        }

        // Indoor/Outdoor filter
        if (filter.IsIndoor.HasValue)
        {
            query = query.Where(f => f.Courts.Any(c => c.IsIndoor == filter.IsIndoor.Value));
        }

        // Lighting filter
        if (filter.HasLighting.HasValue && filter.HasLighting.Value)
        {
            query = query.Where(f => f.Courts.Any(c => c.HasLighting));
        }

        // Sorting
        query = filter.SortBy?.ToLower() switch
        {
            "rating" => query.OrderByDescending(f => f.Rating),
            "name" => query.OrderBy(f => f.FacilityName),
            "newest" => query.OrderByDescending(f => f.CreatedAt),
            _ => query.OrderByDescending(f => f.Rating).ThenBy(f => f.FacilityName) // default: relevance
        };

        var totalCount = query.Count();

        // Pagination
        var pagedFacilities = query
            .Skip((filter.Page - 1) * filter.PageSize)
            .Take(filter.PageSize)
            .ToList();

        return new FacilitySearchResultDto
        {
            Facilities = _mapper.Map<List<FacilityDto>>(pagedFacilities),
            TotalCount = totalCount,
            Page = filter.Page,
            PageSize = filter.PageSize
        };
    }
    
    public async Task<IEnumerable<FacilityDto>> GetAllAsync()
    {
        var facilities = await _facilityRepository.GetAllAsync();
        return _mapper.Map<IEnumerable<FacilityDto>>(facilities);
    }


    public async Task<FacilityDto?> GetByIdAsync(int id)
    {
        var facility = await _facilityRepository.GetByIdAsync(id);
        return facility == null ? null : _mapper.Map<FacilityDto>(facility);
    }
    public async Task<FacilityDetailDto?> GetFacilityByIdAsync(int id)
    {
        var facility = await _facilityRepository.GetByIdWithDetailsAsync(id);
        if (facility == null)
            return null;

        var dto = _mapper.Map<FacilityDetailDto>(facility);
        return dto;
    }
}