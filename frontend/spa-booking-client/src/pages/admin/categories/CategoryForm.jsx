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

  useEffect(() => { load(); }, [id]);

  // Submit form
  const submit = async (e) => {
    e.preventDefault();

    const payload = {
      id: id,
      name: name.trim(),               // loại bỏ khoảng trắng đầu/cuối
      description: description.trim(), // gửi "" nếu rỗng
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

  return (
    <AdminLayout title={id ? "Update Category" : "Create Category"}>
      <form onSubmit={submit} className="space-y-4 max-w-md bg-white p-6 rounded shadow">
        <label className="block font-medium">Name</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-3 py-2 border rounded"
          placeholder="Category name"
          required
        />

        <label className="block font-medium">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-3 py-2 border rounded"
          placeholder="Description"
          rows={3}
        />

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