import { useEffect, useState } from "react";
import { roleApi } from "../../../api/roleApi";
import { Link } from "react-router-dom";
import AdminLayout from "../layout/AdminLayout";

export default function RoleList() {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 6;

  const load = async () => {
    const res = await roleApi.getAll();
    setData(res);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Xóa Role này?")) return;
    await roleApi.delete(id);
    load();
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = data.filter((x) =>
    x.name.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / pageSize);
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  return (
    <AdminLayout title="Quản lý Roles">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-3">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Roles</h2>
          <p className="text-sm text-slate-500">
            Quản lý quyền truy cập của hệ thống LumiSpa.
          </p>
        </div>

        <Link
          to="/admin/roles/create"
          className="px-5 py-2 bg-purple-600 text-white rounded-xl text-sm font-semibold shadow hover:bg-purple-700 transition"
        >
          + Tạo Role
        </Link>
      </div>

      {/* Search Input */}
      <div className="mb-4 max-w-xs">
        <label className="block mb-1 text-sm font-medium text-slate-600">
          Tìm kiếm
        </label>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Nhập tên role..."
          className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-purple-500 outline-none"
        />
      </div>

      {/* Table Container */}
      <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 text-center text-xs uppercase text-slate-500 tracking-wide">
              <th className="p-3">Tên Role</th>
              <th className="p-3">Mô tả</th>
              <th className="p-3 w-40">Thao tác</th>
            </tr>
          </thead>

          <tbody>
            {paginated.length === 0 ? (
              <tr>
                <td colSpan={3} className="p-4 text-center text-slate-400">
                  Không tìm thấy role nào.
                </td>
              </tr>
            ) : (
              paginated.map((r) => (
                <tr
                  key={r.id}
                  className="border-t border-slate-100 hover:bg-purple-50/40 transition"
                >
                  <td className="p-3 font-semibold text-slate-800">{r.name}</td>
                  <td className="p-3 text-slate-600">
                    {r.description || (
                      <span className="text-slate-400 italic">Không có mô tả</span>
                    )}
                  </td>
                  <td className="p-3">
                    <div className="flex justify-center gap-2">
                      <Link
                        to={`/admin/roles/edit/${r.id}`}
                        className="px-3 py-1.5 bg-amber-400 text-black rounded-lg text-xs font-medium hover:bg-amber-500 transition"
                      >
                        Sửa
                      </Link>
                      <button
                        onClick={() => handleDelete(r.id)}
                        className="px-3 py-1.5 bg-red-500 text-white rounded-lg text-xs font-medium hover:bg-red-600 transition"
                      >
                        Xóa
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-5 gap-2">
        {Array.from({ length: totalPages }).map((_, i) => (
          <button
            key={i}
            onClick={() => setPage(i + 1)}
            className={`px-3 py-1 rounded-lg text-sm border ${
              page === i + 1
                ? "bg-purple-600 text-white border-purple-600"
                : "bg-white text-slate-600 hover:bg-slate-50"
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </AdminLayout>
  );
}