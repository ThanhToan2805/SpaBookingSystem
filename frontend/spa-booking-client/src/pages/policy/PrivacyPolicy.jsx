import LayoutWrapper from "../../components/Layout/LayoutWrapper";

export default function PrivacyPolicy() {
  return (
    <LayoutWrapper>
      <div className="bg-linear-to-br from-purple-50 via-white to-purple-100 py-12">
        <div className="max-w-4xl mx-auto px-6">
          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-bold text-purple-700 mb-3">
              Chính sách bảo mật
            </h1>
            <p className="text-sm md:text-base text-slate-500 max-w-2xl mx-auto">
              LumiSpa cam kết bảo vệ thông tin cá nhân của khách hàng, 
              đảm bảo minh bạch trong việc thu thập, sử dụng và lưu trữ dữ liệu.
            </p>
          </div>

          {/* Content */}
          <div className="space-y-6">
            {/* Thông tin thu thập */}
            <section className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-8">
              <h2 className="text-xl font-semibold text-slate-900 mb-3">
                1. Thông tin chúng tôi thu thập
              </h2>
              <p className="text-sm md:text-base text-slate-600 leading-relaxed mb-3">
                Khi bạn sử dụng dịch vụ LumiSpa, chúng tôi có thể thu thập các loại thông tin sau:
              </p>
              <ul className="list-disc list-inside text-sm md:text-base text-slate-600 space-y-1">
                <li>Thông tin cá nhân: Họ tên, số điện thoại, email.</li>
                <li>Thông tin đặt lịch: Dịch vụ, thời gian, chi nhánh (nếu có).</li>
                <li>Thông tin thanh toán: Phương thức thanh toán, trạng thái giao dịch.</li>
              </ul>
            </section>

            {/* Mục đích sử dụng */}
            <section className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-8">
              <h2 className="text-xl font-semibold text-slate-900 mb-3">
                2. Mục đích sử dụng thông tin
              </h2>
              <p className="text-sm md:text-base text-slate-600 leading-relaxed mb-3">
                Thông tin của bạn được sử dụng cho các mục đích:
              </p>
              <ul className="list-disc list-inside text-sm md:text-base text-slate-600 space-y-1">
                <li>Quản lý tài khoản và lịch sử đặt lịch của bạn.</li>
                <li>Gửi thông báo xác nhận, nhắc lịch, cập nhật trạng thái dịch vụ.</li>
                <li>Cải thiện chất lượng dịch vụ và trải nghiệm người dùng.</li>
              </ul>
            </section>

            {/* Bảo mật & chia sẻ */}
            <section className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-8">
              <h2 className="text-xl font-semibold text-slate-900 mb-3">
                3. Bảo mật và chia sẻ thông tin
              </h2>
              <p className="text-sm md:text-base text-slate-600 leading-relaxed mb-3">
                LumiSpa không bán hoặc cho thuê thông tin cá nhân của bạn cho bên thứ ba. 
                Thông tin chỉ được chia sẻ trong các trường hợp:
              </p>
              <ul className="list-disc list-inside text-sm md:text-base text-slate-600 space-y-1 mb-3">
                <li>Thực hiện giao dịch thanh toán qua đối tác trung gian (ví dụ: VNPay).</li>
                <li>Theo yêu cầu hợp pháp từ cơ quan nhà nước có thẩm quyền.</li>
              </ul>
              <p className="text-sm md:text-base text-slate-600">
                Chúng tôi áp dụng các biện pháp kỹ thuật và tổ chức phù hợp để bảo vệ 
                dữ liệu khỏi truy cập trái phép, mất mát hoặc lạm dụng.
              </p>
            </section>

            {/* Quyền của người dùng */}
            <section className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-8">
              <h2 className="text-xl font-semibold text-slate-900 mb-3">
                4. Quyền của bạn đối với dữ liệu
              </h2>
              <p className="text-sm md:text-base text-slate-600 leading-relaxed mb-3">
                Bạn có quyền:
              </p>
              <ul className="list-disc list-inside text-sm md:text-base text-slate-600 space-y-1">
                <li>Yêu cầu xem hoặc cập nhật thông tin cá nhân.</li>
                <li>Yêu cầu xoá tài khoản trong trường hợp không tiếp tục sử dụng dịch vụ.</li>
                <li>Liên hệ chúng tôi để được giải đáp về quyền riêng tư và bảo mật dữ liệu.</li>
              </ul>
            </section>

            <p className="text-[11px] text-slate-400 text-center mt-6">
              Chính sách có thể được cập nhật theo thời gian. 
              Vui lòng kiểm tra định kỳ để nắm thông tin mới nhất.
            </p>
          </div>
        </div>
      </div>
    </LayoutWrapper>
  );
}