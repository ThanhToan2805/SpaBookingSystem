using MediatR;
using Microsoft.AspNetCore.Mvc;
using SpaBooking.Application.Requests.Promotions;
using SpaBooking.Contracts.DTOs.Promotions;

[Route("api/[controller]")]
[ApiController]
public class PromotionsController : ControllerBase
{
    private readonly IMediator _mediator;

    public PromotionsController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var result = await _mediator.Send(new GetAllPromotionsQuery());
        return Ok(result);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] PromotionDto dto)
    {
        var result = await _mediator.Send(new CreatePromotionCommand { Dto = dto });
        return Ok(result);
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var result = await _mediator.Send(new GetPromotionByIdQuery { Id = id });
        return result == null ? NotFound() : Ok(result);
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] PromotionDto dto)
    {
        var success = await _mediator.Send(new UpdatePromotionCommand { Id = id, Dto = dto });
        return success ? Ok() : NotFound();
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var success = await _mediator.Send(new DeletePromotionCommand { Id = id });
        return success ? Ok() : NotFound();
    }
}