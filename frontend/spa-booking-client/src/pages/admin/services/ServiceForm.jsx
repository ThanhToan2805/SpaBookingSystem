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
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  // Upload ảnh
  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await axios.post("http://localhost:5012/api/files/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

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

  return (
    <AdminLayout title={id ? "Edit Service" : "Create Service"}>
      <form onSubmit={submit} className="space-y-4 bg-white p-6 rounded shadow max-w-2xl">
        <label className="block font-medium">Name</label>
        <input
          name="name"
          value={form.name}
          onChange={onChange}
          placeholder="Service name"
          className="w-full px-3 py-2 border rounded"
          required
        />

        <label className="block font-medium">Description</label>
        <textarea
          name="description"
          value={form.description}
          onChange={onChange}
          placeholder="Description"
          rows={3}
          className="w-full px-3 py-2 border rounded"
        />

        <label className="block font-medium">Price</label>
        <input
          name="price"
          value={form.price}
          onChange={onChange}
          placeholder="Price"
          type="number"
          className="w-full px-3 py-2 border rounded"
        />

        <label className="block font-medium">Duration (minutes)</label>
        <input
          name="durationMinutes"
          value={form.durationMinutes}
          onChange={onChange}
          placeholder="Duration"
          type="number"
          className="w-full px-3 py-2 border rounded"
        />

        <label className="block font-medium">Category</label>
        <select
          name="categoryId"
          value={form.categoryId}
          onChange={onChange}
          className="w-full px-3 py-2 border rounded"
          required
        >
          <option value="">-- Select Category --</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        {/* Image upload */}
        <div>
          <label className="block font-medium mb-1">Image</label>
          <input type="file" accept="image/*" onChange={handleUpload} disabled={uploading} />
          {uploading && <p className="text-sm text-gray-500">Uploading...</p>}
          {form.imageUrl && (
            <img
              src={form.imageUrl}
              alt="preview"
              className="w-32 h-32 mt-3 object-cover rounded border"
            />
          )}
        </div>

        {/* isActive */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            name="isActive"
            checked={form.isActive}
            onChange={onChange}
          />
          <label>Active</label>
        </div>

        <button
          type="submit"
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          {id ? "Update" : "Create"}
        </button>
      </form>
    </AdminLayout>
  );
}