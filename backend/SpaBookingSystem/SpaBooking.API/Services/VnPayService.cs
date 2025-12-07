using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;
using SpaBooking.API.Settings;
using System;
using System.Globalization;
using System.Text;
using System.Text.RegularExpressions;

namespace SpaBooking.API.Services
{
    public interface IVnPayService
    {
        string CreatePaymentUrl(Guid paymentId, decimal amount, string description, HttpContext context);
        VnPayPaymentResponse ParsePaymentResponse(IQueryCollection query);
    }

    public class VnPayPaymentResponse
    {
        public bool IsValid { get; set; }
        public string TxnRef { get; set; } = string.Empty;
        public string TransactionNo { get; set; } = string.Empty;
        public string ResponseCode { get; set; } = string.Empty;
        public string TransactionStatus { get; set; } = string.Empty;
        public long Amount { get; set; }

        // Thành công theo chuẩn VNPay: ResponseCode = 00 & TransactionStatus = 00
        public bool IsSuccess => IsValid && ResponseCode == "00" && TransactionStatus == "00";
    }

    public class VnPayService : IVnPayService
    {
        private readonly VnPaySettings _settings;

        public VnPayService(IOptions<VnPaySettings> options)
        {
            _settings = options.Value;
        }

        public string CreatePaymentUrl(Guid paymentId, decimal amount, string description, HttpContext context)
        {
            var vnPay = new VnPayLibrary();

            var now = DateTime.UtcNow.AddHours(7);
            var expire = now.AddMinutes(15);

            var orderInfo = NormalizeOrderInfo(description);

            vnPay.AddRequestData("vnp_Version", _settings.Version);
            vnPay.AddRequestData("vnp_Command", "pay");
            vnPay.AddRequestData("vnp_TmnCode", _settings.TmnCode);

            // VNPay yêu cầu nhân 100 lần số tiền (VD: 10.000 VND → 1000000)
            var vnpAmount = ((long)(amount * 100)).ToString();
            vnPay.AddRequestData("vnp_Amount", vnpAmount);

            vnPay.AddRequestData("vnp_CurrCode", "VND");
            vnPay.AddRequestData("vnp_TxnRef", paymentId.ToString("N")); // dùng Guid dạng N, 32 ký tự

            vnPay.AddRequestData("vnp_OrderInfo", orderInfo);

            vnPay.AddRequestData("vnp_Locale", "vn");

            vnPay.AddRequestData("vnp_OrderType", "other");

            vnPay.AddRequestData("vnp_ReturnUrl", _settings.ReturnUrl);
            vnPay.AddRequestData("vnp_CreateDate", now.ToString("yyyyMMddHHmmss"));

            vnPay.AddRequestData("vnp_ExpireDate", expire.ToString("yyyyMMddHHmmss"));

            vnPay.AddRequestData("vnp_IpAddr", GetIpAddress(context));

            return vnPay.CreateRequestUrl(_settings.BaseUrl, _settings.HashSecret);
        }

        public VnPayPaymentResponse ParsePaymentResponse(IQueryCollection query)
        {
            var response = new VnPayPaymentResponse
            {
                IsValid = VnPayLibrary.ValidateSignature(query, _settings.HashSecret),
                TxnRef = query["vnp_TxnRef"],
                TransactionNo = query["vnp_TransactionNo"],
                ResponseCode = query["vnp_ResponseCode"],
                TransactionStatus = query["vnp_TransactionStatus"]
            };

            if (long.TryParse(query["vnp_Amount"], out var amt))
            {
                response.Amount = amt;
            }

            return response;
        }

        private static string GetIpAddress(HttpContext context)
        {
            var ip = context.Connection.RemoteIpAddress?.ToString();

            if (string.IsNullOrEmpty(ip) || ip == "::1")
            {
                ip = "127.0.0.1";
            }

            return ip;
        }

        private static string NormalizeOrderInfo(string input)
        {
            if (string.IsNullOrWhiteSpace(input))
                return "Thanh toan dich vu";

            // Bỏ dấu tiếng Việt
            var normalized = input.Normalize(NormalizationForm.FormD);
            var sb = new StringBuilder();
            foreach (var c in normalized)
            {
                var unicodeCategory = CharUnicodeInfo.GetUnicodeCategory(c);
                if (unicodeCategory != UnicodeCategory.NonSpacingMark)
                {
                    sb.Append(c);
                }
            }
            normalized = sb.ToString().Normalize(NormalizationForm.FormC);

            // Chỉ giữ lại chữ, số, dấu cách, chấm, phẩy
            normalized = Regex.Replace(normalized, @"[^0-9A-Za-z .,]", string.Empty);

            return normalized;
        }
    }
}