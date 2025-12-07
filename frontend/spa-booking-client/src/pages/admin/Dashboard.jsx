import { Link } from "react-router-dom";
import AdminLayout from "./layout/AdminLayout";

export default function Dashboard() {
  return (
    <AdminLayout title="Dashboard">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {/* Categories */}
        <div className="p-6 bg-white rounded-2xl shadow-sm border border-slate-100 hover:shadow-lg hover:-translate-y-0.5 transition">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-slate-900">
              Quản lý Categories
            </h2>
            <span className="text-xs px-2 py-1 rounded-full bg-purple-50 text-purple-600 font-medium">
              Nội dung
            </span>
          </div>
          <p className="text-sm text-slate-500 mb-4">
            Quản lý nhóm dịch vụ (category) cho hệ thống LumiSpa.
          </p>
          <Link
            to="/admin/categories"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-600 text-white text-sm font-medium hover:bg-purple-700 transition"
          >
            Đi tới
            <span>→</span>
          </Link>
        </div>

        {/* Services */}
        <div className="p-6 bg-white rounded-2xl shadow-sm border border-slate-100 hover:shadow-lg hover:-translate-y-0.5 transition">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-slate-900">
              Quản lý Services
            </h2>
            <span className="text-xs px-2 py-1 rounded-full bg-pink-50 text-pink-600 font-medium">
              Sản phẩm
            </span>
          </div>
          <p className="text-sm text-slate-500 mb-4">
            Quản lý danh sách dịch vụ spa, giá, mô tả và thời lượng từng
            dịch vụ.
          </p>
          <Link
            to="/admin/services"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-pink-600 text-white text-sm font-medium hover:bg-pink-700 transition"
          >
            Đi tới
            <span>→</span>
          </Link>
        </div>

        {/* Users */}
        <div className="p-6 bg-white rounded-2xl shadow-sm border border-slate-100 hover:shadow-lg hover:-translate-y-0.5 transition">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-slate-900">
              Quản lý Users
            </h2>
            <span className="text-xs px-2 py-1 rounded-full bg-red-50 text-red-600 font-medium">
              Người dùng
            </span>
          </div>
          <p className="text-sm text-slate-500 mb-4">
            Quản lý tài khoản, phân quyền và thông tin người dùng trong hệ thống.
          </p>
          <Link
            to="/admin/users"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition"
          >
            Đi tới
            <span>→</span>
          </Link>
        </div>

        {/* Staffs */}
        <div className="p-6 bg-white rounded-2xl shadow-sm border border-slate-100 hover:shadow-lg hover:-translate-y-0.5 transition">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-slate-900">
              Quản lý Staffs
            </h2>
            <span className="text-xs px-2 py-1 rounded-full bg-orange-50 text-orange-600 font-medium">
              Nhân viên
            </span>
          </div>
          <p className="text-sm text-slate-500 mb-4">
            Quản lý danh sách nhân viên và vị trí của nhân viên.
          </p>
          <Link
            to="/admin/staffs"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-orange-600 text-white text-sm font-medium hover:bg-orange-700 transition"
          >
            Đi tới
            <span>→</span>
          </Link>
        </div>

        {/* Roles */}
        <div className="p-6 bg-white rounded-2xl shadow-sm border border-slate-100 hover:shadow-lg hover:-translate-y-0.5 transition">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-slate-900">Quản lý Roles</h2>
            <span className="text-xs px-2 py-1 rounded-full bg-yellow-50 text-yellow-600 font-medium">
              Quyền hạn
            </span>
          </div>
          <p className="text-sm text-slate-500 mb-4">
            Thiết lập quyền truy cập hệ thống: Admin, Staff, Customer,...
          </p>
          <Link
            to="/admin/roles"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-yellow-600 text-white text-sm font-medium hover:bg-yellow-700 transition"
          >
            Đi tới
            <span>→</span>
          </Link>
        </div>

        {/* Promotions */}
        <div className="p-6 bg-white rounded-2xl shadow-sm border border-slate-100 hover:shadow-lg hover:-translate-y-0.5 transition">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-slate-900">
              Quản lý Promotions
            </h2>
            <span className="text-xs px-2 py-1 rounded-full bg-gray-50 text-gray-600 font-medium">
              Khuyến mãi
            </span>
          </div>
          <p className="text-sm text-slate-500 mb-4">
            Tạo và quản lý các chương trình giảm giá, voucher cho khách hàng.
          </p>
          <Link
            to="/admin/promotions"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-600 text-white text-sm font-medium hover:bg-gray-700 transition"
          >
            Đi tới
            <span>→</span>
          </Link>
        </div>

        {/* Bookings */}
        <div className="p-6 bg-white rounded-2xl shadow-sm border border-slate-100 hover:shadow-lg hover:-translate-y-0.5 transition">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-slate-900">
              Quản lý Bookings
            </h2>
            <span className="text-xs px-2 py-1 rounded-full bg-blue-50 text-blue-600 font-medium">
              Lịch hẹn
            </span>
          </div>
          <p className="text-sm text-slate-500 mb-4">
            Theo dõi, chỉnh sửa và quản lý lịch đặt của khách theo ngày, khách hàng hoặc dạng calendar.
          </p>
          <Link
            to="/admin/bookings"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition"
          >
            Đi tới
            <span>→</span>
          </Link>
        </div>

        {/* Payments */}
        <div className="p-6 bg-white rounded-2xl shadow-sm border border-slate-100 hover:shadow-lg hover:-translate-y-0.5 transition">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-slate-900">
              Quản lý Payments
            </h2>
            <span className="text-xs px-2 py-1 rounded-full bg-green-50 text-green-600 font-medium">
              Thanh toán
            </span>
          </div>

          <p className="text-sm text-slate-500 mb-4">
            Theo dõi trạng thái thanh toán, phương thức (Cash / VNPay) và chi tiết hóa đơn từng booking.
          </p>

          <Link
            to="/admin/payments"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-green-600 text-white text-sm font-medium hover:bg-green-700 transition"
          >
            Đi tới
            <span>→</span>
          </Link>
        </div>
      </div>
    </AdminLayout>
  );
}