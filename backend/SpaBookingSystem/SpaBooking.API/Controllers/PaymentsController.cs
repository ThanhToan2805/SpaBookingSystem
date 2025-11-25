using MediatR;
using Microsoft.AspNetCore.Mvc;
using SpaBooking.Application.Requests.Payments;
using SpaBooking.Contracts.DTOs.Payments;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SpaBooking.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PaymentsController : ControllerBase
    {
        private readonly IMediator _mediator;

        public PaymentsController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<PaymentDto>>> GetAll()
        {
            var result = await _mediator.Send(new GetAllPaymentsQuery());
            return Ok(result);
        }

        [HttpPost]
        public async Task<ActionResult<PaymentDto>> Create([FromBody] CreatePaymentCommand command)
        {
            var result = await _mediator.Send(command);
            return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<PaymentDto?>> GetById(Guid id)
        {
            var result = await _mediator.Send(new GetPaymentByIdQuery { Id = id });
            if (result == null) return NotFound();
            return Ok(result);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<PaymentDto?>> Update(Guid id, [FromBody] UpdatePaymentCommand command)
        {
            if (id != command.Id) return BadRequest();
            var result = await _mediator.Send(command);
            if (result == null) return NotFound();
            return Ok(result);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            await _mediator.Send(new DeletePaymentCommand { Id = id });
            return NoContent();
        }
    }
}