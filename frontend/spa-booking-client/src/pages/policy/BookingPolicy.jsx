import LayoutWrapper from "../../components/Layout/LayoutWrapper";

export default function BookingPolicy() {
  return (
    <LayoutWrapper>
      <div className="bg-linear-to-br from-purple-50 via-white to-purple-100 py-12">
        <div className="max-w-4xl mx-auto px-6">
          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-bold text-purple-700 mb-3">
              Chính sách đặt lịch
            </h1>
            <p className="text-sm md:text-base text-slate-500 max-w-2xl mx-auto">
              Quy định về thời gian đặt lịch, xác nhận và chỉnh sửa lịch hẹn tại LumiSpa.
            </p>
          </div>

          <div className="space-y-6">
            {/* 1. Thời gian đặt lịch */}
            <section className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-8">
              <h2 className="text-xl font-semibold text-slate-900 mb-3">
                1. Thời gian đặt lịch
              </h2>
              <ul className="list-disc list-inside text-sm md:text-base text-slate-600 space-y-1">
                <li>Khách hàng có thể đặt lịch trước giờ sử dụng dịch vụ tối thiểu 1–2 giờ.</li>
                <li>Đối với khung giờ cao điểm hoặc ngày lễ, nên đặt sớm hơn để đảm bảo còn chỗ.</li>
              </ul>
            </section>

            {/* 2. Xác nhận đặt lịch */}
            <section className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-8">
              <h2 className="text-xl font-semibold text-slate-900 mb-3">
                2. Xác nhận đặt lịch
              </h2>
              <p className="text-sm md:text-base text-slate-600 leading-relaxed mb-3">
                Sau khi đặt lịch thành công, hệ thống sẽ:
              </p>
              <ul className="list-disc list-inside text-sm md:text-base text-slate-600 space-y-1">
                <li>Gửi email hoặc thông báo trong hệ thống xác nhận lịch hẹn.</li>
                <li>Hiển thị lịch hẹn trong mục <strong>“Lịch đã đặt”</strong> của tài khoản.</li>
              </ul>
            </section>

            {/* 3. Thay đổi & hủy lịch */}
            <section className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-8">
              <h2 className="text-xl font-semibold text-slate-900 mb-3">
                3. Thay đổi hoặc hủy lịch
              </h2>
              <ul className="list-disc list-inside text-sm md:text-base text-slate-600 space-y-1">
                <li>Khách hàng có thể chủ động thay đổi hoặc hủy lịch trong mục “Lịch đã đặt”.</li>
                <li>Việc hủy lịch được khuyến nghị thực hiện trước giờ hẹn ít nhất 2 giờ.</li>
                <li>Các lần hủy sát giờ thường xuyên có thể ảnh hưởng đến quyền lợi khuyến mãi trong tương lai.</li>
              </ul>
            </section>

            {/* 4. Đến trễ & No-show */}
            <section className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-8">
              <h2 className="text-xl font-semibold text-slate-900 mb-3">
                4. Đến trễ & vắng mặt (No-show)
              </h2>
              <ul className="list-disc list-inside text-sm md:text-base text-slate-600 space-y-1">
                <li>Nếu khách đến trễ hơn 15–20 phút, thời lượng dịch vụ có thể bị rút ngắn.</li>
                <li>Trường hợp không đến mà không hủy trước (No-show), lịch có thể bị đánh dấu và ảnh hưởng đến ưu đãi.</li>
              </ul>
            </section>

            <p className="text-[11px] text-slate-400 text-center mt-6">
              Chính sách đặt lịch nhằm đảm bảo trải nghiệm tốt cho cả khách hàng và spa.
            </p>
          </div>
        </div>
      </div>
    </LayoutWrapper>
  );
}