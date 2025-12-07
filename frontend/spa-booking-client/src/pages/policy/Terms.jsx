import LayoutWrapper from "../../components/Layout/LayoutWrapper";

export default function Terms() {
  return (
    <LayoutWrapper>
      <div className="bg-linear-to-br from-purple-50 via-white to-purple-100 py-12">
        <div className="max-w-4xl mx-auto px-6">
          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-bold text-purple-700 mb-3">
              Điều khoản sử dụng
            </h1>
            <p className="text-sm md:text-base text-slate-500 max-w-2xl mx-auto">
              Khi sử dụng LumiSpa, bạn đã đồng ý với các điều khoản dưới đây. 
              Vui lòng đọc kỹ trước khi tiếp tục.
            </p>
          </div>

          <div className="space-y-6">
            {/* 1. Phạm vi áp dụng */}
            <section className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-8">
              <h2 className="text-xl font-semibold text-slate-900 mb-3">
                1. Phạm vi áp dụng
              </h2>
              <p className="text-sm md:text-base text-slate-600 leading-relaxed">
                Điều khoản này áp dụng cho tất cả người dùng khi truy cập, 
                đăng ký tài khoản, đặt lịch hoặc sử dụng bất kỳ dịch vụ nào 
                trên nền tảng LumiSpa (website hoặc ứng dụng, nếu có).
              </p>
            </section>

            {/* 2. Tài khoản & bảo mật */}
            <section className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-8">
              <h2 className="text-xl font-semibold text-slate-900 mb-3">
                2. Tài khoản và bảo mật
              </h2>
              <ul className="list-disc list-inside text-sm md:text-base text-slate-600 space-y-1">
                <li>Bạn cam kết cung cấp thông tin chính xác, đầy đủ khi đăng ký.</li>
                <li>Bạn chịu trách nhiệm bảo mật mật khẩu và các hoạt động trên tài khoản của mình.</li>
                <li>Trong trường hợp nghi ngờ bị lạm dụng, vui lòng thay đổi mật khẩu hoặc liên hệ hỗ trợ.</li>
              </ul>
            </section>

            {/* 3. Hành vi bị cấm */}
            <section className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-8">
              <h2 className="text-xl font-semibold text-slate-900 mb-3">
                3. Hành vi bị cấm
              </h2>
              <p className="text-sm md:text-base text-slate-600 leading-relaxed mb-3">
                Người dùng không được:
              </p>
              <ul className="list-disc list-inside text-sm md:text-base text-slate-600 space-y-1">
                <li>Sử dụng nền tảng vào mục đích gian lận, giả mạo, gây rối hoặc phá hoại hệ thống.</li>
                <li>Đăng tải nội dung vi phạm pháp luật, thuần phong mỹ tục.</li>
                <li>Tự ý sử dụng thương hiệu LumiSpa khi chưa có sự cho phép.</li>
              </ul>
            </section>

            {/* 4. Thay đổi dịch vụ */}
            <section className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-8">
              <h2 className="text-xl font-semibold text-slate-900 mb-3">
                4. Thay đổi, gián đoạn dịch vụ
              </h2>
              <p className="text-sm md:text-base text-slate-600 leading-relaxed">
                LumiSpa có quyền chỉnh sửa, tạm ngưng hoặc ngừng cung cấp một phần 
                hoặc toàn bộ dịch vụ (ví dụ: nâng cấp hệ thống, bảo trì, thay đổi quy trình đặt lịch) 
                nhưng sẽ cố gắng thông báo trước cho khách hàng trong khả năng cho phép.
              </p>
            </section>

            {/* 5. Cam kết & giới hạn trách nhiệm */}
            <section className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-8">
              <h2 className="text-xl font-semibold text-slate-900 mb-3">
                5. Cam kết và giới hạn trách nhiệm
              </h2>
              <p className="text-sm md:text-base text-slate-600 leading-relaxed">
                Chúng tôi nỗ lực để hệ thống vận hành ổn định, bảo mật và chính xác. 
                Tuy nhiên, trong một số trường hợp bất khả kháng (sự cố hạ tầng, 
                lỗi đường truyền, thiên tai...), chúng tôi không chịu trách nhiệm 
                cho mọi thiệt hại phát sinh ngoài ý muốn.
              </p>
            </section>

            <p className="text-[11px] text-slate-400 text-center mt-6">
              Việc tiếp tục sử dụng LumiSpa đồng nghĩa với việc bạn chấp nhận các điều khoản này.
            </p>
          </div>
        </div>
      </div>
    </LayoutWrapper>
  );
}