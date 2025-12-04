import { useEffect, useState } from "react";
import { serviceApi } from "../../../api/serviceApi";
import { Link } from "react-router-dom";
import AdminLayout from "../layout/AdminLayout";

export default function ServiceList() {
  const [data, setData] = useState([]);

  const load = async () => {
    const res = await serviceApi.getAll();
    setData(res);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Xoá service này?")) return;
    await serviceApi.delete(id);
    load();
  };

  useEffect(() => { load(); }, []);

  return (
    <AdminLayout title="Quản lý Services">
      <div className="flex justify-end mb-4">
        <Link
          to="/admin/services/create"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          + Create
        </Link>
      </div>

      <table className="w-full border-collapse border rounded shadow bg-white">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-3 border">Image</th>
            <th className="p-3 border">Name</th>
            <th className="p-3 border">Price</th>
            <th className="p-3 border">Active</th>
            <th className="p-3 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((x) => (
            <tr key={x.id} className="hover:bg-gray-50">
              <td className="p-2 border w-20">
                <img src={x.imageUrl} className="w-16 h-16 object-cover rounded" />
              </td>
              <td className="p-3 border">{x.name}</td>
              <td className="p-3 border">{x.price}₫</td>
              <td className="p-3 border">
                <input type="checkbox" checked={x.isActive} readOnly />
              </td>
              <td className="p-3 flex gap-2 justify-center">
                <Link
                  to={`/admin/services/edit/${x.id}`}
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