using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SpaBooking.Application.Requests.Users;

namespace SpaBooking.API.Controllers
{
    [Authorize(Roles = "Admin")]
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

        [HttpPost] // Create user
        public async Task<IActionResult> Create([FromBody] CreateUserCommand command)
        {
            var id = await _mediator.Send(command);
            return Ok(new { UserId = id });
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

        [HttpPut("{id}")] // Update user
        public async Task<IActionResult> Update(Guid id, [FromBody] UpdateUserCommand cmd)
        {
            cmd.Id = id;
            await _mediator.Send(cmd);
            return NoContent();
        }

        [HttpDelete("{id}")] // Delete user
        public async Task<IActionResult> Delete(Guid id)
        {
            await _mediator.Send(new DeleteUserCommand { Id = id });
            return NoContent();
        }
    }
}