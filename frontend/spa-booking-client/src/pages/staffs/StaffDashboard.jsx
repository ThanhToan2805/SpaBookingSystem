import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { staffApi } from "../../api/staffApi";
import { serviceApi } from "../../api/serviceApi";
import { userApi } from "../../api/userApi";
import StaffLayout from "./layout/StaffLayout";
import {useBookingHub} from "../../hooks/useBookingHub";

function toDateInputValue(date) {
  return date.toISOString().slice(0, 10); // yyyy-MM-dd
}

function toDayRangeISO(dateStr) {
  return {
    from: `${dateStr}T00:00:00`,
    to: `${dateStr}T23:59:59`,
  };
}

export default function StaffDashboard() {
  const { user } = useAuth();
  const [staff, setStaff] = useState(null);
  const [loadingStaff, setLoadingStaff] = useState(true);

  const [isAvailable, setIsAvailable] = useState(null);
  const [toggling, setToggling] = useState(false);

  // Range để xem tổng quan (default: tuần hiện tại)
  const today = useMemo(() => new Date(), []);
  const [from, setFrom] = useState(() => {
    const d = new Date();
    // Lấy thứ 2 đầu tuần
    const day = d.getDay() || 7;
    if (day !== 1) d.setDate(d.getDate() - (day - 1));
    return toDateInputValue(d);
  });
  const [to, setTo] = useState(() => toDateInputValue(today));

  // Ngày xem chi tiết lịch + booking
  const [selectedDate, setSelectedDate] = useState(() =>
    toDateInputValue(today)
  );

  // Data overview
  const [overviewLoading, setOverviewLoading] = useState(false);
  const [overview, setOverview] = useState({
    totalBookings: 0,
    completed: 0,
    upcoming: 0,
    cancelled: 0,
    totalHours: 0,
    utilizationPercent: 0,
  });

  // Data booking trong 7 ngày tới
  const [todayLoading, setTodayLoading] = useState([]);
  const [todayBookings, setTodayBookings] = useState(false);
  const [upcomingBookings, setUpcomingBookings] = useState([]);
  const [upcomingLoading, setUpcomingLoading] = useState(false);

  // Meta data: services + users (để show tên dịch vụ + tên khách)
  const [services, setServices] = useState([]);
  const [users, setUsers] = useState([]);
  const [loadingMeta, setLoadingMeta] = useState(false);

  // Map user → staff (dùng user.UserId)
  useEffect(() => {
    if (!user) return;

    const loadStaff = async () => {
      try {
        setLoadingStaff(true);
        const staffs = await staffApi.getAll();
        const mine = (staffs || []).find(
          (s) => String(s.userId) === String(user.UserId)
        );
        setStaff(mine || null);
        setIsAvailable(mine?.isAvailable ?? null);
      } catch (err) {
        console.error("Failed to load staff list", err);
      } finally {
        setLoadingStaff(false);
      }
    };

    loadStaff();
  }, [user]);

  // Load services + users (để join tên)
  useEffect(() => {
    const loadMeta = async () => {
      try {
        setLoadingMeta(true);
        const [svcRes, userRes] = await Promise.all([
          serviceApi.getAll(),
          userApi.getAll(),
        ]);
        setServices(svcRes || []);
        setUsers(userRes || []);
      } catch (err) {
        console.error("Failed to load meta data (services/users)", err);
      } finally {
        setLoadingMeta(false);
      }
    };

    loadMeta();
  }, []);

  // Load overview (working-hours + utilization + bookings)
  const loadOverview = async () => {
    if (!staff || !from || !to) return;
    try {
      setOverviewLoading(true);

      const [wh, util, bookings] = await Promise.all([
        staffApi.getWorkingHours(staff.id, {
          from: `${from}T00:00:00`,
          to: `${to}T23:59:59`,
        }),
        staffApi.getUtilization(staff.id, {
          from: `${from}T00:00:00`,
          to: `${to}T23:59:59`,
        }),
        staffApi.getBookings(staff.id, {
          from: `${from}T00:00:00`,
          to: `${to}T23:59:59`,
        }),
      ]);

      const totalHours =
        (wh || []).reduce((sum, d) => sum + (d.totalHours || 0), 0) ?? 0;

      const totalBookings = (bookings || []).length;
      const completed = (bookings || []).filter(
        (b) => b.status === "Completed"
      ).length;
      const upcoming = (bookings || []).filter((b) =>
        ["Pending", "Confirmed"].includes(b.status)
      ).length;
      const cancelled = (bookings || []).filter((b) =>
        ["Cancelled", "NoShow"].includes(b.status)
      ).length;

      const utilPercent = util?.utilizationPercent ?? 0;

      setOverview({
        totalBookings,
        completed,
        upcoming,
        cancelled,
        totalHours,
        utilizationPercent: utilPercent,
      });
    } catch (err) {
      console.error("Failed to load overview", err);
      alert("Không tải được dữ liệu tổng quan staff.");
    } finally {
      setOverviewLoading(false);
    }
  };

  // Auto load overview khi staff + range sẵn sàng
  useEffect(() => {
    if (staff && from && to) {
      loadOverview();
    }
  }, [staff]);

  // Load schedule + bookings cho ngày selectedDate
  const loadTodayData = async () => {
    if (!staff || !selectedDate) return;
    try {
        setTodayLoading(true);

        const dayRange = toDayRangeISO(selectedDate);

        // Chỉ cần booking trong ngày
        const bookings = await staffApi.getBookings(staff.id, {
        from: dayRange.from,
        to: dayRange.to,
        });

        setTodayBookings(bookings || []);
    } catch (err) {
        console.error("Failed to load today data", err);
        alert("Không tải được booking trong ngày.");
    } finally {
        setTodayLoading(false);
    }
  };

  function getNext7DaysRange() {
  const now = new Date();
  const from = now.toISOString(); // bắt đầu từ bây giờ
  const toDate = new Date();
  toDate.setDate(toDate.getDate() + 7);
  const to = toDate.toISOString();
  return { from, to };
  }

  const loadUpcomingBookings = async () => {
    if (!staff) return;

    try {
        setUpcomingLoading(true);
        const { from, to } = getNext7DaysRange();

        const bookings = await staffApi.getBookings(staff.id, {
        from,
        to,
        });

        const todayStr = selectedDate; // yyyy-MM-dd

        const filtered = (bookings || [])
        // loại Cancelled + NoShow
        .filter(
            (b) =>
            b.status !== "Cancelled" &&
            b.status !== "NoShow"
        )
        // loại booking của hôm nay
        .filter((b) => {
            const dateStr = new Date(b.startAt).toISOString().slice(0, 10);
            return dateStr !== todayStr;
        });

        setUpcomingBookings(filtered);
    } catch (err) {
        console.error("Failed to load upcoming bookings", err);
    } finally {
        setUpcomingLoading(false);
    }
  };

  useEffect(() => {
    if (staff) {
      loadTodayData();
      loadUpcomingBookings();
    }
  }, [staff, selectedDate]);

  // Lắng nghe SignalR cho staff hiện tại
  useBookingHub(user?.UserId, {
    onCreated: (payload) => {
      // Nếu booking không phải của staff này thì thôi
      if (payload.staffId && payload.staffId !== staff?.id) return;

      console.log("Lịch của bạn vừa được tạo mới:", payload);

      // Reload lại lịch + overview
      loadTodayData();
      loadOverview();
    },
    onUpdated: (payload) => {
      if (payload.staffId && payload.staffId !== staff?.id) return;

      console.log("Lịch của bạn vừa được cập nhật:", payload);

      loadTodayData();
      loadOverview();
    },
    onCancelled: (payload) => {
      if (payload.staffId && payload.staffId !== staff?.id) return;

      console.log("Lịch của bạn vừa bị hủy:", payload);

      loadTodayData();
      loadOverview();
    },
    onRescheduled: (payload) => {
      if (payload.staffId && payload.staffId !== staff?.id) return;

      console.log("Lịch của bạn vừa được thay đổi:", payload);

      loadTodayData();
      loadOverview();
    },
  });

  // 4. Toggle availability
  const handleToggleAvailability = async () => {
    if (!staff) return;
    try {
      setToggling(true);
      const updated = await staffApi.toggleAvailability(staff.id);
      // Backend trả về StaffDto mới
      setIsAvailable(updated?.isAvailable ?? null);
    } catch (err) {
      console.error("Failed to toggle availability", err);
      alert("Không đổi được trạng thái nhận khách.");
    } finally {
      setToggling(false);
    }
  };

  // Helper lấy tên dịch vụ & tên khách
  const getServiceName = (serviceId) => {
    const svc = services.find((s) => s.id === serviceId);
    return svc?.name || "Dịch vụ";
  };

  const getCustomerName = (customerId) => {
    const u = users.find((x) => x.id === customerId);
    if (!u) return "Khách";
    return u.username || "Khách";
  };

  if (!user) {
    return (
      <StaffLayout title="Staff Dashboard">
        <div className="py-16 text-center">
          <p className="text-gray-600">
            Bạn cần đăng nhập để xem Staff Dashboard.
          </p>
        </div>
      </StaffLayout>
    );
  }

  if (loadingStaff) {
    return (
      <StaffLayout title="Staff Dashboard">
        <div className="py-16 text-center text-gray-500">Đang tải...</div>
      </StaffLayout>
    );
  }

  if (!staff) {
    return (
      <StaffLayout title="Staff Dashboard">
        <div className="py-16 max-w-xl mx-auto text-center space-y-3">
          <h2 className="text-2xl font-semibold text-gray-900">
            Không tìm thấy hồ sơ Staff
          </h2>
          <p className="text-gray-500 text-sm">
            Tài khoản của bạn chưa được gán với bất kỳ nhân viên nào trong hệ
            thống. Hãy liên hệ Admin để tạo Staff tương ứng với User hiện tại.
          </p>
        </div>
      </StaffLayout>
    );
  }

  const utilSafe = Math.min(
    100,
    Math.max(0, overview.utilizationPercent || 0)
  );

  return (
    <StaffLayout title="Staff Dashboard">
      <div className="py-6 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
              Staff Dashboard
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Xin chào{" "}
              <span className="font-medium text-purple-600">
                {staff.userName || "Staff"}
              </span>
              , đây là tổng quan lịch làm việc và booking của bạn.
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Vị trí: {staff.position || "Chuyên viên spa"}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                isAvailable
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {isAvailable ? "Đang nhận khách" : "Tạm ngưng nhận khách"}
            </span>
            <button
              onClick={handleToggleAvailability}
              disabled={toggling}
              className="px-4 py-2 rounded-lg text-sm font-medium bg-purple-600 text-white hover:bg-purple-700 disabled:opacity-60"
            >
              {toggling ? "Đang cập nhật..." : "Bật/Tắt nhận khách"}
            </button>
          </div>
        </div>

        {/* Overview cards + filter range */}
        <section className="bg-white shadow-sm rounded-2xl p-5 md:p-6 border border-slate-100 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <h2 className="text-lg font-semibold text-slate-900">
              Tổng quan hiệu suất
            </h2>
            <div className="flex flex-wrap items-center gap-2 text-xs md:text-sm">
              <span className="text-slate-500">Khoảng thời gian:</span>
              <input
                type="date"
                className="border rounded-lg px-2 py-1 text-xs"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
              />
              <span className="text-slate-400">→</span>
              <input
                type="date"
                className="border rounded-lg px-2 py-1 text-xs"
                value={to}
                onChange={(e) => setTo(e.target.value)}
              />
              <button
                onClick={loadOverview}
                className="ml-1 px-3 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-medium hover:bg-slate-800"
                disabled={overviewLoading}
              >
                {overviewLoading ? "Đang tải..." : "Xem báo cáo"}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            <div className="bg-slate-50 rounded-xl p-3 md:p-4">
              <p className="text-xs text-slate-500">Tổng booking</p>
              <p className="text-xl md:text-2xl font-semibold text-slate-900">
                {overview.totalBookings}
              </p>
            </div>
            <div className="bg-green-50 rounded-xl p-3 md:p-4">
              <p className="text-xs text-slate-500">Hoàn thành</p>
              <p className="text-xl md:text-2xl font-semibold text-green-700">
                {overview.completed}
              </p>
            </div>
            <div className="bg-yellow-50 rounded-xl p-3 md:p-4">
              <p className="text-xs text-slate-500">Đang chờ / sắp tới</p>
              <p className="text-xl md:text-2xl font-semibold text-yellow-700">
                {overview.upcoming}
              </p>
            </div>
            <div className="bg-red-50 rounded-xl p-3 md:p-4">
              <p className="text-xs text-slate-500">Hủy / Không đến</p>
              <p className="text-xl md:text-2xl font-semibold text-red-700">
                {overview.cancelled}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="bg-slate-50 rounded-xl p-4 flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500">Tổng giờ làm</p>
                <p className="text-2xl font-semibold text-slate-900">
                  {overview.totalHours.toFixed(1)} giờ
                </p>
              </div>
            </div>
            <div className="bg-slate-50 rounded-xl p-4">
              <p className="text-xs text-slate-500 mb-2">% sử dụng slot</p>
              <div className="flex items-center gap-3">
                <div className="flex-1 h-2 rounded-full bg-slate-200 overflow-hidden">
                  <div
                    className="h-full bg-purple-500"
                    style={{ width: `${utilSafe}%` }}
                  />
                </div>
                <span className="text-sm font-semibold text-slate-900 w-16 text-right">
                  {utilSafe.toFixed(0)}%
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Lịch & Booking trong ngày */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Lịch hẹn trong ngày (timeline) */}
          <div className="bg-white shadow-sm rounded-2xl p-5 border border-slate-100">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-slate-900">
                    Lịch hẹn trong ngày
                </h2>
                <input
                    type="date"
                    className="border rounded-lg px-2 py-1 text-xs"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                />
            </div>

            {todayLoading && (
                <p className="text-sm text-slate-500">Đang tải lịch ngày...</p>
            )}

            {!todayLoading && todayBookings.length === 0 && (
                <p className="text-sm text-slate-400">
                    Chưa có booking nào trong ngày được chọn.
                </p>
            )}

            {!todayLoading && todayBookings.length > 0 && (
                <ul className="space-y-2 max-h-80 overflow-y-auto pr-1">
                    {todayBookings
                        .slice()
                        .sort(
                        (a, b) => new Date(a.startAt).getTime() - new Date(b.startAt).getTime()
                        )
                        .map((b) => (
                        <li
                            key={b.id}
                            className="flex items-center justify-between bg-slate-50 rounded-xl px-3 py-2"
                        >
                            <div className="text-xs">
                                <p className="font-medium text-slate-900 text-left">
                                    {new Date(b.startAt).toLocaleTimeString("vi-VN", {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    })}{" "}
                                    -{" "}
                                    {new Date(b.endAt).toLocaleTimeString("vi-VN", {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    })}
                                </p>
                                <p className="text-[11px] text-slate-500 mt-0.5">
                                    {getServiceName(b.serviceId)} · {getCustomerName(b.customerId)}
                                </p>
                            </div>
                            <span className="px-2 py-1 rounded-full text-[11px] font-semibold bg-purple-100 text-purple-700">
                                {b.status}
                            </span>
                        </li>
                    ))}
                </ul>
            )}
          </div>

          {/* Booking sắp tới (7 ngày tới) */}
          <div className="bg-white shadow-sm rounded-2xl p-5 border border-slate-100">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h2 className="text-lg font-semibold text-slate-900">
                        Booking sắp tới (7 ngày)
                    </h2>
                    <p className="text-[11px] text-slate-400">
                        Bao gồm các lịch hẹn từ sau hôm nay đến 7 ngày tiếp theo.
                    </p>
                </div>
                <span className="text-xs text-slate-400">
                    Tổng: {upcomingBookings.length}
                </span>
            </div>

            {upcomingLoading && (
                <p className="text-sm text-slate-500">Đang tải booking sắp tới...</p>
            )}

            {!upcomingLoading && upcomingBookings.length === 0 && (
                <p className="text-sm text-slate-400">
                    Chưa có booking nào trong 7 ngày tới.
                </p>
            )}

            {!upcomingLoading && upcomingBookings.length > 0 && (
                <div className="border border-slate-100 rounded-xl overflow-hidden">
                    <table className="min-w-full text-xs">
                        <thead className="bg-slate-50 text-slate-500">
                        <tr>
                            <th className="px-3 py-2 text-center font-medium">Ngày</th>
                            <th className="px-3 py-2 text-center font-medium">Giờ</th>
                            <th className="px-3 py-2 text-center font-medium">Khách</th>
                            <th className="px-3 py-2 text-center font-medium">Dịch vụ</th>
                            <th className="px-3 py-2 text-center font-medium">Trạng thái</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                        {upcomingBookings
                            .slice()
                            .sort(
                            (a, b) =>
                                new Date(a.startAt).getTime() - new Date(b.startAt).getTime()
                            )
                            .map((b) => (
                            <tr key={b.id} className="hover:bg-slate-50">
                                <td className="px-3 py-2 whitespace-nowrap text-center">
                                    {new Date(b.startAt).toLocaleDateString("vi-VN")}
                                </td>
                                <td className="px-3 py-2 whitespace-nowrap text-center">
                                    {new Date(b.startAt).toLocaleTimeString("vi-VN", {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    })}
                                </td>
                                <td className="px-3 py-2 text-center">
                                    <span className="text-[11px] text-slate-800">
                                        {getCustomerName(b.customerId)}
                                    </span>
                                </td>
                                <td className="px-3 py-2 text-center">
                                    <span className="text-[11px] text-slate-600">
                                        {getServiceName(b.serviceId)}
                                    </span>
                                </td>
                                <td className="px-3 py-2 text-center">
                                    <span className="inline-flex px-2 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-700">
                                        {b.status}
                                    </span>
                                </td>
                            </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
          </div>
        </section>
      </div>
    </StaffLayout>
  );
}