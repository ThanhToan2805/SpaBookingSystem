import { useState } from "react";
import { useParams } from "react-router-dom";
import AdminLayout from "../layout/AdminLayout";
import { staffApi } from "../../../api/staffApi";

export default function StaffAnalytics() {
  const { id: staffId } = useParams();
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [workingHours, setWorkingHours] = useState([]);
  const [utilization, setUtilization] = useState(null);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    if (!from || !to) {
      alert("Vui lòng chọn đầy đủ From / To");
      return;
    }
    setLoading(true);
    try {
      const [wh, util] = await Promise.all([
        staffApi.getWorkingHours(staffId, { from, to }),
        staffApi.getUtilization(staffId, { from, to }),
      ]);

      setWorkingHours(wh || []);
      setUtilization(util || null);
    } catch (err) {
      console.error("Failed to load analytics:", err);
      alert("Không tải được dữ liệu hiệu suất.");
    } finally {
      setLoading(false);
    }
  };

  const utilPercent = utilization?.utilizationPercent ?? 0;
  const safePercent = Math.min(100, Math.max(0, utilPercent));

  return (
    <AdminLayout title="Hiệu suất làm việc nhân viên">
      <div className="max-w-5xl space-y-6">
        {/* Filter range */}
        <div className="flex flex-col md:flex-row md:items-end gap-3">
          <div className="flex-1">
            <p className="text-sm font-semibold text-slate-900">
              Báo cáo hiệu suất
            </p>
            <p className="text-xs text-slate-400">
              Staff ID: <span className="font-mono text-[11px]">{staffId}</span>
            </p>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">
              Từ ngày
            </label>
            <input
              type="date"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">
              Đến ngày
            </label>
            <input
              type="date"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <button
            onClick={load}
            disabled={loading}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition disabled:opacity-60"
          >
            {loading ? "Đang tải..." : "Xem báo cáo"}
          </button>
        </div>

        {/* Summary cards */}
        {utilization && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4">
              <p className="text-xs text-slate-500 mb-1">Tên nhân viên</p>
              <p className="text-sm font-semibold text-slate-900">
                {utilization.staffName}
              </p>
              <p className="mt-2 text-xs text-slate-400">
                Staff ID:{" "}
                <span className="font-mono text-[11px]">
                  {utilization.staffId}
                </span>
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4">
              <p className="text-xs text-slate-500 mb-1">Tổng slot / đã book</p>
              <p className="text-sm font-semibold text-slate-900">
                {utilization.bookedSlots} / {utilization.totalSlots} slot
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4">
              <p className="text-xs text-slate-500 mb-1">Tỷ lệ sử dụng</p>
              <p className="text-sm font-semibold text-emerald-600">
                {utilPercent.toFixed(1)}%
              </p>
              <div className="mt-2 w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div
                  className="h-2 rounded-full bg-emerald-500"
                  style={{ width: `${safePercent}%` }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Working hours table */}
        {workingHours && workingHours.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-100">
              <p className="text-sm font-semibold text-slate-900">
                Chi tiết giờ làm việc theo ngày
              </p>
              <p className="text-xs text-slate-400">
                Thống kê tổng giờ làm, số slot & slot đã book.
              </p>
            </div>
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                  <th className="p-3 border-b border-slate-100 text-left">
                    Ngày
                  </th>
                  <th className="p-3 border-b border-slate-100 text-right">
                    Tổng giờ
                  </th>
                  <th className="p-3 border-b border-slate-100 text-right">
                    Tổng slot
                  </th>
                  <th className="p-3 border-b border-slate-100 text-right">
                    Slot đã book
                  </th>
                </tr>
              </thead>
              <tbody>
                {workingHours.map((item, idx) => (
                  <tr
                    key={idx}
                    className="border-b border-slate-50 hover:bg-slate-50"
                  >
                    <td className="p-3">
                      {new Date(item.date).toLocaleDateString("vi-VN")}
                    </td>
                    <td className="p-3 text-right">
                      {item.totalHours?.toFixed(2)} giờ
                    </td>
                    <td className="p-3 text-right">
                      {item.totalSlots}
                    </td>
                    <td className="p-3 text-right">
                      {item.bookedSlots}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!loading && !utilization && workingHours.length === 0 && (
          <p className="text-xs text-slate-400">
            Chọn khoảng thời gian rồi nhấn &quot;Xem báo cáo&quot; để xem hiệu suất.
          </p>
        )}
      </div>
    </AdminLayout>
  );
}