using MediatR;
using Microsoft.AspNetCore.Mvc;
using SpaBooking.Application.Requests.Staffs;
using SpaBooking.Contracts.DTOs.Staffs;
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
    }
}