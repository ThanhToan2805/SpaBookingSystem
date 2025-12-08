// src/pages/Policy/RefundPolicy.jsx
import LayoutWrapper from "../../components/Layout/LayoutWrapper";

export default function RefundPolicy() {
  return (
    <LayoutWrapper>
      <div className="bg-linear-to-br from-purple-50 via-white to-purple-100 py-12">
        <div className="max-w-4xl mx-auto px-6">
          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-bold text-purple-700 mb-3">
              Chính sách hoàn tiền
            </h1>
            <p className="text-sm md:text-base text-slate-500 max-w-2xl mx-auto">
              Quy định về điều kiện, hình thức và thời gian xử lý hoàn tiền 
              cho các giao dịch tại LumiSpa.
            </p>
          </div>

          <div className="space-y-6">
            {/* Trường hợp được hoàn tiền */}
            <section className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-8">
              <h2 className="text-xl font-semibold text-slate-900 mb-3">
                1. Các trường hợp được xem xét hoàn tiền
              </h2>
              <ul className="list-disc list-inside text-sm md:text-base text-slate-600 space-y-1">
                <li>Spa không thể cung cấp dịch vụ đúng thời gian đã xác nhận do lỗi hệ thống hoặc vận hành.</li>
                <li>Khách hàng đã thanh toán nhưng booking bị hủy từ phía spa.</li>
                <li>Các lỗi thanh toán bị trừ tiền nhưng không ghi nhận dịch vụ (sẽ kiểm tra với đối tác thanh toán).</li>
              </ul>
            </section>

            {/* Trường hợp không hoàn tiền */}
            <section className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-8">
              <h2 className="text-xl font-semibold text-slate-900 mb-3">
                2. Các trường hợp không được hoàn tiền
              </h2>
              <ul className="list-disc list-inside text-sm md:text-base text-slate-600 space-y-1">
                <li>Khách hàng <strong>đến trễ</strong> hoặc <strong>không đến</strong> (No-show) mà không hủy trước.</li>
                <li>Khách hàng đơn phương đổi ý sau khi dịch vụ đã bắt đầu sử dụng.</li>
                <li>Lạm dụng chính sách hoàn tiền hoặc có dấu hiệu gian lận.</li>
              </ul>
            </section>

            {/* Hình thức & quy trình hoàn tiền */}
            <section className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-8">
              <h2 className="text-xl font-semibold text-slate-900 mb-3">
                3. Hình thức và quy trình hoàn tiền
              </h2>
              <p className="text-sm md:text-base text-slate-600 leading-relaxed mb-3">
                Tùy thuộc vào phương thức thanh toán ban đầu, chúng tôi sẽ:
              </p>
              <ul className="list-disc list-inside text-sm md:text-base text-slate-600 space-y-1 mb-3">
                <li>
                  Đối với thanh toán online (VNPay, thẻ ngân hàng…): Hoàn lại vào tài khoản/thẻ gốc sau khi đối soát thành công.
                </li>
                <li>
                  Đối với thanh toán tiền mặt: Có thể hoàn trực tiếp tại quầy hoặc trừ vào lần sử dụng dịch vụ tiếp theo (theo thỏa thuận).
                </li>
              </ul>
              <p className="text-sm md:text-base text-slate-600">
                Thời gian xử lý hoàn tiền thường trong vòng <strong>3–7 ngày làm việc</strong>, 
                tùy thuộc vào quy định của ngân hàng và đối tác thanh toán.
              </p>
            </section>

            {/* Liên hệ hỗ trợ */}
            <section className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-8">
              <h2 className="text-xl font-semibold text-slate-900 mb-3">
                4. Liên hệ hỗ trợ hoàn tiền
              </h2>
              <p className="text-sm md:text-base text-slate-600 leading-relaxed">
                Nếu bạn có bất kỳ thắc mắc nào liên quan đến hoàn tiền, 
                vui lòng liên hệ qua:
              </p>
              <ul className="list-disc list-inside text-sm md:text-base text-slate-600 space-y-1 mt-2">
                <li>Hotline hỗ trợ: +84 123 456 789</li>
                <li>Email: support@lumispa.vn</li>
              </ul>
            </section>

            <p className="text-[11px] text-slate-400 text-center mt-6">
              Chính sách hoàn tiền giúp đảm bảo quyền lợi hài hòa cho cả khách hàng và LumiSpa.
            </p>
          </div>
        </div>
      </div>
    </LayoutWrapper>
  );
}