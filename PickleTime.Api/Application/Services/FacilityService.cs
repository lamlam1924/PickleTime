using AutoMapper;
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