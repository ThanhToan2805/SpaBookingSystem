import { useEffect, useState } from "react";
import { categoryApi } from "../../../api/categoryApi";
import { Link } from "react-router-dom";
import AdminLayout from "../layout/AdminLayout";

export default function CategoryList() {
  const [data, setData] = useState([]);

  const load = async () => {
    const res = await categoryApi.getAll();
    setData(res);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Xoá category này?")) return;
    await categoryApi.delete(id);
    load();
  };

  useEffect(() => { load(); }, []);

  return (
    <AdminLayout title="Quản lý Categories">
      <div className="flex justify-end mb-4">
        <Link
          to="/admin/categories/create"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          + Create
        </Link>
      </div>

      <table className="w-full border-collapse border rounded shadow bg-white">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-3 border">Name</th>
            <th className="p-3 border">Description</th>
            <th className="p-3 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((x) => (
            <tr key={x.id} className="hover:bg-gray-50">
              <td className="p-3 border">{x.name}</td>
              <td className="p-3 border">{x.description}</td>
              <td className="p-3 border flex gap-2">
                <Link
                  to={`/admin/categories/edit/${x.id}`}
                  className="px-3 py-1 bg-yellow-400 text-black rounded hover:bg-yellow-500"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(x.id)}
                  className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </AdminLayout>
  );
}