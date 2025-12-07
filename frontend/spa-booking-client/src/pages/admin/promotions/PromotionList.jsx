// src/pages/admin/promotions/PromotionList.jsx
import { useEffect, useState } from "react";
import { promotionApi } from "../../../api/promotionApi";
import { Link } from "react-router-dom";
import AdminLayout from "../layout/AdminLayout";

export default function PromotionList() {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const pageSize = 6;

  const load = async () => {
    try {
      const res = await promotionApi.getAll();
      // sort mới nhất lên trước
      const sorted = [...res].sort(
        (a, b) => new Date(b.startAt) - new Date(a.startAt)
      );
      setData(sorted);
    } catch (err) {
      console.error("Failed to load promotions:", err);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Xóa promotion này?")) return;
    try {
      await promotionApi.delete(id);
      load();
    } catch (err) {
      console.error("Failed to delete promotion:", err);
      alert("Xóa thất bại, thử lại sau.");
    }
  };

  const filtered = data.filter((p) => {
    const matchName = p.name.toLowerCase().includes(search.toLowerCase());
    const matchStatus =
      statusFilter === "all"
        ? true
        : statusFilter === "active"
        ? p.isActive
        : !p.isActive;
    return matchName && matchStatus;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const paginated = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [totalPages, page]);

  const formatDate = (d) =>
    d ? new Date(d).toLocaleString("vi-VN") : "—";

  const renderDiscountType = (p) => {
    const hasPercent = p.discountPercent != null && p.discountPercent !== 0;
    const hasAmount = p.discountAmount != null && p.discountAmount !== 0;

    if (hasPercent && hasAmount) return "Giảm % + tiền";
    if (hasPercent) return "Giảm theo %";
    if (hasAmount) return "Giảm theo số tiền";
    return "Không cấu hình";
  };

  const renderDiscountValue = (p) => {
    const parts = [];
    if (p.discountPercent) parts.push(`${p.discountPercent}%`);
    if (p.discountAmount)
      parts.push(
        new Intl.NumberFormat("vi-VN", {
          style: "currency",
          currency: "VND",
        }).format(p.discountAmount)
      );
    return parts.length ? parts.join(" + ") : "—";
  };

  return (
    <AdminLayout title="Quản lý Promotion">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Promotions</h2>
          <p className="text-sm text-slate-500">
            Quản lý các chương trình khuyến mãi của LumiSpa.
          </p>
        </div>
        <Link
          to="/admin/promotions/create"
          className="px-5 py-2 bg-purple-600 text-white rounded-xl text-sm font-semibold shadow hover:bg-purple-700 transition"
        >
          + Tạo Promotion
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-3 items-start md:items-center mb-4">
        <div className="max-w-xs w-full">
          <label className="block text-xs font-medium text-slate-600 mb-1">
            Tìm theo tên
          </label>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Nhập tên promotion..."
            className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-purple-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">
            Trạng thái
          </label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-purple-500 outline-none"
          >
            <option value="all">Tất cả</option>
            <option value="active">Đang hoạt động</option>
            <option value="inactive">Ngừng hoạt động</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 text-center text-xs uppercase tracking-wide text-slate-500">
              <th className="p-3">Tên</th>
              <th className="p-3">Loại</th>
              <th className="p-3">Giá trị</th>
              <th className="p-3">Thời gian</th>
              <th className="p-3 w-28">Trạng thái</th>
              <th className="p-3 w-40">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {paginated.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="p-4 text-center text-slate-400 text-sm"
                >
                  Không có promotion nào phù hợp.
                </td>
              </tr>
            ) : (
              paginated.map((p) => (
                <tr
                  key={p.id}
                  className="border-t border-slate-100 hover:bg-purple-50/40 transition"
                >
                  <td className="p-3 font-semibold text-slate-900">
                    {p.name}
                  </td>
                  <td className="p-3 text-slate-700">
                    {renderDiscountType(p)}
                  </td>
                  <td className="p-3 text-slate-700">
                    {renderDiscountValue(p)}
                  </td>
                  <td className="p-3 text-slate-700">
                    <div className="text-xs text-slate-500">
                      <div>Từ: {formatDate(p.startAt)}</div>
                      <div>Đến: {formatDate(p.endAt)}</div>
                    </div>
                  </td>
                  <td className="p-3 text-center">
                    {p.isActive ? (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">
                        ● Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-slate-50 text-slate-500 border border-slate-100">
                        ● Inactive
                      </span>
                    )}
                  </td>
                  <td className="p-3">
                    <div className="flex justify-center gap-2">
                      <Link
                        to={`/admin/promotions/edit/${p.id}`}
                        className="px-3 py-1.5 bg-amber-400 text-slate-900 rounded-lg text-xs font-medium hover:bg-amber-500 transition"
                      >
                        Sửa
                      </Link>
                      <button
                        onClick={() => handleDelete(p.id)}
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
              safePage === i + 1
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