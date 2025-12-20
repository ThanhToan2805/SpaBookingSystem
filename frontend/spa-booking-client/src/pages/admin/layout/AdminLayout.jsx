import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";

export default function AdminLayout({ children, title }) {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const navItemBase =
    "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition";
  const navItemActive = "bg-purple-100 text-purple-700";
  const navItemInactive =
    "text-slate-600 hover:bg-slate-100 hover:text-slate-900";

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-100 shadow-sm flex flex-col">
        <div className="px-6 py-5 border-b border-slate-100">
          <Link to="" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-linear-to-br from-purple-500 to-indigo-500 flex items-center justify-center text-white font-bold">
              L
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-900">
                LumiSpa Admin
              </h1>
              <p className="text-xs text-slate-400">
                Quản trị hệ thống đặt lịch
              </p>
            </div>
          </Link>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1 text-sm">
          <NavLink
            to="/admin"
            end
            className={({ isActive }) =>
              `${navItemBase} ${
                isActive ? navItemActive : navItemInactive
              }`
            }
          >
            <span>📊</span>
            <span>Dashboard</span>
          </NavLink>

          <NavLink
            to="/admin/categories"
            className={({ isActive }) =>
              `${navItemBase} ${
                isActive ? navItemActive : navItemInactive
              }`
            }
          >
            <span>📂</span>
            <span>Quản lý Category</span>
          </NavLink>

          <NavLink
            to="/admin/services"
            className={({ isActive }) =>
              `${navItemBase} ${
                isActive ? navItemActive : navItemInactive
              }`
            }
          >
            <span>🛁</span>
            <span>Quản lý Service</span>
          </NavLink>

          <NavLink
            to="/admin/users"
            className={({ isActive }) =>
              `${navItemBase} ${
                isActive ? navItemActive : navItemInactive
              }`
            }
          >
            <span>👤</span>
            <span>Quản lý User</span>
          </NavLink>

          <NavLink
            to="/admin/staffs"
            className={({ isActive }) =>
              `${navItemBase} ${
                isActive ? navItemActive : navItemInactive
              }`
            }
          >
            <span>🧑‍💼</span>
            <span>Quản lý Staff</span>
          </NavLink>

          <NavLink
            to="/admin/promotions"
            className={({ isActive }) =>
              `${navItemBase} ${isActive ? navItemActive : navItemInactive}`
            }
          >
            <span className="text-lg">🎟️</span>
            <span>Quản lý Promotion</span>
          </NavLink>

          <NavLink
            to="/admin/bookings"
            className={({ isActive }) =>
              `${navItemBase} ${isActive ? navItemActive : navItemInactive}`
            }
          >
            <span className="text-lg">📅</span>
            <span>Quản lý Booking</span>
          </NavLink>

          <NavLink
            to="/admin/payments"
            className={({ isActive }) =>
              `${navItemBase} ${isActive ? navItemActive : navItemInactive}`
            }
          >
            <span className="text-lg">💳</span>
            <span>Quản lý Payment</span>
          </NavLink>
        </nav>

        <div className="px-4 py-4 border-t border-slate-100">
          <div className="bg-slate-50 rounded-xl px-3 py-3 flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-linear-to-br from-purple-500 to-indigo-500 flex items-center justify-center text-white text-sm font-semibold">
              {(user?.username || "A").charAt(0).toUpperCase()}
            </div>
            <div className="flex-1">
              <div className="text-[11px] uppercase tracking-wide text-slate-400">
                Admin đang đăng nhập
              </div>
              <div className="text-sm font-semibold text-slate-900 leading-tight">
                {user?.username || "Admin"}
              </div>
              {user?.roleName && (
                <div className="text-[11px] text-slate-500">
                  Vai trò: {user.roleName}
                </div>
              )}
            </div>
          </div>

          <div className="mt-3 flex gap-2">
            <Link
              to="/admin/profile"
              className="flex-1 px-3 py-2 rounded-lg border border-slate-200 text-[11px] font-medium text-slate-700 hover:bg-slate-50 text-center"
            >
              Hồ sơ admin
            </Link>
            <button
              onClick={logout}
              className="px-3 py-2 bg-red-500 text-white rounded-lg text-[11px] font-medium hover:bg-red-600 transition"
            >
              Đăng xuất
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="h-16 px-8 flex items-center justify-between border-b border-slate-100 bg-white/80 backdrop-blur">
          {title ? (
            <>
              <div>
                <h1 className="text-xl font-semibold text-slate-900">
                  {title}
                </h1>
                <p className="text-xs text-slate-400 mt-0.5">
                  Khu vực quản trị LumiSpa
                </p>
              </div>
              <button
                onClick={() => navigate(-1)}
                className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-50 transition"
              >
                ← Quay lại
              </button>
            </>
          ) : (
            <div className="text-sm text-slate-500">
              LumiSpa Admin Console
            </div>
          )}
        </header>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto p-8">{children}</div>
      </main>
    </div>
  );
}