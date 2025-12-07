import { useEffect, useState } from "react";
import { staffApi } from "../../../api/staffApi";
import { useNavigate, useParams } from "react-router-dom";
import AdminLayout from "../layout/AdminLayout";

export default function StaffForm() {
  const [form, setForm] = useState({
    userId: "",
    userName: "",
    position: "",
    isAvailable: true,
  });

  const { id } = useParams();
  const navigate = useNavigate();

  const load = async () => {
    if (!id) return;
    try {
      const s = await staffApi.getById(id);
      setForm({
        userId: s.userId,
        userName: s.userName || "",
        position: s.position || "",
        isAvailable: s.isAvailable ?? true,
      });
    } catch (err) {
      console.error("Failed to load staff:", err);
    }
  };

  useEffect(() => {
    load();
  }, [id]);

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const submit = async (e) => {
    e.preventDefault();

    try {
      if (id) {
        // UPDATE: dùng UpdateStaffCommand => { id, position, isAvailable }
        const payload = {
          position: form.position.trim(),
          isAvailable: form.isAvailable,
        };
        await staffApi.update(id, payload);
      } else {
        // CREATE: dùng CreateStaffCommand => { userId, position, isAvailable }
        if (!form.userId) {
          alert("Vui lòng nhập UserId cho nhân viên.");
          return;
        }
        const payload = {
          userId: form.userId,
          position: form.position.trim(),
          isAvailable: form.isAvailable,
        };
        await staffApi.create(payload);
      }

      navigate("/admin/staffs");
    } catch (err) {
      console.error("Failed to save staff:", err);
      alert("Có lỗi xảy ra khi lưu nhân viên!");
    }
  };

  const title = id ? "Cập nhật Staff" : "Thêm Staff mới";

  return (
    <AdminLayout title={title}>
      <div className="max-w-xl">
        <form
          onSubmit={submit}
          className="space-y-4 bg-white rounded-2xl shadow-sm border border-slate-100 p-6"
        >
          {/* CREATE: nhập UserId */}
          {!id && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                UserId (Guid)
              </label>
              <input
                name="userId"
                value={form.userId}
                onChange={onChange}
                placeholder="Nhập UserId của tài khoản liên kết"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
              <p className="mt-1 text-xs text-slate-400">
                * Đây là Id của User trong hệ thống (được backend mapping với staff).
              </p>
            </div>
          )}

          {/* EDIT: chỉ hiển thị Username (không cho sửa) */}
          {id && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Username
              </label>
              <input
                value={form.userName}
                disabled
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 text-slate-600"
              />
              <p className="mt-1 text-xs text-slate-400">
                Username không thể thay đổi tại đây.
              </p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Vị trí / Chuyên môn
            </label>
            <input
              name="position"
              value={form.position}
              onChange={onChange}
              placeholder="Ví dụ: Chuyên viên massage, Chăm sóc da..."
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div className="flex items-center gap-2 mt-2">
            <input
              type="checkbox"
              id="isAvailable"
              name="isAvailable"
              checked={form.isAvailable}
              onChange={onChange}
              className="h-4 w-4"
            />
            <label
              htmlFor="isAvailable"
              className="text-sm text-slate-700 select-none"
            >
              Đang nhận khách (Available)
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => navigate("/admin/staffs")}
              className="px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-purple-600 text-white rounded-lg text-sm font-semibold hover:bg-purple-700 transition"
            >
              {id ? "Cập nhật" : "Tạo mới"}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}