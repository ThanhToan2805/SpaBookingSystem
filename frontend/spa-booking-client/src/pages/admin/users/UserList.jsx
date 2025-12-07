import { useEffect, useState } from "react";
import { userApi } from "../../../api/userApi";
import { Link } from "react-router-dom";
import AdminLayout from "../layout/AdminLayout";

export default function UserList() {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  // pagination
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const load = async () => {
    try {
      const res = await userApi.getAll();
      setData(res);
    } catch (err) {
      console.error("Failed to load users:", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Xoá user này?")) return;
    try {
      await userApi.delete(id);
      await load();
    } catch (err) {
      console.error("Failed to delete user:", err);
      alert("Xóa thất bại, thử lại sau.");
    }
  };

  useEffect(() => {
    load();
  }, []);

  // khi search/roleFilter đổi → quay về trang 1
  useEffect(() => {
    setPage(1);
  }, [search, roleFilter]);

  const filtered = data.filter((u) => {
    const term = search.toLowerCase();
    const matchText =
      u.username.toLowerCase().includes(term) ||
      (u.email || "").toLowerCase().includes(term) ||
      (u.fullName || "").toLowerCase().includes(term);

    const matchRole =
      roleFilter === "all"
        ? true
        : u.roleName?.toLowerCase() === roleFilter.toLowerCase();

    return matchText && matchRole;
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
    <AdminLayout title="Quản lý User">
      {/* Header + actions */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">
            Danh sách người dùng
          </h2>
          <p className="text-xs text-slate-400">
            Quản lý tài khoản và phân vai trò trong hệ thống LumiSpa.
          </p>
        </div>
        <Link
          to="/admin/users/create"
          className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition"
        >
          + Tạo user
        </Link>
      </div>

      {/* Filters */}
      <div className="mb-4 flex flex-col md:flex-row gap-3 items-start md:items-center">
        <div className="flex-1 max-w-xs">
          <label className="block text-xs font-medium text-slate-600 mb-1">
            Tìm kiếm
          </label>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Username / Email / Họ tên..."
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">
            Vai trò
          </label>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="all">Tất cả</option>
            <option value="Customer">Customer</option>
            <option value="Staff">Staff</option>
            <option value="Admin">Admin</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-slate-50 text-center text-xs uppercase tracking-wide text-slate-500">
              <th className="p-3 border-b border-slate-100">
                Username
              </th>
              <th className="p-3 border-b border-slate-100">
                Họ tên
              </th>
              <th className="p-3 border-b border-slate-100">
                Email
              </th>
              <th className="p-3 border-b border-slate-100">
                SĐT
              </th>
              <th className="p-3 border-b border-slate-100 w-28">
                Vai trò
              </th>
              <th className="p-3 border-b border-slate-100 w-40">
                Ngày tạo
              </th>
              <th className="p-3 border-b border-slate-100 w-32">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody>
            {paginated.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="p-4 text-center text-slate-400 text-sm"
                >
                  Không có user nào phù hợp.
                </td>
              </tr>
            ) : (
              paginated.map((u) => (
                <tr
                  key={u.id}
                  className="hover:bg-slate-50 transition border-b border-slate-50"
                >
                  <td className="p-3 align-top font-semibold text-slate-900">
                    {u.username}
                  </td>
                  <td className="p-3 align-top text-slate-700">
                    {u.fullName || (
                      <span className="text-xs text-slate-400">
                        Chưa cập nhật
                      </span>
                    )}
                  </td>
                  <td className="p-3 align-top text-slate-700">
                    {u.email}
                  </td>
                  <td className="p-3 align-top text-slate-700">
                    {u.phoneNumber || (
                      <span className="text-xs text-slate-400">
                        Chưa cập nhật
                      </span>
                    )}
                  </td>
                  <td className="p-3 align-top">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-slate-50 text-slate-700 border border-slate-200">
                      {u.roleName}
                    </span>
                  </td>
                  <td className="p-3 align-top text-slate-600">
                    {u.createdAt
                      ? new Date(u.createdAt).toLocaleString("vi-VN")
                      : "-"}
                  </td>
                  <td className="p-3 align-top">
                    <button
                      onClick={() => handleDelete(u.id)}
                      className="px-3 py-1.5 bg-red-500 text-white rounded-lg text-xs font-medium hover:bg-red-600 transition"
                    >
                      Delete
                    </button>
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
              ? `Đang hiển thị ${showingFrom}–${showingTo} trên tổng ${totalItems} user`
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