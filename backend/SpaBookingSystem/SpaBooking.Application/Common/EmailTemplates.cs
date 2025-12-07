using System;
using System.Globalization;

namespace SpaBooking.Application.Common
{
    public static class EmailTemplates
    {
        public static string PaymentInvoice(
            string customerName,
            string invoiceCode,
            decimal amount,
            string serviceName,
            DateTime bookingDateUtc)
        {
            var amountFormatted = string.Format(CultureInfo.GetCultureInfo("vi-VN"), "{0:N0} VND", amount);
            var utc = bookingDateUtc.Kind == DateTimeKind.Utc
                ? bookingDateUtc
                : DateTime.SpecifyKind(bookingDateUtc, DateTimeKind.Utc);

            // Timezone Việt Nam
            TimeZoneInfo vnTimeZone;
            try
            {
                // Windows
                vnTimeZone = TimeZoneInfo.FindSystemTimeZoneById("SE Asia Standard Time");
            }
            catch (TimeZoneNotFoundException)
            {
                // Linux / container
                vnTimeZone = TimeZoneInfo.FindSystemTimeZoneById("Asia/Ho_Chi_Minh");
            }

            var bookingLocal = TimeZoneInfo.ConvertTimeFromUtc(utc, vnTimeZone);
            var bookingDateFormatted = bookingLocal.ToString("HH:mm dd/MM/yyyy");

            return $@"
<!DOCTYPE html>
<html lang='vi'>
  <body style='margin:0;padding:0;background-color:#f4f4f7;font-family:-apple-system,BlinkMacSystemFont,""Segoe UI"",Roboto,Helvetica,Arial,sans-serif;'>
    <table width='100%' cellpadding='0' cellspacing='0' role='presentation' style='background-color:#f4f4f7;padding:24px 0;'>
      <tr>
        <td align='center'>
          <table width='600' cellpadding='0' cellspacing='0' role='presentation' style='background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 16px rgba(15,23,42,0.1);'>
            <!-- Header -->
            <tr>
              <td style='background:linear-gradient(90deg,#4f46e5,#6366f1);padding:20px 24px;color:#ffffff;text-align:center;'>
                <div style='font-size:20px;font-weight:700;letter-spacing:0.04em;text-transform:uppercase;'>
                  HÓA ĐƠN THANH TOÁN DỊCH VỤ SPA
                </div>
                <div style='margin-top:4px;font-size:13px;opacity:0.9;'>
                  Cảm ơn bạn đã tin tưởng LumiSpa
                </div>
              </td>
            </tr>

            <!-- Body -->
            <tr>
              <td style='padding:24px 28px 8px 28px;color:#111827;font-size:14px;line-height:1.6;'>
                <p style='margin:0 0 8px 0;'>Xin chào <strong>{customerName}</strong>,</p>
                <p style='margin:0 0 16px 0;'>
                  Cảm ơn bạn đã đặt dịch vụ tại <strong>LumiSpa</strong>. Dưới đây là thông tin chi tiết hóa đơn của bạn:
                </p>

                <!-- Order summary card -->
                <table width='100%' cellpadding='0' cellspacing='0' role='presentation'
                       style='border-collapse:collapse;border-radius:10px;border:1px solid #e5e7eb;overflow:hidden;margin:8px 0 16px 0;'>
                  <tr style='background-color:#f9fafb;'>
                    <td colspan='2' style='padding:10px 16px;font-size:13px;font-weight:600;color:#374151;'>
                      Thông tin hóa đơn
                    </td>
                  </tr>
                  <tr>
                    <td style='padding:8px 16px;border-top:1px solid #e5e7eb;color:#6b7280;width:160px;'>Mã hóa đơn</td>
                    <td style='padding:8px 16px;border-top:1px solid #e5e7eb;color:#111827;font-weight:600;'>{invoiceCode}</td>
                  </tr>
                  <tr>
                    <td style='padding:8px 16px;border-top:1px solid #e5e7eb;color:#6b7280;'>Dịch vụ</td>
                    <td style='padding:8px 16px;border-top:1px solid #e5e7eb;color:#111827;'>{serviceName}</td>
                  </tr>
                  <tr>
                    <td style='padding:8px 16px;border-top:1px solid #e5e7eb;color:#6b7280;'>Thời gian</td>
                    <td style='padding:8px 16px;border-top:1px solid #e5e7eb;color:#111827;'>{bookingDateFormatted}</td>
                  </tr>
                  <tr>
                    <td style='padding:8px 16px;border-top:1px solid #e5e7eb;color:#6b7280;'>Tổng thanh toán</td>
                    <td style='padding:8px 16px;border-top:1px solid #e5e7eb;color:#16a34a;font-weight:700;font-size:16px;text-align:right;'>
                      {amountFormatted}
                    </td>
                  </tr>
                </table>

                <!-- Note -->
                <p style='margin:0 0 12px 0;font-size:13px;color:#4b5563;'>
                  Khi đến spa, vui lòng cung cấp <strong>mã hóa đơn</strong> cho nhân viên lễ tân để được xác nhận và phục vụ nhanh chóng.
                </p>

                <table width='100%' cellpadding='0' cellspacing='0' role='presentation'
                       style='border-collapse:collapse;border-radius:8px;background-color:#f9fafb;margin:8px 0 16px 0;'>
                  <tr>
                    <td style='padding:10px 14px;font-size:12px;color:#4b5563;'>
                      <strong>Lưu ý:</strong><br/>
                      • Vui lòng đến trước giờ hẹn 10–15 phút để làm thủ tục.<br/>
                      • Nếu cần thay đổi thời gian hoặc hủy lịch, hãy liên hệ với chúng tôi trước ít nhất 2 giờ so với giờ đặt.<br/>
                      • Trong trường hợp có bất kỳ sai sót nào về thông tin, vui lòng phản hồi lại email này hoặc liên hệ hotline bên dưới.
                    </td>
                  </tr>
                </table>

                <p style='margin:0 0 4px 0;'>Trân trọng,</p>
                <p style='margin:0;font-weight:600;'>Đội ngũ LumiSpa</p>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style='padding:14px 28px 18px 28px;font-size:11px;color:#9ca3af;border-top:1px solid #e5e7eb;text-align:center;'>
                LumiSpa • Vệ sinh – Thư giãn – Chăm sóc chuyên nghiệp<br/>
                Hotline: 1900 9999 · Email: support@lumispa.vn<br/>
                Đây là email tự động, vui lòng không trả lời trực tiếp.
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>";
        }
    }
}