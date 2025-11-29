using MediatR;
using Microsoft.AspNetCore.Mvc;
using SpaBooking.Application.Requests.Users;

namespace SpaBooking.API.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {
        private readonly IMediator _mediator;

        public AuthController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterUserCommand command)
        {
            var result = await _mediator.Send(command);
            return Ok(new { UserId = result });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginUserQuery query)
        {
            try
            {
                var token = await _mediator.Send(query);
                return Ok(new { Token = token });
            }
            catch (Exception ex)
            {
                // Trả về 400 Bad Request nếu login thất bại
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}