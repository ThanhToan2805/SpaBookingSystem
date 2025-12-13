import { useEffect, useState } from "react";
import { staffApi } from "../../../api/staffApi";
import { userApi } from "../../../api/userApi";
import { useNavigate, useParams } from "react-router-dom";
import AdminLayout from "../layout/AdminLayout";

export default function StaffForm() {
  const [form, setForm] = useState({
    userId: "",
    userName: "",
    position: "",
    isAvailable: true,
  });

  const [eligibleUsers, setEligibleUsers] = useState([]);
  const [loadingEligible, setLoadingEligible] = useState(false);

  const { id } = useParams();
  const navigate = useNavigate();

  const loadStaff = async () => {
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

  const loadEligibleUsers = async () => {
    if (id) return;
    try {
      setLoadingEligible(true);
      const res = await userApi.getEligibleStaffUsers();
      setEligibleUsers(res || []);
    } catch (err) {
      console.error("Failed to load eligible staff users:", err);
      setEligibleUsers([]);
    } finally {
      setLoadingEligible(false);
    }
  };

  useEffect(() => {
    loadStaff();
    loadEligibleUsers();
  }, [id]);

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const onSelectUser = (e) => {
    const userId = e.target.value;
    const u = eligibleUsers.find((x) => x.id === userId);

    setForm((prev) => ({
      ...prev,
      userId,
      userName: u?.username || u?.userName || "",
    }));
  };

  const submit = async (e) => {
    e.preventDefault();

    try {
      if (id) {
        const payload = {
          position: form.position.trim(),
          isAvailable: form.isAvailable,
        };
        await staffApi.update(id, payload);
      } else {
        if (!form.userId) {
          alert("Vui lòng chọn tài khoản Staff để gán.");
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
      alert(
        "Có lỗi xảy ra khi lưu nhân viên: " +
          (err.response?.data?.message || err.message)
      );
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
          {/* CREATE: dropdown chọn user */}
          {!id && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Chọn tài khoản Staff
              </label>

              <select
                value={form.userId}
                onChange={onSelectUser}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">
                  {loadingEligible
                    ? "Đang tải danh sách..."
                    : "-- Chọn Staff user --"}
                </option>

                {eligibleUsers.map((u) => (
                  <option key={u.id} value={u.id}>
                    {(u.username || u.userName) + (u.email ? ` (${u.email})` : "")}
                  </option>
                ))}
              </select>

              {!loadingEligible && eligibleUsers.length === 0 && (
                <p className="mt-2 text-xs text-amber-600">
                  Không còn tài khoản Staff nào chưa được thêm vào danh sách staff.
                </p>
              )}
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
              disabled={!id && loadingEligible}
              title={!id && loadingEligible ? "Đang tải danh sách user..." : undefined}
            >
              {id ? "Cập nhật" : "Tạo mới"}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}