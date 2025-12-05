import { FaFacebookF, FaInstagram, FaPhone, FaEnvelope } from "react-icons/fa";

export default function TopBar() {
  return (
    <div className="bg-purple-600 text-white text-sm">
      <div className="container mx-auto flex justify-between items-center py-1 px-4">
        <div className="flex items-center gap-4">
          <FaPhone /> <span>+84 123 456 789</span>
          <FaEnvelope /> <span>contact@spabooking.com</span>
        </div>
        <div className="flex items-center gap-3">
          <a href="#" className="hover:text-gray-300"><FaFacebookF /></a>
          <a href="#" className="hover:text-gray-300"><FaInstagram /></a>
        </div>
      </div>
    </div>
  );
}