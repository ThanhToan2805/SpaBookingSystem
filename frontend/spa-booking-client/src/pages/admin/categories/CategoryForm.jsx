import { useEffect, useState } from "react";
import { categoryApi } from "../../../api/categoryApi";
import { useNavigate, useParams } from "react-router-dom";
import AdminLayout from "../layout/AdminLayout";

export default function CategoryForm() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const { id } = useParams();
  const navigate = useNavigate();

  // Load category nếu đang edit
  const load = async () => {
    if (id) {
      try {
        const res = await categoryApi.getById(id);
        setName(res.name || "");
        setDescription(res.description || "");
      } catch (err) {
        console.error("Failed to load category:", err);
      }
    }
  };

  useEffect(() => {
    load();
  }, [id]);

  // Submit form
  const submit = async (e) => {
    e.preventDefault();

    const payload = {
      id: id,
      name: name.trim(),
      description: description.trim(),
    };

    try {
      if (id) {
        await categoryApi.update(id, payload);
      } else {
        await categoryApi.create(payload);
      }
      navigate("/admin/categories");
    } catch (err) {
      console.error("Failed to save category:", err);
      alert("Có lỗi xảy ra, vui lòng thử lại.");
    }
  };

  const title = id ? "Cập nhật Category" : "Tạo Category mới";

  return (
    <AdminLayout title={title}>
      <div className="max-w-xl">
        <form
          onSubmit={submit}
          className="space-y-4 bg-white rounded-2xl shadow-sm border border-slate-100 p-6"
        >
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Tên category
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Nhập tên category (ví dụ: Massage, Facial, ...)"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Mô tả
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Mô tả ngắn gọn về category này"
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => navigate("/admin/categories")}
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