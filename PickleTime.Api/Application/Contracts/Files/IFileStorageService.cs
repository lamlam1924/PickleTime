namespace PickleTime.Api.Application.Contracts.Files;

public interface IFileStorageService
{
    Task<(string Url, string PublicId)> UploadImageAsync(IFormFile file, string folder);
    Task<bool> DeleteImageAsync(string publicId);
}