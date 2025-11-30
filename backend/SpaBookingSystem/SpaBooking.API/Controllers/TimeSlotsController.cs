using MediatR;
using Microsoft.AspNetCore.Mvc;
using SpaBooking.Application.Requests.TimeSlots;
using SpaBooking.Contracts.DTOs.TimeSlots;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SpaBooking.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TimeSlotsController : ControllerBase
    {
        private readonly IMediator _mediator;

        public TimeSlotsController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpGet]
        public async Task<IEnumerable<TimeSlotDto>> Get([FromQuery] Guid? staffId)
        {
            return await _mediator.Send(new GetAllTimeSlotsQuery { StaffId = staffId });
        }

        [HttpPost]
        public async Task<Guid> Create([FromBody] CreateTimeSlotCommand command)
        {
            return await _mediator.Send(command);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(Guid id, [FromBody] UpdateTimeSlotCommand command)
        {
            if (id != command.Id) return BadRequest("Id mismatch");
            await _mediator.Send(command);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            await _mediator.Send(new DeleteTimeSlotCommand { Id = id });
            return NoContent();
        }

        // GET: api/timeslots/staff/{staffId}?from=2025-12-01&to=2025-12-07
        [HttpGet("staff/{staffId:guid}")]
        public async Task<ActionResult<List<TimeSlotDto>>> GetByStaff(
            Guid staffId,
            [FromQuery] DateTime? from,
            [FromQuery] DateTime? to)
        {
            var query = new GetTimeSlotsByStaffQuery
            {
                StaffId = staffId,
                From = from,
                To = to
            };

            var result = await _mediator.Send(query);
            return Ok(result);
        }

        // GET: api/timeslots/available?staffId=...&startAt=2025-12-01T09:00&endAt=2025-12-01T17:00
        [HttpGet("available")]
        public async Task<ActionResult<List<TimeSlotDto>>> GetAvailable(
            [FromQuery] Guid staffId,
            [FromQuery] DateTime startAt,
            [FromQuery] DateTime endAt)
        {
            var query = new GetAvailableTimeSlotsForServiceQuery
            {
                StaffId = staffId,
                StartAt = startAt,
                EndAt = endAt
            };

            var result = await _mediator.Send(query);
            return Ok(result);
        }

        /// <summary>
        /// Sinh slot động cho booking dựa trên staffId, ngày muốn book, duration service
        /// Chỉ tạo slot chưa book / chưa trôi qua
        /// </summary>
        /// <param name="command"></param>
        /// <returns>Danh sách slot rảnh đủ duration</returns>
        [HttpPost("generate-for-booking")]
        public async Task<ActionResult<List<TimeSlotGroupDto>>> GenerateForBooking([FromBody] GenerateSlotForBookingCommand command)
        {
            var result = await _mediator.Send(command);
            if (result == null || result.Count == 0)
                return NotFound("Không còn slot rảnh cho staff trong ngày này đủ duration");

            return Ok(result);
        }

        [HttpPost("validate-range")]
        public async Task<ActionResult<ValidateTimeSlotRangeResultDto>> ValidateRange([FromBody] ValidateTimeSlotRangeQuery query)
        {
            var result = await _mediator.Send(query);
            return Ok(result);
        }
    }
}