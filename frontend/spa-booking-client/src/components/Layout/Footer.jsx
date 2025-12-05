export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-200 mt-12">
      <div className="container mx-auto px-4 py-8 grid md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-semibold text-purple-500 mb-2">SpaBooking</h3>
          <p>Chăm sóc sức khỏe và làm đẹp chuyên nghiệp.</p>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-purple-500 mb-2">Liên hệ</h3>
          <p>Số điện thoại: +84 123 456 789</p>
          <p>Email: contact@spabooking.com</p>
          <p>Địa chỉ: 123 Nguyễn Trãi, Quận 1, TP.HCM</p>
        </div>
      </div>
    </footer>
  );
}