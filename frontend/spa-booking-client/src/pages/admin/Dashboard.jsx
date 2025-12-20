import { useEffect, useMemo, useState, useRef } from "react";
import AdminLayout from "./layout/AdminLayout";

import { bookingApi } from "../../api/bookingApi";
import { paymentApi } from "../../api/paymentApi";
import { userApi } from "../../api/userApi";
import { serviceApi } from "../../api/serviceApi";
import { staffApi } from "../../api/staffApi";

function formatMoney(v) {
  if (!v) return "0 ₫";
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(v);
}

function startOfDay(d) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}
function endOfDay(d) {
  const x = new Date(d);
  x.setHours(23, 59, 59, 999);
  return x;
}
function isInRange(date, from, to) {
  const t = new Date(date).getTime();
  return t >= from.getTime() && t <= to.getTime();
}
function daysAgo(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d;
}
function clamp(n, a, b) {
  return Math.max(a, Math.min(b, n));
}

function toDateKey(d) {
  // key theo local date để tránh lệch TZ
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  const y = x.getFullYear();
  const m = String(x.getMonth() + 1).padStart(2, "0");
  const day = String(x.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`; // YYYY-MM-DD
}

function startOfWeek(d) {
  // week bắt đầu từ Thứ 2 (chuẩn VN)
  const x = startOfDay(d);
  const dow = (x.getDay() + 6) % 7; // Mon=0 ... Sun=6
  x.setDate(x.getDate() - dow);
  return x;
}

function startOfMonth(d) {
  const x = startOfDay(d);
  x.setDate(1);
  return x;
}

function addDays(d, n) {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
}

function addMonths(d, n) {
  const x = new Date(d);
  x.setMonth(x.getMonth() + n);
  return x;
}

function formatBucketLabel(date, granularity) {
  const d = new Date(date);
  if (granularity === "month") {
    return d.toLocaleDateString("vi-VN", { month: "2-digit", year: "2-digit" }); // mm/yy
  }
  if (granularity === "week") {
    // hiển thị ngày đầu tuần
    return d.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit" });
  }
  return d.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit" });
}

function chooseGranularity(rangeDays) {
  // Có thể chỉnh ngưỡng theo ý
  if (rangeDays <= 14) return "day";
  if (rangeDays <= 90) return "week";
  return "month"; // 365d -> month
}

function Badge({ children }) {
  return (
    <span className="text-[11px] px-2 py-1 rounded-full bg-slate-50 text-slate-600 border border-slate-200">
      {children}
    </span>
  );
}

function StatCard({ title, value, sub}) {
  return (
    <div className="p-5 bg-white rounded-2xl border border-slate-100 shadow-sm">
      <div className="flex items-center justify-center gap-3">
        <div className="min-w-0">
          <div className="text-xs font-semibold text-slate-500">{title}</div>
          <div className="mt-1 text-2xl font-extrabold text-slate-900">{value}</div>
          {sub ? <div className="mt-1 text-sm text-slate-500">{sub}</div> : null}
        </div>
      </div>
    </div>
  );
}

function MiniBarChart({
  title,
  subtitle,
  values = [],
  labels = [],
  height = 220,
  valueFormatter = (v) => String(v),
  barClassName = "bg-gradient-to-t from-indigo-600 to-sky-400",
  showValues = true,
  minBarWidth = 26,
  maxLabels = 12,
}) {
  const max = Math.max(...values, 1);
  const min = Math.min(...values, 0);

  const skip = Math.max(1, Math.ceil(values.length / maxLabels));
  const scrollerRef = useRef(null);

  // Reset scroll về trái mỗi khi data thay đổi (đổi 7d/30d/365d sẽ không “dồn qua phải”)
  useEffect(() => {
    if (scrollerRef.current) scrollerRef.current.scrollLeft = 0;
  }, [values.length, labels.join("|")]);

  // Nếu ít cột, cho “stretch” full width (đẹp hơn), không cần fixed width
  const isFewBars = values.length <= 16;

  return (
    <div className="w-full">
      {(title || subtitle) && (
        <div className="mb-3 flex items-end justify-between gap-3">
          <div className="min-w-0">
            {title && <div className="font-extrabold text-slate-900 truncate">{title}</div>}
            {subtitle && <div className="text-sm text-slate-500 truncate">{subtitle}</div>}
          </div>
          <div className="text-[11px] text-slate-400 text-right">
            <div>
              Min: <b className="text-slate-600">{valueFormatter(min)}</b>
            </div>
            <div>
              Max: <b className="text-slate-600">{valueFormatter(max)}</b>
            </div>
          </div>
        </div>
      )}

      <div
        className="relative w-full rounded-2xl border border-slate-100 bg-white shadow-sm overflow-hidden"
        style={{ height }}
      >
        {/* grid */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="h-full w-full opacity-[0.06] bg-[linear-gradient(to_right,#000_1px,transparent_1px),linear-gradient(to_top,#000_1px,transparent_1px)] bg-size-[36px_36px]" />
        </div>

        {/* scroller */}
        <div ref={scrollerRef} className="relative h-full w-full overflow-x-auto">
          {/* 
            - min-w-full: nếu ít bar thì nó vẫn phủ hết chiều ngang (không bị “dồn qua phải”)
            - w-max: nếu nhiều bar thì rộng theo content để scroll
          */}
          <div className={`h-full px-4 pb-9 pt-4 flex items-end gap-2 min-w-full ${isFewBars ? "" : "w-max"}`}>
            {values.map((v, i) => {
              const percent = (v / max) * 100;
              const label = labels?.[i] ?? `#${i + 1}`;
              const showLabel = isFewBars ? true : (i % skip === 0 || i === values.length - 1);

              return (
                <div
                  key={i}
                  className={`h-full flex flex-col justify-end group ${isFewBars ? "flex-1" : ""}`}
                  style={isFewBars ? undefined : { width: minBarWidth }}
                >
                  {showValues && (
                    <div className="mb-1 text-[11px] text-slate-500 text-center opacity-0 group-hover:opacity-100 transition">
                      {valueFormatter(v)}
                    </div>
                  )}

                  <div className="h-full flex items-end">
                    <div
                      className={`w-full rounded-xl ${barClassName} shadow-sm transition-transform duration-200 group-hover:-translate-y-0.5`}
                      style={{ height: `${Math.max(6, percent)}%` }}
                      title={`${label}: ${valueFormatter(v)}`}
                    />
                  </div>

                  <div className="mt-2 text-[11px] text-slate-400 text-center">
                    {showLabel ? <span className="truncate block">{label}</span> : <span>&nbsp;</span>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="mt-2 text-[11px] text-slate-400">
        Tip: kéo ngang để xem thêm • rê chuột để xem số liệu.
      </div>
    </div>
  );
}

function SegmentedBar({ items }) {
  // items: [{label, value, className}]
  const total = items.reduce((s, x) => s + x.value, 0) || 1;
  return (
    <div className="w-full">
      <div className="h-3 w-full rounded-full overflow-hidden bg-slate-100 flex">
        {items.map((x) => (
          <div
            key={x.label}
            className={x.className}
            style={{ width: `${(x.value / total) * 100}%` }}
            title={`${x.label}: ${x.value}`}
          />
        ))}
      </div>
      <div className="mt-2 flex flex-wrap gap-2 text-[11px] text-slate-500">
        {items.map((x) => (
          <span key={x.label} className="inline-flex items-center gap-1">
            <span className={`inline-block w-2 h-2 rounded ${x.className}`} />
            {x.label}: <b className="text-slate-700">{x.value}</b>
          </span>
        ))}
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [loading, setLoading] = useState(true);

  const [bookings, setBookings] = useState([]);
  const [payments, setPayments] = useState([]);
  const [users, setUsers] = useState([]);
  const [services, setServices] = useState([]);
  const [staffs, setStaffs] = useState([]);

  // Bộ chọn thời gian
  const [rangePreset, setRangePreset] = useState("7d"); // "7d" | "30d" | "365d"
  const rangeDays = rangePreset === "7d" ? 7 : rangePreset === "30d" ? 30 : 365;

  const rangeTo = endOfDay(new Date());
  const rangeFrom = startOfDay(daysAgo(rangeDays - 1));

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);

        // Nếu API bạn trả về res.data thì đổi thành:
        // const b = (await bookingApi.getAll()).data;
        const [b, p, u, s, st] = await Promise.all([
          bookingApi.getAll(),
          paymentApi.getAll(),
          userApi.getAll(),
          serviceApi.getAll(),
          staffApi.getAll(),
        ]);

        if (!alive) return;
        setBookings(b || []);
        setPayments(p || []);
        setUsers(u || []);
        setServices(s || []);
        setStaffs(st || []);
      } catch (e) {
        console.error("Dashboard load error:", e);
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, []);

  const computed = useMemo(() => {
    const bInRange = bookings.filter((b) => b?.startAt && isInRange(b.startAt, rangeFrom, rangeTo));
    const pInRange = payments.filter((p) => p?.createdAt && isInRange(p.createdAt, rangeFrom, rangeTo));
    const uInRange = users.filter((u) => u?.createdAt && isInRange(u.createdAt, rangeFrom, rangeTo));

    // 1) KPI
    const revenue = pInRange.reduce((sum, x) => sum + (Number(x.amount) || 0), 0);
    const payRate = bInRange.length ? Math.round((pInRange.length / bInRange.length) * 100) : 0;

    const todayFrom = startOfDay(new Date());
    const todayTo = endOfDay(new Date());
    const bookingsToday = bookings.filter((x) => x?.startAt && isInRange(x.startAt, todayFrom, todayTo)).length;

    // 2) New vs Returning users (định nghĩa đơn giản):
    // New user: createdAt nằm trong range
    // Returning: user tồn tại trước rangeFrom (createdAt < rangeFrom)
    const newUsers = uInRange.length;
    const oldUsers = users.filter((u) => u?.createdAt && new Date(u.createdAt) < rangeFrom).length;

    // 3) Booking status distribution
    const statusCount = bInRange.reduce((acc, b) => {
      const k = b?.status ?? "Unknown";
      acc[k] = (acc[k] || 0) + 1;
      return acc;
    }, {});

    // 4) Payment method split
    const methodCount = pInRange.reduce((acc, p) => {
      const k = p?.paymentMethod ?? "Unknown";
      acc[k] = (acc[k] || 0) + 1;
      return acc;
    }, {});

    // 5) Top services theo số booking trong range
    const svcMap = new Map();
    for (const b of bInRange) {
      const sid = b?.serviceId;
      if (!sid) continue;
      svcMap.set(sid, (svcMap.get(sid) || 0) + 1);
    }
    const topServices = Array.from(svcMap.entries())
      .map(([sid, count]) => ({
        serviceId: sid,
        count,
        name: services.find((s) => s.id === sid)?.name || "Unknown",
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // 6) Series theo ngày: bookings & revenue
    const granularity = chooseGranularity(rangeDays);

    // aggregate 1 lần cho nhanh
    const bookingAgg = new Map(); // key -> count
    for (const b of bInRange) {
      if (!b?.startAt) continue;

      let bucketDate;
      const dt = new Date(b.startAt);

      if (granularity === "month") bucketDate = startOfMonth(dt);
      else if (granularity === "week") bucketDate = startOfWeek(dt);
      else bucketDate = startOfDay(dt);

      const key = toDateKey(bucketDate);
      bookingAgg.set(key, (bookingAgg.get(key) || 0) + 1);
    }

    const revenueAgg = new Map(); // key -> amount
    for (const p of pInRange) {
      if (!p?.createdAt) continue;

      let bucketDate;
      const dt = new Date(p.createdAt);

      if (granularity === "month") bucketDate = startOfMonth(dt);
      else if (granularity === "week") bucketDate = startOfWeek(dt);
      else bucketDate = startOfDay(dt);

      const key = toDateKey(bucketDate);
      revenueAgg.set(key, (revenueAgg.get(key) || 0) + (Number(p.amount) || 0));
    }

    // generate buckets theo khoảng thời gian
    const buckets = [];
    if (granularity === "month") {
      let cur = startOfMonth(rangeFrom);
      const end = startOfMonth(rangeTo);
      while (cur <= end) {
        buckets.push(new Date(cur));
        cur = addMonths(cur, 1);
      }
    } else if (granularity === "week") {
      let cur = startOfWeek(rangeFrom);
      const end = startOfWeek(rangeTo);
      while (cur <= end) {
        buckets.push(new Date(cur));
        cur = addDays(cur, 7);
      }
    } else {
      let cur = startOfDay(rangeFrom);
      const end = startOfDay(rangeTo);
      while (cur <= end) {
        buckets.push(new Date(cur));
        cur = addDays(cur, 1);
      }
    }

    const labels = buckets.map((d) => formatBucketLabel(d, granularity));
    const bookingsSeries = buckets.map((d) => bookingAgg.get(toDateKey(d)) || 0);

    // scale revenue cho “đẹp” tuỳ range
    const revenueUnit = granularity === "month" ? 1000000 : 1000; // month -> triệu, day/week -> nghìn
    const revenueSeries = buckets.map((d) =>
      Math.round((revenueAgg.get(toDateKey(d)) || 0) / revenueUnit)
    );

    // 7) Recent bookings (trong range)
    const recent = [...bInRange]
      .sort((a, b) => new Date(b?.createdAt || b?.startAt || 0) - new Date(a?.createdAt || a?.startAt || 0))
      .slice(0, 8);

    return {
      bInRange,
      pInRange,
      revenue,
      payRate,
      bookingsToday,
      newUsers,
      oldUsers,
      statusCount,
      methodCount,
      topServices,
      granularity,
      revenueUnit,
      bookingsSeries,
      revenueSeries,
      labels,
      recent,
    };
  }, [bookings, payments, users, services, rangeFrom, rangeTo, rangeDays]);

  const rangeLabel =
    rangePreset === "7d" ? "7 ngày" : rangePreset === "30d" ? "30 ngày" : "1 năm";

  return (
    <AdminLayout title="Dashboard">
      {/* Header + Range Picker */}
      <div className="mb-6 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Dashboard quản trị</h1>
          <p className="text-sm text-slate-500">
            Tổng quan hoạt động theo khoảng thời gian: <b className="text-slate-700">{rangeLabel}</b>
          </p>
          <div className="mt-2 text-[11px] text-slate-400">
            Từ {rangeFrom.toLocaleDateString("vi-VN")} đến {rangeTo.toLocaleDateString("vi-VN")}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Badge>Chọn khoảng thời gian</Badge>
          <div className="inline-flex rounded-xl border border-slate-200 bg-white p-1 shadow-sm">
            {[
              { key: "7d", label: "7 ngày" },
              { key: "30d", label: "1 tháng" },
              { key: "365d", label: "1 năm" },
            ].map((x) => (
              <button
                key={x.key}
                type="button"
                onClick={() => setRangePreset(x.key)}
                className={`px-3 py-2 text-sm font-semibold rounded-lg transition ${
                  rangePreset === x.key ? "bg-slate-900 text-white" : "text-slate-700 hover:bg-slate-50"
                }`}
              >
                {x.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* KPI */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        <StatCard
          title={`Bookings (${rangeLabel})`}
          value={loading ? "…" : computed.bInRange.length}
          sub={loading ? "" : `Hôm nay: ${computed.bookingsToday}`}
        />

        <StatCard
          title={`Doanh thu (${rangeLabel})`}
          value={loading ? "…" : formatMoney(computed.revenue)}
          sub="Tính theo payments trong khoảng thời gian"
        />

        <StatCard
          title="Người dùng mới vs cũ"
          value={loading ? "…" : `${computed.newUsers} / ${computed.oldUsers}`}
          sub="Mới (trong kỳ) / Cũ (trước kỳ)"
        />

        <StatCard
          title="Tài nguyên hệ thống"
          value={loading ? "…" : `${users.length} users`}
          sub={loading ? "" : `${services.length} dịch vụ • ${staffs.length} nhân viên`}
        />
      </div>

      {/* Charts */}
      <div className="space-y-6 mb-6">
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-extrabold text-slate-900">Bookings theo kỳ</h2>
              <p className="text-sm text-slate-500">
                {computed.granularity === "month"
                  ? "Theo tháng"
                  : computed.granularity === "week"
                  ? "Theo tuần"
                  : "Theo ngày"}{" "}
                (theo {rangeLabel})
              </p>
            </div>
            <Badge>Count</Badge>
          </div>

          {loading ? (
            <div className="text-slate-400">Đang tải…</div>
          ) : (
            <MiniBarChart
              values={computed.bookingsSeries}
              labels={computed.labels}
              height={260}
              valueFormatter={(v) => `${v} booking`}
              barClassName="bg-gradient-to-t from-purple-600 to-pink-400"
              showValues
              minBarWidth={28}
            />
          )}
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-extrabold text-slate-900">Doanh thu theo kỳ</h2>
              <p className="text-sm text-slate-500">
                {computed.granularity === "month" ? "Đơn vị: triệu (₫)" : "Đơn vị: nghìn (₫)"}
              </p>
            </div>
            <Badge>₫</Badge>
          </div>

          {loading ? (
            <div className="text-slate-400">Đang tải…</div>
          ) : (
            <MiniBarChart
              values={computed.revenueSeries}
              labels={computed.labels}
              height={260}
              valueFormatter={(v) =>
                computed.granularity === "month"
                  ? `${v.toLocaleString("vi-VN")}tr`
                  : `${v.toLocaleString("vi-VN")}k`
              }
              barClassName="bg-gradient-to-t from-emerald-600 to-lime-400"
              showValues
              minBarWidth={28}
            />
          )}
        </div>
      </div>

      {/* Distributions + Top services */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-extrabold text-slate-900">Booking theo trạng thái</h2>
            <Badge>Status</Badge>
          </div>

          {loading ? (
            <div className="text-slate-400">Đang tải…</div>
          ) : (
            <SegmentedBar
              items={[
                { label: "Pending", value: computed.statusCount.Pending || computed.statusCount["Chờ xác nhận"] || 0, className: "bg-amber-400" },
                { label: "Confirmed", value: computed.statusCount.Confirmed || computed.statusCount["Đã xác nhận"] || 0, className: "bg-blue-400" },
                { label: "Completed", value: computed.statusCount.Completed || computed.statusCount["Hoàn thành"] || 0, className: "bg-emerald-500" },
                { label: "Cancelled", value: computed.statusCount.Cancelled || computed.statusCount["Đã hủy"] || 0, className: "bg-rose-400" },
                { label: "Other", value: computed.statusCount.Unknown || 0, className: "bg-slate-300" },
              ]}
            />
          )}
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-extrabold text-slate-900">Thanh toán theo phương thức</h2>
            <Badge>Method</Badge>
          </div>

          {loading ? (
            <div className="text-slate-400">Đang tải…</div>
          ) : (
            <SegmentedBar
              items={[
                { label: "VNPay", value: computed.methodCount.VNPay || 0, className: "bg-indigo-500" },
                { label: "Cash", value: computed.methodCount.Cash || 0, className: "bg-emerald-500" },
                { label: "Other", value: computed.methodCount.Unknown || 0, className: "bg-slate-300" },
              ]}
            />
          )}
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-extrabold text-slate-900">Top dịch vụ</h2>
            <Badge>Top 5</Badge>
          </div>

          {loading ? (
            <div className="text-slate-400">Đang tải…</div>
          ) : computed.topServices.length === 0 ? (
            <div className="text-slate-400">Chưa có dữ liệu trong khoảng thời gian.</div>
          ) : (
            <div className="space-y-3">
              {computed.topServices.map((x) => (
                <div key={x.serviceId} className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-slate-900 truncate">{x.name}</div>
                    <div className="text-[11px] text-slate-400">serviceId: {String(x.serviceId).slice(0, 8)}…</div>
                  </div>
                  <div className="shrink-0 text-sm font-extrabold text-slate-900">{x.count}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recent bookings table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm">
        <div className="p-5 border-b border-slate-100">
          <h2 className="font-extrabold text-slate-900">Booking gần đây (trong kỳ)</h2>
          <p className="text-sm text-slate-500">Danh sách booking mới nhất trong khoảng thời gian bạn chọn</p>
        </div>

        <div className="p-5 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-slate-500">
              <tr className="border-b">
                <th className="text-center font-semibold py-2">Mã</th>
                <th className="text-center font-semibold py-2">Thời gian</th>
                <th className="text-center font-semibold py-2">Trạng thái</th>
                <th className="text-center font-semibold py-2">Dịch vụ</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td className="py-3 text-slate-400" colSpan={4}>
                    Đang tải dữ liệu…
                  </td>
                </tr>
              ) : computed.recent.length === 0 ? (
                <tr>
                  <td className="py-3 text-slate-400" colSpan={4}>
                    Chưa có booking nào trong khoảng thời gian.
                  </td>
                </tr>
              ) : (
                computed.recent.map((b) => (
                  <tr key={b.id} className="border-b last:border-b-0">
                    <td className="py-2 font-mono text-xs text-slate-700">{String(b.id).slice(0, 8)}…</td>
                    <td className="py-2 text-slate-700">
                      {b.startAt
                        ? new Date(b.startAt).toLocaleString("vi-VN", {
                            hour: "2-digit",
                            minute: "2-digit",
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                          })
                        : "—"}
                    </td>
                    <td className="py-2">
                      <span className="text-xs px-2 py-1 rounded-full bg-slate-50 text-slate-700 border border-slate-200">
                        {b.status ?? "Unknown"}
                      </span>
                    </td>
                    <td className="py-2 text-slate-700">
                      {services.find((s) => s.id === b.serviceId)?.name || "Unknown"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}