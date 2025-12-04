import AdminLayout from "./layout/AdminLayout";

export default function Dashboard() {
  return (
    <AdminLayout title="Dashboard">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        <div className="p-6 bg-white rounded-xl shadow hover:shadow-2xl transition transform hover:-translate-y-1">
          <h2 className="text-xl font-semibold mb-2">Quản lý Categories</h2>
          <p className="text-gray-500">Xem, tạo, chỉnh sửa hoặc xóa category</p>
          <a
            href="/admin/categories"
            className="mt-4 inline-block px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Đi tới
          </a>
        </div>

        <div className="p-6 bg-white rounded-xl shadow hover:shadow-2xl transition transform hover:-translate-y-1">
          <h2 className="text-xl font-semibold mb-2">Quản lý Services</h2>
          <p className="text-gray-500">Xem, tạo, chỉnh sửa hoặc xóa dịch vụ</p>
          <a
            href="/admin/services"
            className="mt-4 inline-block px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Đi tới
          </a>
        </div>
      </div>
    </AdminLayout>
  );
}