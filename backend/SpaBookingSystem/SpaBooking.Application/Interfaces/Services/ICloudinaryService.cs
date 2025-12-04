namespace SpaBooking.Application.Interfaces.Services
{
    public interface ICloudinaryService
    {
        Task<string> UploadImageAsync(byte[] fileBytes, string fileName, string folder);
        Task<bool> DeleteImageAsync(string publicId);
    }
}