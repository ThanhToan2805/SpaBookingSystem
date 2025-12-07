import { useEffect, useMemo, useState } from "react";
import AdminLayout from "../layout/AdminLayout";
import { paymentApi } from "../../../api/paymentApi";
import { Link } from "react-router-dom";

const PAYMENT_STATUS = ["Pending", "Completed", "Failed", "Cancelled"];

function formatDateTime(d) {
  if (!d) return "—";
  return new Date(d).toLocaleString("vi-VN");
}

function formatMoney(v) {
  if (v == null) return "—";
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(v);
}

function statusBadge(status) {
  const base =
    "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ";

  switch (status) {
    case "Pending":
      return (
        <span
          className={
            base + "bg-amber-50 text-amber-700 border-amber-100"
          }
        >
          ● Pending
        </span>
      );
    case "Completed":
      return (
        <span
          className={
            base + "bg-emerald-50 text-emerald-700 border-emerald-100"
          }
        >
          ● Completed
        </span>
      );
    case "Failed":
      return (
        <span
          className={
            base + "bg-rose-50 text-rose-700 border-rose-100"
          }
        >
          ● Failed
        </span>
      );
    case "Cancelled":
      return (
        <span
          className={
            base + "bg-slate-50 text-slate-600 border-slate-200"
          }
        >
          ● Cancelled
        </span>
      );
    default:
      return (
        <span
          className={
            base + "bg-slate-50 text-slate-600 border-slate-200"
          }
        >
          ● {status || "Unknown"}
        </span>
      );
  }
}

export default function PaymentList() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);

  const [searchInvoice, setSearchInvoice] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [methodFilter, setMethodFilter] = useState("all");

  // pagination
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const load = async () => {
    try {
      setLoading(true);
      const res = await paymentApi.getAll();
      console.log(res)
      // sort mới nhất lên trước
      const sorted = [...(res || [])].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setPayments(sorted);
    } catch (err) {
      console.error("Failed to load payments:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  // reset về trang 1 khi đổi filter/search
  useEffect(() => {
    setPage(1);
  }, [searchInvoice, statusFilter, methodFilter]);

  const filtered = useMemo(() => {
    let data = [...payments];

    if (searchInvoice.trim()) {
      const q = searchInvoice.trim().toLowerCase();
      data = data.filter((p) =>
        (p.invoiceCode || "").toLowerCase().includes(q)
      );
    }

    if (statusFilter !== "all") {
      data = data.filter((p) => p.status === statusFilter);
    }

    if (methodFilter !== "all") {
      data = data.filter(
        (p) =>
          (p.paymentMethod || "").toLowerCase() ===
          methodFilter.toLowerCase()
      );
    }

    return data;
  }, [payments, searchInvoice, statusFilter, methodFilter]);

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
    <AdminLayout title="Quản lý Payment">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">
            Danh sách thanh toán
          </h2>
          <p className="text-xs text-slate-400">
            Theo dõi trạng thái thanh toán, phương thức và hóa đơn của khách hàng.
          </p>
        </div>
        {/* Không có nút Tạo mới vì payment do khách tạo */}
      </div>

      {/* Filters */}
      <div className="mb-4 flex flex-col md:flex-row gap-3 items-start md:items-end bg-white rounded-2xl border border-slate-100 p-4">
        <div className="flex-1 min-w-[200px]">
          <label className="block text-xs font-medium text-slate-600 mb-1">
            Tìm theo mã hóa đơn (InvoiceCode)
          </label>
          <input
            value={searchInvoice}
            onChange={(e) => setSearchInvoice(e.target.value)}
            placeholder="Nhập mã hóa đơn..."
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div className="w-full md:w-40">
          <label className="block text-xs font-medium text-slate-600 mb-1">
            Trạng thái
          </label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="all">Tất cả</option>
            {PAYMENT_STATUS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        <div className="w-full md:w-40">
          <label className="block text-xs font-medium text-slate-600 mb-1">
            Phương thức
          </label>
          <select
            value={methodFilter}
            onChange={(e) => setMethodFilter(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="all">Tất cả</option>
            <option value="Cash">Cash</option>
            <option value="VNPay">VNPay</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 text-center text-xs uppercase tracking-wide text-slate-500">
              <th className="p-3 border-b border-slate-100 w-40">
                Hóa đơn
              </th>
              <th className="p-3 border-b border-slate-100 w-32">
                Số tiền
              </th>
              <th className="p-3 border-b border-slate-100 w-32">
                Phương thức
              </th>
              <th className="p-3 border-b border-slate-100 w-32">
                Trạng thái
              </th>
              <th className="p-3 border-b border-slate-100 w-40">
                Thời gian thanh toán
              </th>
              <th className="p-3 border-b border-slate-100 w-40">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={6}
                  className="p-4 text-center text-slate-500"
                >
                  Đang tải...
                </td>
              </tr>
            ) : paginated.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="p-4 text-center text-slate-400 text-sm"
                >
                  Không có payment nào phù hợp.
                </td>
              </tr>
            ) : (
              paginated.map((p) => (
                <tr
                  key={p.id}
                  className="border-t border-slate-100 hover:bg-purple-50/40 transition"
                >
                  <td className="p-3 align-top text-center">
                    <div className="font-semibold text-slate-900">
                      {p.invoiceCode}
                    </div>
                  </td>
                  <td className="p-3 align-top text-center">
                    <span className="font-medium text-slate-900">
                      {formatMoney(p.amount)}
                    </span>
                  </td>
                  <td className="p-3 align-top text-center">
                    <span className="text-xs font-medium px-2 py-1 rounded-full bg-slate-50 border border-slate-200 text-slate-700">
                      {p.paymentMethod}
                    </span>
                  </td>
                  <td className="p-3 align-top text-center">
                    {statusBadge(p.status)}
                  </td>
                  <td className="p-3 align-top text-center text-xs text-slate-700">
                    {p.paidAt
                      ? formatDateTime(p.paidAt)
                      : "Chưa thanh toán"}
                  </td>
                  <td className="p-3 align-top">
                    <div className="flex justify-center">
                      <Link
                        to={`/admin/payments/${p.id}`}
                        className="px-3 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-medium hover:bg-slate-800 transition"
                      >
                        Xem
                      </Link>
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
              ? `Đang hiển thị ${showingFrom}–${showingTo} trên tổng ${totalItems} payment`
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