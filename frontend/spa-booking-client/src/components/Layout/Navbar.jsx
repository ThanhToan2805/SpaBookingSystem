import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useState, useEffect, useRef } from "react";
import { ChevronDown } from "lucide-react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef();
  const [sticky, setSticky] = useState(false);

  useEffect(() => {
    const handleSticky = () => setSticky(window.scrollY > 40);
    window.addEventListener("scroll", handleSticky);
    return () => window.removeEventListener("scroll", handleSticky);
  }, []);

  useEffect(() => {
    const close = e => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  return (
    <nav className={`w-full bg-white transition-all duration-300 shadow-md 
      ${sticky ? "fixed top-0 left-0 z-50 shadow-lg" : ""}`}>

      <div className="container mx-auto flex justify-between items-center py-4 px-4">

        <Link to="/" className="text-3xl font-bold text-purple-600 tracking-wide">
          LumiSpa
        </Link>

        <div className="flex items-center gap-6 font-medium text-gray-700">

          <Link to="/services" className="hover:text-purple-600 transition">Dịch vụ</Link>
          <Link to="/categories" className="hover:text-purple-600 transition">Danh mục</Link>
          <Link to="/staffs" className="hover:text-purple-600 transition">Đội ngũ</Link>
          <Link to="/blog" className="hover:text-purple-600 transition">Bài viết</Link>
          <Link to="/about" className="hover:text-purple-600 transition">Giới thiệu</Link>
          <Link to="/contact" className="hover:text-purple-600 transition">Liên hệ</Link>

          {user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setOpen(!open)}
                className="flex items-center gap-1 hover:text-purple-600 transition"
              >
                {user.username}
                <ChevronDown size={18} />
              </button>

              {open && (
                <div className="absolute right-0 mt-3 bg-white rounded-xl shadow-lg border w-48 overflow-hidden animate-fadeIn z-100">
                  <Link
                    to="/profile"
                    className="block px-4 py-2 hover:bg-purple-50 transition"
                  >
                    Hồ sơ
                  </Link>
                  <Link
                    to="/my-bookings"
                    className="block px-4 py-2 hover:bg-purple-50 transition"
                  >
                    Lịch đã đặt
                  </Link>
                  <Link
                    to="/auth/change-password"
                    className="block px-4 py-2 hover:bg-purple-50 transition"
                  >
                    Đổi mật khẩu
                  </Link>
                  <button
                    onClick={logout}
                    className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 transition"
                  >
                    Đăng xuất
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link
                to="/auth/signin"
                className="px-4 py-1 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
              >
                Đăng nhập
              </Link>
              <Link
                to="/auth/signup"
                className="px-4 py-1 border border-purple-600 text-purple-600 rounded-lg hover:bg-purple-50 transition"
              >
                Đăng ký
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}