import { useEffect, useState } from "react";
import { serviceApi } from "../../../api/serviceApi";
import { categoryApi } from "../../../api/categoryApi";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import AdminLayout from "../layout/AdminLayout";

export default function ServiceForm() {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    durationMinutes: "",
    imageUrl: "",
    isActive: true,
    categoryId: "",
  });
  const [uploading, setUploading] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();

  // Load categories và service nếu edit
  const load = async () => {
    const cate = await categoryApi.getAll();
    setCategories(cate);

    if (id) {
      try {
        const srv = await serviceApi.getById(id);
        setForm({
          id: srv.id,
          name: srv.name || "",
          description: srv.description || "",
          price: srv.price || "",
          durationMinutes: srv.durationMinutes || "",
          imageUrl: srv.imageUrl || "",
          isActive: srv.isActive ?? true,
          categoryId: srv.categoryId || "",
        });
      } catch (err) {
        console.error("Failed to load service:", err);
      }
    }
  };

  useEffect(() => {
    load();
  }, [id]);

  // Xử lý input change
  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Upload ảnh
  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await axios.post(
        "http://localhost:5012/api/files/upload",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      const url = res.data.url; // backend trả về URL ảnh
      setForm((prev) => ({ ...prev, imageUrl: url }));
    } catch (err) {
      console.error("Upload failed:", err);
      alert("Upload ảnh thất bại!");
    } finally {
      setUploading(false);
    }
  };

  // Submit form
  const submit = async (e) => {
    e.preventDefault();

    if (!form.imageUrl) {
      alert("Vui lòng upload hình ảnh trước khi submit!");
      return;
    }

    try {
      if (id) {
        await serviceApi.update(id, { ...form, id });
      } else {
        await serviceApi.create(form);
      }
      navigate("/admin/services");
    } catch (err) {
      console.error("Failed to save service:", err);
      alert("Có lỗi xảy ra khi lưu dịch vụ!");
    }
  };

  const title = id ? "Cập nhật Service" : "Tạo Service mới";

  return (
    <AdminLayout title={title}>
      <form
        onSubmit={submit}
        className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 max-w-4xl"
      >
        <div className="grid gap-6 md:grid-cols-3">
          {/* Cột trái + giữa: thông tin chính */}
          <div className="md:col-span-2 space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Tên dịch vụ
              </label>
              <input
                name="name"
                value={form.name}
                onChange={onChange}
                placeholder="Nhập tên dịch vụ (ví dụ: Massage thư giãn toàn thân)"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Mô tả
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={onChange}
                placeholder="Mô tả chi tiết về dịch vụ, lợi ích, đối tượng phù hợp..."
                rows={4}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Giá (VND)
                </label>
                <input
                  name="price"
                  value={form.price}
                  onChange={onChange}
                  placeholder="Nhập giá dịch vụ"
                  type="number"
                  min="0"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Thời lượng (phút)
                </label>
                <input
                  name="durationMinutes"
                  value={form.durationMinutes}
                  onChange={onChange}
                  placeholder="Ví dụ: 60"
                  type="number"
                  min="0"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Category
              </label>
              <select
                name="categoryId"
                value={form.categoryId}
                onChange={onChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              >
                <option value="">-- Chọn Category --</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Cột phải: ảnh + trạng thái */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Hình ảnh
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleUpload}
                disabled={uploading}
                className="text-sm"
              />
              {uploading && (
                <p className="text-xs text-slate-500 mt-1">
                  Đang upload...
                </p>
              )}
              {form.imageUrl && (
                <div className="mt-3">
                  <img
                    src={form.imageUrl}
                    alt="preview"
                    className="w-40 h-40 object-cover rounded-xl border border-slate-200"
                  />
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 mt-4">
              <input
                type="checkbox"
                name="isActive"
                checked={form.isActive}
                onChange={onChange}
                id="isActive"
                className="h-4 w-4"
              />
              <label
                htmlFor="isActive"
                className="text-sm text-slate-700 select-none"
              >
                Active (hiển thị trên website)
              </label>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            type="button"
            onClick={() => navigate("/admin/services")}
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
    </AdminLayout>
  );
}
