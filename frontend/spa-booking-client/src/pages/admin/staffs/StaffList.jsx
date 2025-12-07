import { useEffect, useState } from "react";
import { staffApi } from "../../../api/staffApi";
import { Link } from "react-router-dom";
import AdminLayout from "../layout/AdminLayout";

export default function StaffList() {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [availabilityFilter, setAvailabilityFilter] = useState("all");

  // pagination
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const load = async () => {
    try {
      const res = await staffApi.getAll();
      setData(res);
    } catch (err) {
      console.error("Failed to load staffs:", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Xoá nhân viên này?")) return;
    try {
      await staffApi.delete(id);
      load();
    } catch (err) {
      console.error("Failed to delete staff:", err);
      alert("Xóa thất bại, thử lại sau.");
    }
  };

  const handleToggleAvailability = async (staff) => {
    const actionLabel = staff.isAvailable ? "tạm ngưng nhận khách" : "mở nhận khách";
    if (!window.confirm(`Bạn có chắc muốn ${actionLabel} cho ${staff.userName || "nhân viên này"}?`)) {
      return;
    }

    try {
      await staffApi.toggleAvailability(staff.id, {});
      await load();
    } catch (err) {
      console.error("Failed to toggle availability:", err);
      alert("Cập nhật trạng thái thất bại!");
    }
  };

  useEffect(() => {
    load();
  }, []);

  // reset page khi đổi filter/search
  useEffect(() => {
    setPage(1);
  }, [search, availabilityFilter]);

  const filtered = data.filter((s) => {
    const matchName = (s.userName || "")
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchAvailability =
      availabilityFilter === "all"
        ? true
        : availabilityFilter === "available"
        ? s.isAvailable
        : !s.isAvailable;

    return matchName && matchAvailability;
  });

  const totalItems = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [totalPages, page]);

  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginated = filtered.slice(startIndex, endIndex);

  const showingFrom = totalItems === 0 ? 0 : startIndex + 1;
  const showingTo = Math.min(endIndex, totalItems);

  return (
    <AdminLayout title="Quản lý Staff">
      {/* Header + actions */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">
            Danh sách nhân viên
          </h2>
          <p className="text-xs text-slate-400">
            Quản lý thông tin, lịch làm việc và trạng thái của đội ngũ LumiSpa.
          </p>
        </div>
        <Link
          to="/admin/staffs/create"
          className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition"
        >
          + Thêm nhân viên
        </Link>
      </div>

      {/* Filters */}
      <div className="mb-4 flex flex-col md:flex-row gap-3 items-start md:items-center">
        <div className="flex-1 max-w-xs">
          <label className="block text-xs font-medium text-slate-600 mb-1">
            Tìm theo tên đăng nhập
          </label>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Nhập username..."
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">
            Trạng thái làm việc
          </label>
          <select
            value={availabilityFilter}
            onChange={(e) => setAvailabilityFilter(e.target.value)}
            className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="all">Tất cả</option>
            <option value="available">Đang nhận khách</option>
            <option value="unavailable">Không nhận khách</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-slate-50 text-center text-xs uppercase tracking-wide text-slate-500">
              <th className="p-3 border-b border-slate-100">Username</th>
              <th className="p-3 border-b border-slate-100">Vị trí</th>
              <th className="p-3 border-b border-slate-100 w-32">
                Trạng thái
              </th>
              <th className="p-3 border-b border-slate-100 w-[260px]">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody>
            {paginated.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="p-4 text-center text-slate-400 text-sm"
                >
                  Không có nhân viên nào phù hợp.
                </td>
              </tr>
            ) : (
              paginated.map((s) => (
                <tr
                  key={s.id}
                  className="hover:bg-slate-50 transition border-b border-slate-50"
                >
                  <td className="p-3 align-top">
                    <div className="font-semibold text-slate-900">
                      {s.userName || "Unknown"}
                    </div>
                  </td>
                  <td className="p-3 align-top text-slate-700">
                    {s.position || (
                      <span className="text-xs text-slate-400">
                        Chưa cập nhật
                      </span>
                    )}
                  </td>
                  <td className="p-3 align-top">
                    {s.isAvailable ? (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">
                        ● Available
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-slate-50 text-slate-500 border border-slate-100">
                        ● Not available
                      </span>
                    )}
                  </td>
                  <td className="p-3 align-top">
                    <div className="flex flex-wrap gap-2 justify-start">
                      <Link
                        to={`/admin/staffs/edit/${s.id}`}
                        className="px-3 py-1.5 bg-amber-400 text-slate-900 rounded-lg text-xs font-medium hover:bg-amber-500 transition"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleToggleAvailability(s)}
                        className="px-3 py-1.5 border border-slate-300 text-slate-700 rounded-lg text-xs font-medium hover:bg-slate-50 transition"
                      >
                        {s.isAvailable ? "Tạm nghỉ" : "Mở nhận khách"}
                      </button>
                      <Link
                        to={`/admin/staffs/${s.id}/schedule`}
                        className="px-3 py-1.5 bg-blue-500 text-white rounded-lg text-xs font-medium hover:bg-blue-600 transition"
                      >
                        Lịch làm việc
                      </Link>
                      <Link
                        to={`/admin/staffs/${s.id}/analytics`}
                        className="px-3 py-1.5 bg-emerald-500 text-white rounded-lg text-xs font-medium hover:bg-emerald-600 transition"
                      >
                        Hiệu suất
                      </Link>
                      <button
                        onClick={() => handleDelete(s.id)}
                        className="px-3 py-1.5 bg-red-500 text-white rounded-lg text-xs font-medium hover:bg-red-600 transition"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Pagination bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-3 px-4 py-3 border-t bg-slate-50 text-xs text-slate-600">
          <div>
            {totalItems > 0
              ? `Đang hiển thị ${showingFrom}–${showingTo} trên tổng ${totalItems} nhân viên`
              : "Không có dữ liệu"}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className={`px-3 py-1.5 rounded border text-xs font-medium ${
                page === 1
                  ? "opacity-40 cursor-not-allowed"
                  : "hover:bg-white"
              }`}
            >
              ← Trước
            </button>
            <span className="px-2 font-semibold">
              Trang {page} / {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages || totalItems === 0}
              className={`px-3 py-1.5 rounded border text-xs font-medium ${
                page === totalPages || totalItems === 0
                  ? "opacity-40 cursor-not-allowed"
                  : "hover:bg-white"
              }`}
            >
              Sau →
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}