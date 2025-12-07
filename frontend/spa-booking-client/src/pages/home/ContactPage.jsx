import LayoutWrapper from "../../components/Layout/LayoutWrapper";

export default function Contact() {
  return (
    <LayoutWrapper>
      <div className="min-h-[70vh] py-16 bg-linear-to-br from-purple-50 via-white to-purple-100">
        <div className="max-w-5xl mx-auto px-6">

          <h1 className="text-4xl md:text-5xl font-bold text-center mb-6 text-purple-700">
            Liên hệ chúng tôi
          </h1>
          <p className="text-center text-gray-600 mb-12">
            Chúng tôi luôn sẵn sàng hỗ trợ bạn mọi lúc.
          </p>

          <div className="grid md:grid-cols-2 gap-10">

            {/* Form */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-purple-50">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Gửi tin nhắn</h2>

              <form className="space-y-4">
                <input
                  type="text"
                  placeholder="Họ và tên"
                  className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-purple-500"
                />
                <input
                  type="email"
                  placeholder="Email"
                  className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-purple-500"
                />
                <textarea
                  rows={5}
                  placeholder="Nội dung liên hệ..."
                  className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-purple-500"
                ></textarea>

                <button className="w-full py-3 bg-purple-600 text-white rounded-xl font-medium hover:bg-purple-700 transition">
                  Gửi liên hệ
                </button>
              </form>
            </div>

            {/* Info */}
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-2xl shadow border border-slate-100">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Thông tin liên hệ</h3>
                <p className="text-gray-600">Email: support@lumispa.vn</p>
                <p className="text-gray-600">Hotline: 0909 999 999</p>
                <p className="text-gray-600">Địa chỉ: 123 Nguyễn Trãi, Phường Phạm Ngũ Lão, Quận 1, Thành phố Hồ Chí Minh, Việt Nam</p>
              </div>

              <div className="overflow-hidden rounded-2xl shadow border border-slate-100 h-64">
                <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.5455868274385!2d106.68830057451704!3d10.769461759323192!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f3d0a4600a3%3A0x2dc3afaed04b79d5!2zMTIzIE5ndXnhu4VuIFRyw6NpLCBQaMaw4budbmcgUGjhuqFtIE5nxakgTMOjbywgUXXhuq1uIDEsIFRow6BuaCBwaOG7kSBI4buTIENow60gTWluaCwgVmnhu4d0IE5hbQ!5e0!3m2!1svi!2s!4v1765120254008!5m2!1svi!2s" 
                width="600" height="450" loading="lazy"></iframe>
              </div>
            </div>
          </div>

        </div>
      </div>
    </LayoutWrapper>
  );
}