using PickleTime.Api.Application.Contracts.Files;
using PickleTime.Api.Application.Contracts.Images;
using PickleTime.Api.Application.Contracts.Images.Dtos;
using PickleTime.Api.Domain.Entities;

namespace PickleTime.Api.Application.Services;

 public class FacilityImageService : IFacilityImageService
    {
        private readonly IFileStorageService _fileStorageService;
        private readonly IFacilityImageRepository _facilityImageRepository;

        public FacilityImageService(IFileStorageService fileStorageService, IFacilityImageRepository facilityImageRepository)
        {
            _fileStorageService = fileStorageService;
            _facilityImageRepository = facilityImageRepository;
        }

        public async Task<IEnumerable<FacilityImageDto>> GetByFacilityIdAsync(int facilityId)
        {
            var images = await _facilityImageRepository.GetByFacilityIdAsync(facilityId);

            return images.Select(x => new FacilityImageDto
            {
                Id = x.ImageId,
                FacilityId = x.FacilityId,
                ImageUrl = x.ImageUrl,
                PublicId = x.PublicId ?? string.Empty,
                Description = x.Description,
                IsMainImage = x.IsMainImage,
                DisplayOrder = x.DisplayOrder
            });
        }

        public async Task<FacilityImageDto> UploadAsync(FacilityImageUploadRequest request)
        {
            var (url, publicId) = await _fileStorageService.UploadImageAsync(request.File, "facilities");

            var entity = new FacilityImage
            {
                FacilityId = request.FacilityId,
                ImageUrl = url,
                PublicId = publicId,
                Description = request.Description,
                IsMainImage = request.IsMainImage,
                DisplayOrder = request.DisplayOrder,
                IsDeleted = false
            };

            await _facilityImageRepository.AddAsync(entity);

            return new FacilityImageDto
            {
                Id = entity.ImageId,
                FacilityId = entity.FacilityId,
                ImageUrl = entity.ImageUrl,
                PublicId = entity.PublicId ?? string.Empty,
                Description = entity.Description,
                IsMainImage = entity.IsMainImage,
                DisplayOrder = entity.DisplayOrder
            };
        }

        public async Task<bool> DeleteAsync(int imageId)
        {
            var image = await _facilityImageRepository.GetByIdAsync(imageId);
            if (image == null) return false;

            await _fileStorageService.DeleteImageAsync(image.PublicId);

            await _facilityImageRepository.DeleteAsync(image);

            return true;
        }
    }