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

  useEffect(() => {
    load();
  }, []);

  return (
    <AdminLayout title="Quản lý Categories">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">
            Danh sách category
          </h2>
          <p className="text-xs text-slate-400">
            Quản lý các nhóm dịch vụ của LumiSpa.
          </p>
        </div>
        <Link
          to="/admin/categories/create"
          className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition"
        >
          + Tạo category
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-slate-50 text-center text-xs uppercase tracking-wide text-slate-500">
              <th className="p-3 border-b border-slate-100">Tên</th>
              <th className="p-3 border-b border-slate-100">Mô tả</th>
              <th className="p-3 border-b border-slate-100 w-40">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={3}
                  className="p-4 text-center text-slate-400 text-sm"
                >
                  Chưa có category nào.
                </td>
              </tr>
            ) : (
              data.map((x) => (
                <tr
                  key={x.id}
                  className="hover:bg-slate-50 transition border-b border-slate-50"
                >
                  <td className="p-3 align-top">
                    <div className="font-semibold text-slate-900">
                      {x.name}
                    </div>
                  </td>
                  <td className="p-3 align-top text-slate-600">
                    {x.description || (
                      <span className="text-xs text-slate-400">
                        Không có mô tả
                      </span>
                    )}
                  </td>
                  <td className="p-3 align-top">
                    <div className="flex flex-wrap gap-2">
                      <Link
                        to={`/admin/categories/edit/${x.id}`}
                        className="px-3 py-1.5 bg-amber-400 text-slate-900 rounded-lg text-xs font-medium hover:bg-amber-500 transition"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(x.id)}
                        className="px-3 py-1.5 bg-red-500 text-white rounded-lg text-xs font-medium hover:bg-red-600 transition"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}