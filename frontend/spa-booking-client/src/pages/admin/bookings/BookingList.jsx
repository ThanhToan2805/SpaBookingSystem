import { useEffect, useMemo, useState } from "react";
import { bookingApi } from "../../../api/bookingApi";
import { userApi } from "../../../api/userApi";
import { staffApi } from "../../../api/staffApi";
import { serviceApi } from "../../../api/serviceApi";
import AdminLayout from "../layout/AdminLayout";
import { Link } from "react-router-dom";

const STATUS_OPTIONS = [
  "Pending",
  "Confirmed",
  "Cancelled",
  "Completed",
  "NoShow",
];

function formatDateTime(d) {
  if (!d) return "—";
  return new Date(d).toLocaleString("vi-VN");
}

export default function BookingList() {
  const [viewMode, setViewMode] = useState("all"); // all | user | date | calendar

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);

  const [users, setUsers] = useState([]);
  const [staffs, setStaffs] = useState([]);
  const [services, setServices] = useState([]);

  // filters common
  const [statusFilter, setStatusFilter] = useState("all");

  // user mode
  const [selectedUserId, setSelectedUserId] = useState("");
  const [userFrom, setUserFrom] = useState("");
  const [userTo, setUserTo] = useState("");

  // date mode
  const [date, setDate] = useState("");
  const [dateStaffId, setDateStaffId] = useState("");
  const [dateServiceId, setDateServiceId] = useState("");

  // calendar mode
  const [calendarFrom, setCalendarFrom] = useState("");
  const [calendarTo, setCalendarTo] = useState("");
  const [calendarStaffId, setCalendarStaffId] = useState("");
  const [calendarServiceId, setCalendarServiceId] = useState("");

  // pagination (client-side)
  const [page, setPage] = useState(1);
  const pageSize = 5;

  // load static stuffs
  useEffect(() => {
    const loadMeta = async () => {
      try {
        const [userRes, staffRes, serviceRes] = await Promise.all([
          userApi.getAll(),
          staffApi.getAll(),
          serviceApi.getAll(),
        ]);
        setUsers(userRes || []);
        setStaffs(staffRes || []);
        setServices(serviceRes || []);
      } catch (err) {
        console.error("Failed to load metadata:", err);
      }
    };
    loadMeta();
  }, []);

  // load data per viewMode
  const load = async () => {
    try {
      setLoading(true);
      let res = [];

      if (viewMode === "all") {
        res = await bookingApi.getAll();
      } else if (viewMode === "user") {
        if (!selectedUserId) {
          setBookings([]);
          return;
        }
        const params = {};
        if (userFrom) params.from = new Date(userFrom).toISOString();
        if (userTo) params.to = new Date(userTo).toISOString();
        if (statusFilter !== "all") params.status = statusFilter;

        res = await bookingApi.getByUser(selectedUserId, params);
      } else if (viewMode === "date") {
        if (!date) {
          setBookings([]);
          return;
        }
        const params = {
          date: new Date(date).toISOString(),
        };
        if (dateStaffId) params.staffId = dateStaffId;
        if (dateServiceId) params.serviceId = dateServiceId;
        if (statusFilter !== "all") params.status = statusFilter;

        res = await bookingApi.getByDate(params);
      } else if (viewMode === "calendar") {
        if (!calendarFrom || !calendarTo) {
          setBookings([]);
          return;
        }
        const params = {
          startDate: new Date(calendarFrom).toISOString(),
          endDate: new Date(calendarTo).toISOString(),
        };
        if (calendarStaffId) params.staffId = calendarStaffId;
        if (calendarServiceId) params.serviceId = calendarServiceId;

        res = await bookingApi.getCalendarView(params);
      }

      // sort mới nhất lên trước
      const sorted = [...(res || [])].sort(
        (a, b) => new Date(b.startAt) - new Date(a.startAt)
      );
      setBookings(sorted);
      setPage(1);
    } catch (err) {
      console.error("Failed to load bookings:", err);
    } finally {
      setLoading(false);
    }
  };

  // auto load khi đổi view mode
  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewMode]);

  // Helper map
  const userMap = useMemo(
    () =>
      users.reduce((acc, u) => {
        acc[u.id] = u;
        return acc;
      }, {}),
    [users]
  );

  const staffMap = useMemo(
    () =>
      staffs.reduce((acc, s) => {
        acc[s.id] = s;
        return acc;
      }, {}),
    [staffs]
  );

  const serviceMap = useMemo(
    () =>
      services.reduce((acc, s) => {
        acc[s.id] = s;
        return acc;
      }, {}),
    [services]
  );

  const filtered = useMemo(() => {
    let data = [...bookings];

    if (statusFilter !== "all") {
      data = data.filter((b) => b.status === statusFilter);
    }

    return data;
  }, [bookings, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const paginated = filtered.slice(
    (safePage - 1) * pageSize,
    safePage * pageSize
  );

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const handleNoShow = async (id) => {
    const note = window.prompt("Ghi chú NoShow (có thể bỏ trống):", "");
    try {
      await bookingApi.setNoShow(id, note || null);
      load();
    } catch (err) {
      console.error("Set NoShow failed:", err);
      alert("Không đặt NoShow được, thử lại sau.");
    }
  };

  const statusBadge = (status) => {
    const base =
      "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border";
    switch (status) {
      case "Pending":
        return (
          <span
            className={
              base +
              " bg-amber-50 text-amber-700 border-amber-100"
            }
          >
            ● Pending
          </span>
        );
      case "Confirmed":
        return (
          <span
            className={
              base +
              " bg-blue-50 text-blue-700 border-blue-100"
            }
          >
            ● Confirmed
          </span>
        );
      case "Completed":
        return (
          <span
            className={
              base +
              " bg-emerald-50 text-emerald-700 border-emerald-100"
            }
          >
            ● Completed
          </span>
        );
      case "Cancelled":
        return (
          <span
            className={
              base +
              " bg-rose-50 text-rose-700 border-rose-100"
            }
          >
            ● Cancelled
          </span>
        );
      case "NoShow":
        return (
          <span
            className={
              base +
              " bg-slate-50 text-slate-600 border-slate-200"
            }
          >
            ● NoShow
          </span>
        );
      default:
        return (
          <span
            className={
              base +
              " bg-slate-50 text-slate-600 border-slate-200"
            }
          >
            ● {status || "Unknown"}
          </span>
        );
    }
  };

  const handleResetFilters = () => {
    setStatusFilter("all");
    setPage(1);

    if (viewMode === "user") {
      setSelectedUserId("");
      setUserFrom("");
      setUserTo("");
    } else if (viewMode === "date") {
      setDate("");
      setDateStaffId("");
      setDateServiceId("");
    } else if (viewMode === "calendar") {
      setCalendarFrom("");
      setCalendarTo("");
      setCalendarStaffId("");
      setCalendarServiceId("");
    }

    setBookings([]);
  };

  return (
    <AdminLayout title="Quản lý Booking">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">
            Booking
          </h2>
          <p className="text-sm text-slate-500">
            Xem và quản lý lịch đặt của khách, trạng thái và luồng phục vụ.
            Booking được tạo từ phía khách hàng, admin chỉ theo dõi và xử lý.
          </p>
        </div>
      </div>

      {/* View mode toggle */}
      <div className="mb-4 flex flex-wrap gap-2">
        {[
          { id: "all", label: "Tất cả" },
          { id: "user", label: "Theo khách hàng" },
          { id: "date", label: "Theo ngày" },
          { id: "calendar", label: "Calendar view" },
        ].map((m) => (
          <button
            key={m.id}
            onClick={() => setViewMode(m.id)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border ${
              viewMode === m.id
                ? "bg-purple-600 text-white border-purple-600"
                : "bg-white text-slate-600 hover:bg-slate-50"
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>

      {/* Filters per mode */}
      <div className="mb-4 bg-white rounded-2xl border border-slate-100 p-4 flex flex-col md:flex-row md:items-end gap-4">
        {/* Status filter (common for một số mode) */}
        <div className="w-full md:w-48">
          <label className="block text-xs font-medium text-slate-600 mb-1">
            Trạng thái
          </label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-purple-500 outline-none"
          >
            <option value="all">Tất cả</option>
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        {viewMode === "user" && (
          <>
            <div className="flex-1 min-w-[180px]">
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Khách hàng
              </label>
              <select
                value={selectedUserId}
                onChange={(e) => setSelectedUserId(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-purple-500 outline-none"
              >
                <option value="">-- Chọn user --</option>
                {users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.username} ({u.roleName})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Từ ngày
              </label>
              <input
                type="date"
                value={userFrom}
                onChange={(e) => setUserFrom(e.target.value)}
                className="px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-purple-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Đến ngày
              </label>
              <input
                type="date"
                value={userTo}
                onChange={(e) => setUserTo(e.target.value)}
                className="px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-purple-500 outline-none"
              />
            </div>
            <div>
              <button
                onClick={load}
                className="px-4 py-2 mt-5 text-sm font-semibold rounded-lg bg-slate-900 text-white hover:bg-slate-800"
              >
                Áp dụng
              </button>
            </div>
          </>
        )}

        {viewMode === "date" && (
          <>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Ngày
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-purple-500 outline-none"
              />
            </div>
            <div className="flex-1 min-w-[180px]">
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Staff
              </label>
              <select
                value={dateStaffId}
                onChange={(e) => setDateStaffId(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-purple-500 outline-none"
              >
                <option value="">Tất cả</option>
                {staffs.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.userName} ({s.position})
                  </option>
                ))}
              </select>
            </div>
            <div className="flex-1 min-w-[180px]">
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Service
              </label>
              <select
                value={dateServiceId}
                onChange={(e) => setDateServiceId(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-purple-500 outline-none"
              >
                <option value="">Tất cả</option>
                {services.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <button
                onClick={load}
                className="px-4 py-2 mt-5 text-sm font-semibold rounded-lg bg-slate-900 text-white hover:bg-slate-800"
              >
                Áp dụng
              </button>
            </div>
          </>
        )}

        {viewMode === "calendar" && (
          <>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Từ ngày
              </label>
              <input
                type="date"
                value={calendarFrom}
                onChange={(e) => setCalendarFrom(e.target.value)}
                className="px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-purple-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Đến ngày
              </label>
              <input
                type="date"
                value={calendarTo}
                onChange={(e) => setCalendarTo(e.target.value)}
                className="px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-purple-500 outline-none"
              />
            </div>
            <div className="flex-1 min-w-[180px]">
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Staff
              </label>
              <select
                value={calendarStaffId}
                onChange={(e) => setCalendarStaffId(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-purple-500 outline-none"
              >
                <option value="">Tất cả</option>
                {staffs.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.userName} ({s.position})
                  </option>
                ))}
              </select>
            </div>
            <div className="flex-1 min-w-[180px]">
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Service
              </label>
              <select
                value={calendarServiceId}
                onChange={(e) => setCalendarServiceId(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-purple-500 outline-none"
              >
                <option value="">Tất cả</option>
                {services.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <button
                onClick={load}
                className="px-4 py-2 mt-5 text-sm font-semibold rounded-lg bg-slate-900 text-white hover:bg-slate-800"
              >
                Áp dụng
              </button>
            </div>
          </>
        )}

        {viewMode !== "all" && (
          <div className="md:ml-auto">
            <button
              onClick={handleResetFilters}
              className="px-4 py-2 mt-1 md:mt-5 text-sm font-medium rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-50"
            >
              Reset bộ lọc
            </button>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 text-center text-xs uppercase tracking-wide text-slate-500">
              <th className="p-3 w-40">Khách hàng</th>
              <th className="p-3 w-40">Dịch vụ</th>
              <th className="p-3 w-40">Nhân viên</th>
              <th className="p-3 w-32">Trạng thái</th>
              <th className="p-3 w-40">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={5}
                  className="p-4 text-center text-slate-500"
                >
                  Đang tải...
                </td>
              </tr>
            ) : paginated.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="p-4 text-center text-slate-400 text-sm"
                >
                  Không có booking nào phù hợp.
                </td>
              </tr>
            ) : (
              paginated.map((b) => {
                const customer = userMap[b.customerId];
                const staff = b.staffId ? staffMap[b.staffId] : null;
                const service = serviceMap[b.serviceId];
                return (
                  <tr
                    key={b.id}
                    className="border-t border-slate-100 hover:bg-purple-50/40 transition"
                  >
                    <td className="p-3 align-top">
                      <div className="font-semibold text-slate-900">
                        {customer?.username || b.customerId}
                      </div>
                      {customer && (
                        <div className="text-xs text-slate-500">
                          {customer.email}
                        </div>
                      )}
                    </td>
                    <td className="p-3 align-top">
                      <div className="font-semibold text-slate-900">
                        {service?.name || b.serviceId}
                      </div>
                    </td>
                    <td className="p-3 align-top">
                      {staff ? (
                        <>
                          <div className="font-medium text-slate-900">
                            {staff.userName}
                          </div>
                          {staff.position && (
                            <div className="text-xs text-slate-500">
                              {staff.position}
                            </div>
                          )}
                        </>
                      ) : (
                        <span className="text-xs text-slate-400">
                          Chưa gán staff
                        </span>
                      )}
                    </td>
                    <td className="p-3 align-top text-center">
                      {statusBadge(b.status)}
                    </td>
                    <td className="p-3 align-top">
                      <div className="flex flex-wrap gap-2 justify-center">
                        <Link
                          to={`/admin/bookings/${b.id}`}
                          className="px-3 py-1.5 bg-amber-400 text-slate-900 rounded-lg text-xs font-medium hover:bg-amber-500 transition"
                        >
                          Xem
                        </Link>
                        <button
                          onClick={() => handleNoShow(b.id)}
                          className="px-3 py-1.5 bg-slate-700 text-white rounded-lg text-xs font-medium hover:bg-slate-800 transition"
                        >
                          NoShow
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
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