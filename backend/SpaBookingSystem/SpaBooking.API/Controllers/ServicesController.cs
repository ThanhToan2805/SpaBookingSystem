using MediatR;
using Microsoft.AspNetCore.Mvc;
using SpaBooking.Application.Requests.Services;
using SpaBooking.Contracts.DTOs.Services;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SpaBooking.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ServicesController : ControllerBase
    {
        private readonly IMediator _mediator;

        public ServicesController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpGet]
        public async Task<ActionResult<List<ServiceDto>>> GetAll()
        {
            var res = await _mediator.Send(new GetAllServicesQuery());
            return Ok(res);
        }

        [HttpGet("{id:guid}")]
        public async Task<ActionResult<ServiceDto?>> GetById(Guid id)
        {
            var res = await _mediator.Send(new GetServiceByIdQuery { Id = id });
            if (res == null) return NotFound();
            return Ok(res);
        }

        [HttpPost]
        public async Task<ActionResult<Guid>> Create([FromBody] CreateServiceCommand cmd)
        {
            var id = await _mediator.Send(cmd);
            return CreatedAtAction(nameof(GetById), new { id }, id);
        }

        [HttpPut("{id:guid}")]
        public async Task<IActionResult> Update(Guid id, [FromBody] UpdateServiceCommand cmd)
        {
            cmd.Id = id; // Lấy Id từ URL, không cần người dùng gửi trong body
            await _mediator.Send(cmd);
            return NoContent();
        }

        [HttpDelete("{id:guid}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            await _mediator.Send(new DeleteServiceCommand { Id = id });
            return NoContent();
        }
    }
}