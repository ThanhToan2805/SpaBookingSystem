import { useEffect, useState } from "react";
import { serviceApi } from "../../../api/serviceApi";
import { Link } from "react-router-dom";
import AdminLayout from "../layout/AdminLayout";

export default function ServiceList() {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");

  // pagination
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const load = async () => {
    try {
      const res = await serviceApi.getAll();
      setData(res);
    } catch (err) {
      console.error("Failed to load services:", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Xoá service này?")) return;
    try {
      await serviceApi.delete(id);
      load();
    } catch (err) {
      console.error("Failed to delete service:", err);
      alert("Xóa thất bại, thử lại sau.");
    }
  };

  useEffect(() => {
    load();
  }, []);

  // reset về trang 1 khi đổi filter/search
  useEffect(() => {
    setPage(1);
  }, [search, activeFilter]);

  const filtered = data.filter((x) => {
    const matchName = x.name
      ?.toLowerCase()
      .includes(search.toLowerCase());
    const matchActive =
      activeFilter === "all"
        ? true
        : activeFilter === "active"
        ? x.isActive
        : !x.isActive;
    return matchName && matchActive;
  });

  const totalItems = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  // nếu đang ở page lớn hơn totalPages (sau khi filter ít lại) thì kéo về trang cuối hợp lệ
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
    <AdminLayout title="Quản lý Services">
      {/* Header + actions */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">
            Danh sách dịch vụ
          </h2>
          <p className="text-xs text-slate-400">
            Quản lý giá, trạng thái hiển thị và thông tin dịch vụ.
          </p>
        </div>
        <Link
          to="/admin/services/create"
          className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition"
        >
          + Tạo service
        </Link>
      </div>

      {/* Filters */}
      <div className="mb-4 flex flex-col md:flex-row gap-3 items-start md:items-center">
        <div className="flex-1 max-w-xs">
          <label className="block text-xs font-medium text-slate-600 mb-1">
            Tìm theo tên
          </label>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Nhập tên dịch vụ..."
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">
            Trạng thái
          </label>
          <select
            value={activeFilter}
            onChange={(e) => setActiveFilter(e.target.value)}
            className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="all">Tất cả</option>
            <option value="active">Chỉ Active</option>
            <option value="inactive">Chỉ Inactive</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-slate-50 text-center text-xs uppercase tracking-wide text-slate-500">
              <th className="p-3 border-b border-slate-100 w-24">
                Image
              </th>
              <th className="p-3 border-b border-slate-100">
                Name
              </th>
              <th className="p-3 border-b border-slate-100 w-32">
                Price
              </th>
              <th className="p-3 border-b border-slate-100 w-28">
                Active
              </th>
              <th className="p-3 border-b border-slate-100 w-40">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {paginated.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="p-4 text-center text-slate-400 text-sm"
                >
                  Không có dịch vụ nào phù hợp.
                </td>
              </tr>
            ) : (
              paginated.map((x) => (
                <tr
                  key={x.id}
                  className="hover:bg-slate-50 transition border-b border-slate-50"
                >
                  <td className="p-2 align-top">
                    <div className="w-16 h-16 rounded-lg overflow-hidden border border-slate-200 bg-slate-100">
                      {x.imageUrl ? (
                        <img
                          src={x.imageUrl}
                          alt={x.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[10px] text-slate-400">
                          No image
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="p-3 align-top">
                    <div className="font-semibold text-slate-900">
                      {x.name}
                    </div>
                  </td>
                  <td className="p-3 align-top text-slate-700">
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(x.price || 0)}
                  </td>
                  <td className="p-3 align-top">
                    {x.isActive ? (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">
                        ● Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-slate-50 text-slate-500 border border-slate-100">
                        ● Inactive
                      </span>
                    )}
                  </td>
                  <td className="p-3 align-top">
                    <div className="flex flex-wrap gap-2 justify-center">
                      <Link
                        to={`/admin/services/${x.id}`}
                        className="px-3 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-medium hover:bg-slate-800 transition"
                      >
                        Xem
                      </Link>
                      <Link
                        to={`/admin/services/edit/${x.id}`}
                        className="px-3 py-1.5 bg-amber-400 text-slate-900 rounded-lg text-xs font-medium hover:bg-amber-500 transition"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(x.id)}
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
              ? `Đang hiển thị ${showingFrom}–${showingTo} trên tổng ${totalItems} dịch vụ`
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
              onClick={() =>
                setPage((p) => Math.min(totalPages, p + 1))
              }
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