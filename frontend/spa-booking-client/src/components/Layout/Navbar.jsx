import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useEffect, useState, useRef } from "react";
import ChevronDownIcon from "../../components/icons/ChevronDownIcon";

export default function Navbar() {
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [sticky, setSticky] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > 50) {
        setSticky(true);
      } else if (currentScrollY < 50) {
        setSticky(false);
      }
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className={`w-full bg-white shadow-md transition-all duration-300 ${sticky ? "fixed top-0 left-0 z-50 shadow-xl" : "relative"}`}>
      <div className="container mx-auto flex justify-between items-center py-4 px-4 transition-all duration-300">
        <Link to="/" className="text-2xl font-bold text-purple-600">SpaBooking</Link>
        <div className="flex items-center gap-4 relative">
          <Link to="/services" className="hover:text-purple-600 transition">Services</Link>
          <Link to="/categories" className="hover:text-purple-600 transition">Categories</Link>
          <Link to="/about" className="hover:text-purple-600 transition">About</Link>
          <Link to="/contact" className="hover:text-purple-600 transition">Contact</Link>

          {user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-1 px-3 py-1 rounded hover:bg-purple-50 transition"
              >
                <span className="font-medium">{user.username}</span>
                <ChevronDownIcon className="w-4 h-4 text-gray-600" />
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded shadow-lg overflow-hidden z-50 animate-fadeIn">
                  {[
                    { label: "Thông tin cá nhân", to: "/profile", type: "link" },
                    { label: "Các lịch đã đặt", to: "/my-bookings", type: "link" },
                    { label: "Đổi mật khẩu", to: "/auth/change-password", type: "link" },
                    { label: "Đăng xuất", type: "button", onClick: () => logout() },
                  ].map((item, idx) =>
                    item.type === "link" ? (
                      <Link
                        key={idx}
                        to={item.to}
                        className="block px-4 py-2 text-gray-700 hover:bg-purple-50 transition"
                        onClick={() => setDropdownOpen(false)}
                      >
                        {item.label}
                      </Link>
                    ) : (
                      <button
                        key={idx}
                        onClick={() => { item.onClick(); setDropdownOpen(false); }}
                        className="w-full px-4 py-2 text-red-600 hover:bg-red-50 transition"
                      >
                        {item.label}
                      </button>
                    )
                  )}
                </div>
              )}
            </div>
          ) : (
            <>
              <Link
                to="/auth/signin"
                className="px-3 py-1 bg-purple-600 text-white rounded hover:bg-purple-700 transition"
              >
                Login
              </Link>
              <Link
                to="/auth/signup"
                className="px-3 py-1 border border-purple-600 text-purple-600 rounded hover:bg-purple-50 transition"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}