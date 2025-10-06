using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using PickleTime.Api.Application.Contracts.Files;
using PickleTime.Api.Application.Contracts.Images;
using PickleTime.Api.Application.Contracts.Images.Dtos;
using PickleTime.Api.Domain.Entities;

namespace PickleTime.Api.Application.Services;

 public class CourtImageService : ICourtImageService
    {
        private readonly IFileStorageService _fileStorageService;
        private readonly ICourtImageRepository _courtImageRepository;

        public CourtImageService(IFileStorageService fileStorageService, ICourtImageRepository courtImageRepository)
        {
            _fileStorageService = fileStorageService;
            _courtImageRepository = courtImageRepository;
        }

        public async Task<IEnumerable<CourtImageDto>> GetByCourtIdAsync(int courtId)
        {
            var images = await _courtImageRepository.GetByCourtIdAsync(courtId);
            return images.Select(x => new CourtImageDto
            {
                Id = x.ImageId,
                CourtId = x.CourtId,
                ImageUrl = x.ImageUrl,
                Description = x.Description,
                IsMainImage = x.IsMainImage,
                DisplayOrder = x.DisplayOrder
            });
        }

        public async Task<CourtImageDto> UploadAsync(CourtImageUploadRequest request)
        {
            // Upload lên Cloudinary
            var (url, publicId) = await _fileStorageService.UploadImageAsync(request.File, "courts");

            // Lưu DB
            var entity = new CourtImage
            {
                CourtId = request.CourtId,
                ImageUrl = url,
                PublicId = publicId,
                Description = request.Description,
                IsMainImage = request.IsMainImage,
                DisplayOrder = request.DisplayOrder,
                IsDeleted = false
            };

            await _courtImageRepository.AddAsync(entity);

            return new CourtImageDto
            {
                Id = entity.ImageId,
                CourtId = entity.CourtId,
                ImageUrl = entity.ImageUrl,
                Description = entity.Description,
                IsMainImage = entity.IsMainImage,
                DisplayOrder = entity.DisplayOrder
            };
        }

        public async Task<bool> DeleteAsync(int imageId)
        {
            var image = await _courtImageRepository.GetByIdAsync(imageId);
            if (image == null) return false;

            // Xóa trên Cloudinary
            await _fileStorageService.DeleteImageAsync(image.PublicId);

            // Xóa trong DB
            await _courtImageRepository.DeleteAsync(image);

            return true;
        }
    }