using MediatR;
using Microsoft.AspNetCore.Mvc;
using SpaBooking.Application.Requests.Bookings;
using SpaBooking.Contracts.DTOs.Bookings;

namespace SpaBooking.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BookingController : ControllerBase
    {
        private readonly IMediator _mediator;

        public BookingController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var result = await _mediator.Send(new GetAllBookingsQuery());
            return Ok(result);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateBookingDto dto)
        {
            var result = await _mediator.Send(new CreateBookingCommand { Dto = dto });
            return Ok(result);
        }

        [HttpGet("{id:guid}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            var result = await _mediator.Send(new GetBookingByIdQuery { Id = id });
            return result == null ? NotFound() : Ok(result);
        }

        [HttpPut("{id:guid}")]
        public async Task<IActionResult> Update(Guid id, [FromBody] UpdateBookingDto dto)
        {
            var success = await _mediator.Send(new UpdateBookingCommand { Id = id, Dto = dto });
            return success ? Ok() : NotFound();
        }

        [HttpDelete("{id:guid}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var success = await _mediator.Send(new DeleteBookingCommand { Id = id });
            return success ? Ok() : NotFound();
        }
    }
}