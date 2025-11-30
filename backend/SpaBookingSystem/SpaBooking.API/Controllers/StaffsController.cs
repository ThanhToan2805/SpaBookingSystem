using MediatR;
using Microsoft.AspNetCore.Mvc;
using SpaBooking.Application.Requests.Staffs;
using SpaBooking.Contracts.DTOs.Bookings;
using SpaBooking.Contracts.DTOs.Staffs;
using SpaBooking.Contracts.DTOs.TimeSlots;
using SpaBooking.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SpaBooking.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class StaffsController : ControllerBase
    {
        private readonly IMediator _mediator;

        public StaffsController(IMediator mediator)
        {
            _mediator = mediator;
        }

        // GET: api/staffs
        [HttpGet]
        public async Task<ActionResult<IEnumerable<StaffDto>>> GetAll([FromQuery] GetAllStaffsQuery query)
        {
            var result = await _mediator.Send(query);
            return Ok(result);
        }

        // GET: api/staffs/{id}
        [HttpGet("{id:guid}")]
        public async Task<ActionResult<StaffDto?>> GetById(Guid id)
        {
            var query = new GetStaffByIdQuery { Id = id };
            var result = await _mediator.Send(query);
            if (result == null) return NotFound();
            return Ok(result);
        }

        // POST: api/staffs
        [HttpPost]
        public async Task<ActionResult<StaffDto>> Create([FromBody] CreateStaffCommand command)
        {
            var result = await _mediator.Send(command);
            return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
        }

        // PUT: api/staffs/{id}
        [HttpPut("{id:guid}")]
        public async Task<ActionResult<StaffDto>> Update(Guid id, [FromBody] UpdateStaffCommand command)
        {
            if (id != command.Id) return BadRequest("Id mismatch");
            var result = await _mediator.Send(command);
            return Ok(result);
        }

        // DELETE: api/staffs/{id}
        [HttpDelete("{id:guid}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var command = new DeleteStaffCommand { Id = id };
            await _mediator.Send(command);
            return NoContent();
        }

        // GET: api/staffs/position?position=Therapist
        [HttpGet("position")]
        public async Task<ActionResult<List<StaffDto>>> GetByPosition([FromQuery] string position)
        {
            var query = new GetStaffByPositionQuery { Position = position };
            var result = await _mediator.Send(query);
            return Ok(result);
        }

        // GET: api/staffs/{staffId}/schedule?date=2025-12-01
        [HttpGet("{staffId:guid}/schedule")]
        public async Task<ActionResult<List<StaffScheduleDto>>> GetSchedule(Guid staffId, [FromQuery] DateTime? date)
        {
            var query = new GetStaffScheduleQuery
            {
                StaffId = staffId,
                Date = date
            };

            var result = await _mediator.Send(query);
            return Ok(result);
        }

        // GET: api/staffs/{staffId}/bookings?from=2025-12-01&to=2025-12-31&status=Confirmed
        [HttpGet("{staffId:guid}/bookings")]
        public async Task<ActionResult<List<BookingDto>>> GetBookings(
            Guid staffId,
            [FromQuery] DateTime? from,
            [FromQuery] DateTime? to,
            [FromQuery] string? status)
        {
            BookingStatus? bookingStatus = null;
            if (!string.IsNullOrEmpty(status) && Enum.TryParse<BookingStatus>(status, true, out var s))
            {
                bookingStatus = s;
            }

            var query = new GetStaffBookingsQuery
            {
                StaffId = staffId,
                From = from,
                To = to,
                Status = bookingStatus
            };

            var result = await _mediator.Send(query);
            return Ok(result);
        }

        // GET: api/staffs/{staffId}/working-hours?from=2025-12-01&to=2025-12-07
        [HttpGet("{staffId:guid}/working-hours")]
        public async Task<ActionResult<List<StaffWorkingHoursDto>>> GetWorkingHours(
            Guid staffId,
            [FromQuery] DateTime? from,
            [FromQuery] DateTime? to)
        {
            var query = new GetStaffWorkingHoursQuery
            {
                StaffId = staffId,
                From = from,
                To = to
            };

            var result = await _mediator.Send(query);
            return Ok(result);
        }

        // PUT: api/staffs/{staffId}/working-hours
        [HttpPut("{staffId:guid}/working-hours")]
        public async Task<ActionResult<List<TimeSlotDto>>> UpdateWorkingHours(
            Guid staffId,
            [FromBody] UpdateStaffWorkingHoursCommand command)
        {
            if (staffId != command.StaffId) return BadRequest("Id mismatch");

            var result = await _mediator.Send(command);
            return Ok(result);
        }

        // GET: api/staffs/available?position=Therapist&startAt=2025-12-01T09:00&endAt=2025-12-01T10:00
        [HttpGet("available")]
        public async Task<ActionResult<List<StaffDto>>> FindAvailable(
            [FromQuery] string? position,
            [FromQuery] DateTime startAt,
            [FromQuery] DateTime endAt)
        {
            var query = new FindAvailableStaffQuery
            {
                Position = position,
                StartAt = startAt,
                EndAt = endAt
            };

            var result = await _mediator.Send(query);
            return Ok(result);
        }

        // GET: api/staffs/{staffId}/check-availability?startAt=2025-12-01T09:00&endAt=2025-12-01T10:00
        [HttpGet("{staffId:guid}/check-availability")]
        public async Task<ActionResult<bool>> CheckAvailability(
            Guid staffId,
            [FromQuery] DateTime startAt,
            [FromQuery] DateTime endAt)
        {
            var query = new CheckStaffAvailabilityQuery
            {
                StaffId = staffId,
                StartAt = startAt,
                EndAt = endAt
            };

            var result = await _mediator.Send(query);
            return Ok(result);
        }

        // GET: api/staffs/{staffId}/utilization?from=2025-12-01&to=2025-12-07
        [HttpGet("{staffId:guid}/utilization")]
        public async Task<ActionResult<StaffUtilizationDto?>> GetUtilization(
            Guid staffId,
            [FromQuery] DateTime? from,
            [FromQuery] DateTime? to)
        {
            var query = new GetStaffUtilizationQuery
            {
                StaffId = staffId,
                From = from,
                To = to
            };

            var result = await _mediator.Send(query);
            return Ok(result);
        }

        // PUT: api/staffs/{staffId}/toggle-availability
        [HttpPut("{staffId:guid}/toggle-availability")]
        public async Task<ActionResult<StaffDto?>> ToggleAvailability(
            Guid staffId,
            [FromBody] ToggleAvailabilityCommand command)
        {
            if (staffId != command.StaffId) return BadRequest("Id mismatch");

            var result = await _mediator.Send(command);
            if (result == null) return NotFound();
            return Ok(result);
        }
    }
}