import LayoutWrapper from "../../components/Layout/LayoutWrapper";

export default function About() {
  return (
    <LayoutWrapper>
      {/* Hero */}
      <section className="bg-linear-to-r from-purple-600 to-indigo-600 text-white py-24 mb-16 rounded-b-3xl shadow-lg">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 drop-shadow">
            Về LumiSpa
          </h1>
          <p className="text-purple-100 text-lg max-w-2xl mx-auto">
            Nền tảng đặt lịch spa – massage – chăm sóc da hiện đại, mang đến sự thư giãn và trải nghiệm tốt nhất cho khách hàng.
          </p>
        </div>
      </section>

      {/* Nội dung */}
      <div className="max-w-5xl mx-auto px-6 space-y-16 pb-20">

        {/* Sứ mệnh */}
        <section className="bg-white shadow-lg rounded-2xl p-8 border border-purple-50">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Sứ mệnh của chúng tôi</h2>
          <p className="text-gray-600 leading-relaxed text-lg">
            LumiSpa được xây dựng với mục tiêu mang đến cho khách hàng một nền tảng đặt lịch spa tiện lợi, minh bạch và nhanh chóng.
            Chúng tôi mong muốn trở thành cầu nối giữa khách hàng và các spa chuyên nghiệp, giúp quá trình chăm sóc bản thân trở nên dễ dàng hơn.
          </p>
        </section>

        {/* Giá trị */}
        <section className="grid md:grid-cols-3 gap-8">
          {[
            {
              title: "Chuyên nghiệp",
              desc: "Dịch vụ được kiểm duyệt, hình ảnh rõ ràng, thông tin minh bạch.",
            },
            {
              title: "Tiện lợi",
              desc: "Đặt lịch chỉ trong vài giây, nhắc nhở, quản lý lịch chăm sóc nhanh chóng.",
            },
            {
              title: "Tận tâm",
              desc: "Hỗ trợ khách hàng 24/7, cam kết mang lại trải nghiệm tốt nhất.",
            },
          ].map((item, i) => (
            <div key={i} className="bg-white p-6 rounded-xl shadow border border-slate-100">
              <h3 className="text-xl font-semibold text-purple-700 mb-2">{item.title}</h3>
              <p className="text-gray-600">{item.desc}</p>
            </div>
          ))}
        </section>

        {/* Tầm nhìn */}
        <section className="bg-linear-to-r from-purple-50 to-indigo-50 p-10 rounded-2xl border border-purple-100 shadow">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Tầm nhìn</h2>
          <p className="text-gray-600 leading-relaxed text-lg">
            Xây dựng hệ sinh thái chăm sóc cá nhân toàn diện – từ spa, massage, beauty care đến dịch vụ sức khỏe, giúp người dùng dễ dàng
            tiếp cận và đặt lịch mọi nơi, mọi lúc.
          </p>
        </section>

      </div>
    </LayoutWrapper>
  );
}