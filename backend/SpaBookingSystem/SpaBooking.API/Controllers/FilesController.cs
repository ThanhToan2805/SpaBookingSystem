using Microsoft.AspNetCore.Mvc;
using SpaBooking.API.Contracts.Files;
using SpaBooking.Application.Interfaces.Services;

namespace SpaBooking.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class FilesController : ControllerBase
    {
        private readonly ICloudinaryService _cloudinary;

        public FilesController(ICloudinaryService cloudinary)
        {
            _cloudinary = cloudinary;
        }

        [HttpPost("upload")]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> Upload([FromForm] UploadFileRequest request)
        {
            var file = request.File;

            if (file == null || file.Length == 0)
                return BadRequest("No file provided");

            using var ms = new MemoryStream();
            await file.CopyToAsync(ms);

            var url = await _cloudinary.UploadImageAsync(
                ms.ToArray(),
                file.FileName,
                "SpaBooking"
            );

            return Ok(new { url });
        }

        [HttpDelete("delete")]
        public async Task<IActionResult> Delete([FromQuery] string publicId)
        {
            var result = await _cloudinary.DeleteImageAsync(publicId);

            return result ? Ok("Deleted") : BadRequest("Delete failed");
        }
    }
}