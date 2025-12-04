using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SpaBooking.Application.Requests.Bookings;
using SpaBooking.Contracts.DTOs.Bookings;

namespace SpaBooking.API.Controllers
{
    [Route("api/[controller]")]
    [Authorize]
    [ApiController]
    public class BookingsController : ControllerBase
    {
        private readonly IMediator _mediator;

        public BookingsController(IMediator mediator)
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

        [HttpPost("{id:guid}/cancel")]
        public async Task<IActionResult> Cancel(Guid id, [FromBody] CancelBookingDto dto)
        {
            var success = await _mediator.Send(new CancelBookingCommand { BookingId = id, Dto = dto });
            return success ? Ok() : BadRequest("Cannot cancel this booking.");
        }

        [HttpPost("{id:guid}/complete")]
        public async Task<IActionResult> Complete(Guid id, [FromBody] string? note = null)
        {
            var command = new CompleteBookingCommand
            {
                BookingId = id,
                Note = note
            };

            var success = await _mediator.Send(command);
            return success ? Ok() : NotFound();
        }

        [HttpPost("{id:guid}/noshow")]
        public async Task<IActionResult> SetNoShow(Guid id, [FromBody] string? note = null)
        {
            var command = new SetBookingNoShowCommand
            {
                BookingId = id,
                Note = note
            };

            var success = await _mediator.Send(command);
            return success ? Ok() : NotFound();
        }

        [HttpPost("{id:guid}/reschedule")]
        public async Task<IActionResult> Reschedule(Guid id, [FromBody] RescheduleBookingCommand command)
        {
            if (id != command.BookingId)
                return BadRequest("BookingId mismatch.");

            var result = await _mediator.Send(command);
            return Ok(result);
        }

        [HttpGet("user/{userId:guid}")]
        public async Task<IActionResult> GetByUser(Guid userId, [FromQuery] DateTime? from, [FromQuery] DateTime? to, [FromQuery] string? status)
        {
            var query = new GetBookingsByUserQuery
            {
                UserId = userId,
                From = from,
                To = to,
                Status = status
            };

            var result = await _mediator.Send(query);
            return Ok(result);
        }

        [HttpGet("by-date")]
        public async Task<IActionResult> GetByDate([FromQuery] DateTime date, [FromQuery] Guid? staffId, [FromQuery] Guid? serviceId, [FromQuery] string? status)
        {
            var query = new GetBookingsByDateQuery
            {
                Date = date,
                StaffId = staffId,
                ServiceId = serviceId,
                Status = status
            };

            var result = await _mediator.Send(query);
            return Ok(result);
        }

        [HttpGet("calendar-view")]
        public async Task<IActionResult> GetCalendarView([FromQuery] DateTime startDate, [FromQuery] DateTime endDate, [FromQuery] Guid? staffId, [FromQuery] Guid? serviceId)
        {
            var query = new GetBookingCalendarViewQuery
            {
                StartDate = startDate,
                EndDate = endDate,
                StaffId = staffId,
                ServiceId = serviceId
            };

            var result = await _mediator.Send(query);
            return Ok(result);
        }
    }
}