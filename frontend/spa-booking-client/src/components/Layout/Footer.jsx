import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-12">
      <div className="container mx-auto px-4 py-12 grid md:grid-cols-4 gap-10">

        {/* Brand */}
        <div>
          <h3 className="text-xl font-bold text-purple-400 mb-3">LumiSpa</h3>
          <p className="opacity-80 leading-relaxed">
            Hệ thống chăm sóc sắc đẹp – thư giãn – trị liệu hàng đầu Việt Nam.
            Đặt lịch dễ dàng, trải nghiệm đẳng cấp.
          </p>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-lg font-semibold text-purple-400 mb-3">Liên hệ</h3>
          <p>Hotline: +84 123 456 789</p>
          <p>Email: support@lumispa.vn</p>
          <p>123 Nguyễn Trãi, P. Phạm Ngũ Lão, Q1, TP. Hồ Chí Minh</p>
        </div>

        {/* Customer Support */}
        <div>
          <h3 className="text-lg font-semibold text-purple-400 mb-3">
            Hỗ trợ khách hàng
          </h3>
          <ul className="space-y-2 opacity-90">
            <li>
              <Link to="/faq" className="hover:text-white transition">
                Câu hỏi thường gặp (FAQ)
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-white transition">
                Liên hệ hỗ trợ
              </Link>
            </li>
            <li>
              <Link to="/booking-policy" className="hover:text-white transition">
                Chính sách đặt lịch
              </Link>
            </li>
            <li>
              <Link to="/refund-policy" className="hover:text-white transition">
                Chính sách hoàn tiền
              </Link>
            </li>
          </ul>
        </div>

        {/* Legal */}
        <div>
          <h3 className="text-lg font-semibold text-purple-400 mb-3">
            Chính sách & điều khoản
          </h3>
          <ul className="space-y-2 opacity-90">
            <li>
              <Link to="/privacy-policy" className="hover:text-white transition">
                Chính sách bảo mật
              </Link>
            </li>
            <li>
              <Link to="/terms" className="hover:text-white transition">
                Điều khoản sử dụng
              </Link>
            </li>
          </ul>
        </div>

      </div>

      <div className="text-center py-4 border-t border-gray-700 text-gray-400 text-sm">
        © {new Date().getFullYear()} LumiSpa – All rights reserved.
      </div>
    </footer>
  );
}