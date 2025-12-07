import { useEffect, useState } from "react";
import { roleApi } from "../../../api/roleApi";
import { useNavigate, useParams } from "react-router-dom";
import AdminLayout from "../layout/AdminLayout";

export default function RoleForm() {
  const [form, setForm] = useState({ name: "", description: "" });
  const { id } = useParams();
  const navigate = useNavigate();

  const load = async () => {
    if (!id) return;
    const r = await roleApi.getById(id);
    setForm({
      name: r.name,
      description: r.description || "",
    });
  };

  useEffect(() => {
    load();
  }, [id]);

  const submit = async (e) => {
    e.preventDefault();

    try {
      if (id) {
        await roleApi.update(id, { id, ...form });
      } else {
        await roleApi.create(form);
      }
      navigate("/admin/roles");
    } catch (err) {
      console.error(err);
      alert("Lưu thất bại!");
    }
  };

  return (
    <AdminLayout title={id ? "Cập nhật Role" : "Tạo Role mới"}>
      <div className="max-w-xl bg-white px-6 py-7 rounded-2xl border border-slate-100 shadow-sm">
        <form onSubmit={submit} className="space-y-5">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Tên Role
            </label>
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Admin, Staff, Customer..."
              required
              className="w-full px-3 py-2 border rounded-xl text-sm focus:ring-2 focus:ring-purple-500 outline-none"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Mô tả
            </label>
            <textarea
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              rows={3}
              className="w-full px-3 py-2 border rounded-xl text-sm focus:ring-2 focus:ring-purple-500 outline-none"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => navigate("/admin/roles")}
              className="px-4 py-2 text-sm font-medium border border-slate-300 text-slate-600 rounded-xl hover:bg-slate-50"
            >
              Hủy
            </button>

            <button
              type="submit"
              className="px-5 py-2 text-sm font-semibold bg-purple-600 text-white rounded-xl shadow hover:bg-purple-700"
            >
              {id ? "Lưu thay đổi" : "Tạo mới"}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}