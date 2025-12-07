import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AdminLayout from "../layout/AdminLayout";
import { staffApi } from "../../../api/staffApi";

export default function StaffSchedule() {
  const { id: staffId } = useParams();
  const [date, setDate] = useState(() =>
    new Date().toISOString().slice(0, 10)
  );
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    if (!staffId) return;
    setLoading(true);
    try {
      const res = await staffApi.getSchedule(staffId, date);
      setSlots(res || []);
    } catch (err) {
      console.error("Failed to load schedule:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [staffId, date]);

  const staffName =
    slots.length > 0 ? slots[0].staffName : "Nhân viên";

  return (
    <AdminLayout title="Lịch làm việc nhân viên">
      <div className="max-w-4xl space-y-4">
        {/* Filter */}
        <div className="flex flex-col md:flex-row md:items-end gap-3">
          <div className="flex-1">
            <p className="text-sm font-semibold text-slate-900">
              {staffName}
            </p>
            <p className="text-xs text-slate-400">
              Staff ID: <span className="font-mono text-[11px]">{staffId}</span>
            </p>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">
              Ngày
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          {loading ? (
            <div className="p-6 text-center text-slate-500 text-sm">
              Đang tải lịch làm việc...
            </div>
          ) : slots.length === 0 ? (
            <div className="p-6 text-center text-slate-400 text-sm">
              Không có slot nào trong ngày này.
            </div>
          ) : (
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                  <th className="p-3 border-b border-slate-100 text-left">
                    Thời gian
                  </th>
                  <th className="p-3 border-b border-slate-100 text-left">
                    Trạng thái
                  </th>
                </tr>
              </thead>
              <tbody>
                {slots.map((slot, idx) => {
                  const start = new Date(slot.startTime);
                  const end = new Date(slot.endTime);
                  return (
                    <tr
                      key={idx}
                      className="hover:bg-slate-50 border-b border-slate-50"
                    >
                      <td className="p-3">
                        {start.toLocaleTimeString("vi-VN", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}{" "}
                        -{" "}
                        {end.toLocaleTimeString("vi-VN", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                      <td className="p-3">
                        {slot.isBooked ? (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-rose-50 text-rose-700 border border-rose-100">
                            ● Đã được booking
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">
                            ● Trống
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}