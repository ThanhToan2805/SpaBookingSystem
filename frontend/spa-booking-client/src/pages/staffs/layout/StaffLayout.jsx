import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";

export default function StaffLayout({ children, title }) {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const navItemBase =
    "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition";
  const navItemActive = "bg-purple-100 text-purple-700";
  const navItemInactive =
    "text-slate-600 hover:bg-slate-100 hover:text-slate-900";

  const role =
    user?.["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900">
      {/* Sidebar */}
      <aside className="hidden md:flex md:w-64 lg:w-72 flex-col border-r border-slate-200 bg-white/80 backdrop-blur">
        <div className="h-16 flex items-center px-6 border-b border-slate-200">
          <Link to="/" className="flex items-center gap-2">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-purple-600 text-white font-bold text-lg">
              L
            </span>
            <div className="flex flex-col">
              <span className="font-semibold text-slate-900">LumiSpa</span>
              <span className="text-xs text-slate-500">Staff Console</span>
            </div>
          </Link>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          <NavLink
            to="/staff/dashboard"
            className={({ isActive }) =>
              [
                navItemBase,
                isActive ? navItemActive : navItemInactive,
              ].join(" ")
            }
          >
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-lg bg-purple-50 text-purple-600 text-xs">
              ⏱
            </span>
            <span>Dashboard &amp; lịch làm việc</span>
          </NavLink>

          <NavLink
            to="/staff/profile"
            className={({ isActive }) =>
              [
                navItemBase,
                isActive ? navItemActive : navItemInactive,
              ].join(" ")
            }
          >
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-lg bg-slate-50 text-slate-700 text-xs">
              👤
            </span>
            <span>Hồ sơ cá nhân</span>
          </NavLink>
        </nav>

        <div className="p-4 border-t border-slate-200 text-xs text-slate-500">
          <div className="font-medium text-slate-700">Bạn đang đăng nhập</div>
          {user ? (
            <>
              <div className="mt-1 text-slate-800 text-sm">
                {user.Username || user.Email}
              </div>
              <div className="mt-1">
                Vai trò:{" "}
                <span className="font-semibold">
                  {role || "Staff"}
                </span>
              </div>
            </>
          ) : (
            <div className="mt-1 text-slate-400">Chưa đăng nhập</div>
          )}
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="h-16 border-b border-slate-200 bg-white/80 backdrop-blur flex items-center justify-between px-4 md:px-8">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-purple-100 text-purple-700 text-lg">
              ✨
            </span>
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-slate-900">
                {title || "Staff Dashboard"}
              </span>
              <span className="text-xs text-slate-500">
                Quản lý lịch làm việc &amp; booking của bạn
              </span>
            </div>
          </div>

          {user ? (
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex flex-col items-end">
                <span className="text-sm font-medium text-slate-900">
                  {user.Username || user.Email}
                </span>
                <span className="text-xs text-slate-500">
                  {role || "Staff"}
                </span>
              </div>
              <button
                onClick={async () => {
                  await logout();
                  navigate("/auth/signin");
                }}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-900 text-white hover:bg-slate-800"
              >
                Đăng xuất
              </button>
            </div>
          ) : (
            <div className="text-sm text-slate-500">
              LumiSpa Staff Console
            </div>
          )}
        </header>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8">{children}</div>
      </main>
    </div>
  );
}