using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SpaBooking.Application.Requests.Users;

namespace SpaBooking.API.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : ControllerBase
    {
        private readonly IMediator _mediator;
        public UsersController(IMediator mediator) => _mediator = mediator;

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var result = await _mediator.Send(new GetAllUsersQuery());
            return Ok(result);
        }

        [HttpGet("profile")]
        public async Task<IActionResult> GetProfile()
        {
            var userIdClaim = User.FindFirst("UserId");
            if (userIdClaim == null)
                return Unauthorized("UserId claim not found");

            var userId = Guid.Parse(userIdClaim.Value);
            var result = await _mediator.Send(new GetProfileQuery(userId));
            return Ok(result);
        }

        [HttpPut("profile")]
        public async Task<IActionResult> UpdateProfile([FromBody] UpdateProfileCommand cmd)
        {
            var userId = Guid.Parse(User.FindFirst("UserId")!.Value);

            var result = await _mediator.Send(
                new UpdateProfileCommand(userId, cmd.FullName, cmd.PhoneNumber)
            );

            return Ok(result);
        }
    }
}