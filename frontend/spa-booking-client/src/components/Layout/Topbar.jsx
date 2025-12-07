import { FaFacebookF, FaInstagram, FaPhone, FaEnvelope } from "react-icons/fa";

export default function TopBar() {
  return (
    <div className="bg-purple-700 text-white text-sm">
      <div className="container mx-auto flex justify-between items-center py-2 px-4">
        
        <div className="flex items-center gap-4 opacity-90">
          <div className="flex items-center gap-1">
            <FaPhone /> <span>+84 123 456 789</span>
          </div>
          <div className="flex items-center gap-1">
            <FaEnvelope /> <span>support@lumispa.vn</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <a href="#" className="hover:text-gray-200">
            <FaFacebookF />
          </a>
          <a href="#" className="hover:text-gray-200">
            <FaInstagram />
          </a>
        </div>

      </div>
    </div>
  );
}