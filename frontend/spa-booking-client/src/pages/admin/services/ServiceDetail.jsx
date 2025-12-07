import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AdminLayout from "../layout/AdminLayout";
import { serviceApi } from "../../../api/serviceApi";
import { categoryApi } from "../../../api/categoryApi";

function formatMoney(v) {
  if (v == null) return "—";
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(v);
}

function activeBadge(isActive) {
  const base =
    "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ";
  return isActive
    ? (
      <span className={base + "bg-emerald-50 text-emerald-700 border-emerald-100"}>
        ● Đang hiển thị
      </span>
    )
    : (
      <span className={base + "bg-slate-50 text-slate-500 border-slate-200"}>
        ● Đang ẩn
      </span>
    );
}

export default function ServiceDetail() {
  const { id } = useParams();
  const [service, setService] = useState(null);
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDetail = async () => {
      try {
        setLoading(true);
        const srv = await serviceApi.getById(id);
        setService(srv);

        // map Category từ CategoryId → Category name/description
        if (srv?.categoryId) {
          try {
            const cate = await categoryApi.getById(srv.categoryId);
            setCategory(cate);
          } catch {
            // ignore lỗi category riêng
          }
        }
      } catch (err) {
        console.error("Failed to load service detail:", err);
      } finally {
        setLoading(false);
      }
    };

    loadDetail();
  }, [id]);

  if (loading) {
    return (
      <AdminLayout title="Chi tiết dịch vụ">
        <div className="bg-white rounded-2xl border border-slate-100 p-6 text-sm text-slate-500">
          Đang tải chi tiết dịch vụ...
        </div>
      </AdminLayout>
    );
  }

  if (!service) {
    return (
      <AdminLayout title="Chi tiết dịch vụ">
        <div className="bg-white rounded-2xl border border-rose-100 p-6 text-sm text-rose-500">
          Không tìm thấy dịch vụ.
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Chi tiết dịch vụ">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header đẹp, căn giữa */}
        <div className="flex flex-col items-center text-center gap-3 mb-2">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              Thông tin dịch vụ
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Xem chi tiết mô tả, giá, thời lượng và phân loại của dịch vụ.
            </p>
          </div>
        </div>

        {/* Card tổng quan: ảnh + tên + trạng thái + category */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <div className="grid grid-cols-1 md:grid-cols-[220px,1fr] gap-6">
            {/* Hình ảnh */}
            <div className="flex justify-center">
              <div className="w-48 h-48 rounded-2xl overflow-hidden border border-slate-200 bg-slate-50">
                {service.imageUrl ? (
                  <img
                    src={service.imageUrl}
                    alt={service.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xs text-slate-400">
                    Không có hình ảnh
                  </div>
                )}
              </div>
            </div>

            {/* Info chính */}
            <div className="flex flex-col justify-between gap-4">
              <div>
                <h3 className="text-xl font-semibold text-slate-900 mb-1">
                  {service.name}
                </h3>

                {service.description && (
                  <p className="text-sm text-slate-600">
                    {service.description}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-xs text-slate-500 mb-1">
                    Giá hiện tại
                  </p>
                  <p className="font-semibold text-emerald-700">
                    {formatMoney(service.price)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">
                    Thời lượng dịch vụ
                  </p>
                  <p className="font-medium text-slate-900">
                    {service.durationMinutes} phút
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Card phân loại & category detail */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide mb-4">
            Phân loại & Category
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div>
              <p className="text-xs text-slate-500 mb-1">
                Trạng thái hiển thị
              </p>
              {activeBadge(service.isActive)}
            </div>

            <div>
              <p className="text-xs text-slate-500 mb-1">
                Nhóm dịch vụ (Category)
              </p>
              {category ? (
                <div className="space-y-1">
                  <p className="font-medium text-slate-900">
                    {category.name}
                  </p>
                  {category.description && (
                    <p className="text-xs text-slate-600">
                      {category.description}
                    </p>
                  )}
                </div>
              ) : (
                <p className="text-xs text-slate-500">
                  Dịch vụ này chưa được gán vào category nào.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Card mô tả chi tiết (nếu bạn muốn tách riêng) */}
        {service.description && (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide mb-3">
              Mô tả chi tiết
            </h3>
            <p className="text-sm text-slate-700 leading-relaxed">
              {service.description}
            </p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}