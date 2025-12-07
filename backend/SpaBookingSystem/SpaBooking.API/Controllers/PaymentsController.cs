using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SpaBooking.API.Services;
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
        private readonly IVnPayService _vnPayService;

        public PaymentsController(IMediator mediator, IVnPayService vnPayService)
        {
            _mediator = mediator;
            _vnPayService = vnPayService;
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

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            await _mediator.Send(new DeletePaymentCommand { Id = id });
            return NoContent();
        }

        [HttpPost("{id}/confirm-cash")]
        public async Task<ActionResult<PaymentDto>> ConfirmCash(Guid id)
        {
            var result = await _mediator.Send(new ConfirmCashPaymentCommand { PaymentId = id });
            return Ok(result);
        }

        // POST: api/payments/{id}/vnpay-url
        [HttpPost("{id:guid}/vnpay-url")]
        [Authorize] // hoặc bỏ nếu bạn muốn cho phép anonymous
        public async Task<IActionResult> CreateVnPayUrl(Guid id)
        {
            // Lấy Payment từ MediatR
            var payment = await _mediator.Send(new GetPaymentByIdQuery { Id = id });
            if (payment == null) return NotFound("Payment not found");

            if (!string.Equals(payment.Status, "Pending", StringComparison.OrdinalIgnoreCase))
                return BadRequest("Payment is not in Pending status");

            // Bạn có thể check thêm phương thức thanh toán
            // if (payment.PaymentMethod != "VNPay") ...

            var url = _vnPayService.CreatePaymentUrl(
                payment.Id,
                payment.Amount,
                $"Thanh toán đặt lịch #{payment.InvoiceCode}",
                HttpContext
            );

            Console.WriteLine("VNPay URL BE tạo: " + url);

            return Ok(new { paymentUrl = url });
        }

        [HttpGet("vnpay-return")]
        [AllowAnonymous]
        public async Task<IActionResult> VnPayReturn()
        {
            var query = Request.Query;
            var vnPayResponse = _vnPayService.ParsePaymentResponse(query);

            if (!vnPayResponse.IsValid)
            {
                // hash sai, không tin được
                // Có thể redirect về FE với status=invalid
                var invalidUrl = "http://localhost:5173/payment/vnpay-return?status=invalid";
                return Redirect(invalidUrl);
            }

            if (!Guid.TryParseExact(vnPayResponse.TxnRef, "N", out var paymentId))
            {
                var invalidUrl = "http://localhost:5173/payment/vnpay-return?status=notfound";
                return Redirect(invalidUrl);
            }

            var payment = await _mediator.Send(new GetPaymentByIdQuery { Id = paymentId });
            if (payment == null)
            {
                var notFoundUrl = "http://localhost:5173/payment/vnpay-return?status=notfound";
                return Redirect(notFoundUrl);
            }

            // VNPay gửi Amount * 100
            var amountFromVnp = vnPayResponse.Amount / 100m;
            if (amountFromVnp != payment.Amount)
            {
                var invalidAmountUrl = "http://localhost:5173/payment/vnpay-return?status=invalid_amount";
                return Redirect(invalidAmountUrl);
            }

            // Nếu thành công, cập nhật payment (nếu chưa completed)
            if (vnPayResponse.IsSuccess &&
                !string.Equals(payment.Status, "Completed", StringComparison.OrdinalIgnoreCase))
            {
                await _mediator.Send(new ConfirmPaymentCommand
                {
                    PaymentId = paymentId,
                    TransactionCode = vnPayResponse.TransactionNo
                });

                var successUrl =
                    $"http://localhost:5173/payment/vnpay-return?status=success&paymentId={paymentId}";
                return Redirect(successUrl);
            }
            else
            {
                var failUrl =
                    $"http://localhost:5173/payment/vnpay-return?status=failed&paymentId={paymentId}";
                return Redirect(failUrl);
            }
        }

        [HttpGet("by-booking/{bookingId}")]
        public async Task<ActionResult<IEnumerable<PaymentDto>>> GetByBooking(Guid bookingId)
        {
            var result = await _mediator.Send(new GetPaymentByBookingIdQuery { BookingId = bookingId });
            return Ok(result);
        }

        [HttpGet("status/{status}")]
        public async Task<ActionResult<IEnumerable<PaymentDto>>> GetByStatus(string status)
        {
            var result = await _mediator.Send(new GetPaymentsByStatusQuery { Status = status });
            return Ok(result);
        }
    }
}