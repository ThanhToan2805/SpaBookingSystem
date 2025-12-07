using MediatR;
using QRCoder;
using SpaBooking.Application.Common.VietQR;
using SpaBooking.Application.Interfaces.Repositories;
using SpaBooking.Application.Requests.Payments;

namespace SpaBooking.Application.UseCases.Payments
{
    public class GeneratePaymentQRCodeHandler : IRequestHandler<GeneratePaymentQRCodeCommand, string>
    {
        private readonly IPaymentRepository _paymentRepo;

        public GeneratePaymentQRCodeHandler(IPaymentRepository paymentRepo)
        {
            _paymentRepo = paymentRepo;
        }

        public async Task<string> Handle(GeneratePaymentQRCodeCommand request, CancellationToken cancellationToken)
        {
            var payment = await _paymentRepo.GetByIdAsync(request.PaymentId);
            if (payment == null)
                throw new Exception("Payment not found");

            var booking = payment.Booking;

            // Xây QR VietQR (bank code & account bạn mock)
            string qrContent = VietQRBuilder.BuildVietQRContent(
                bankCode: "970422",               // Mock Techcombank
                accountNumber: "1234567890",
                accountName: "SPA DEMO",
                amount: 0,                        // LUÔN 0 → không chuyển tiền thật
                addInfo: $"PAY-{payment.InvoiceCode}"
            );

            // generate bitmap
            using var qrGenerator = new QRCodeGenerator();
            var qrData = qrGenerator.CreateQrCode(qrContent, QRCodeGenerator.ECCLevel.Q);
            #pragma warning disable CA1416
            using var qrCode = new QRCode(qrData);
            using var bitmap = qrCode.GetGraphic(20);
            #pragma warning restore CA1416

            using var ms = new MemoryStream();
            #pragma warning disable CA1416
            bitmap.Save(ms, System.Drawing.Imaging.ImageFormat.Png);

            var base64 = Convert.ToBase64String(ms.ToArray());
            return $"data:image/png;base64,{base64}";
        }
    }
}