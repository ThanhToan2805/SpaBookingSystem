// src/pages/admin/promotions/PromotionForm.jsx
import { useEffect, useState } from "react";
import { promotionApi } from "../../../api/promotionApi";
import { useNavigate, useParams } from "react-router-dom";
import AdminLayout from "../layout/AdminLayout";

function toDateTimeLocal(value) {
  if (!value) return "";
  const d = new Date(value);
  // toISOString => "YYYY-MM-DDTHH:mm:ss.sssZ" -> lấy 16 ký tự đầu = "YYYY-MM-DDTHH:mm"
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 16);
}

export default function PromotionForm() {
  const [form, setForm] = useState({
    name: "",
    discountAmount: "",
    discountPercent: "",
    startAt: "",
    endAt: "",
    isActive: true,
  });

  const { id } = useParams();
  const navigate = useNavigate();

  const load = async () => {
    if (!id) return;
    try {
      const p = await promotionApi.getById(id);
      setForm({
        name: p.name || "",
        discountAmount: p.discountAmount ?? "",
        discountPercent: p.discountPercent ?? "",
        startAt: toDateTimeLocal(p.startAt),
        endAt: toDateTimeLocal(p.endAt),
        isActive: p.isActive,
      });
    } catch (err) {
      console.error("Failed load promotion:", err);
    }
  };

  useEffect(() => {
    load();
  }, [id]);

  const onChange = (e) => {
    const { name, type, value, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const submit = async (e) => {
    e.preventDefault();

    if (!form.name.trim()) {
      alert("Tên promotion không được để trống.");
      return;
    }

    if (!form.startAt || !form.endAt) {
      alert("Vui lòng chọn thời gian bắt đầu và kết thúc.");
      return;
    }

    const start = new Date(form.startAt);
    const end = new Date(form.endAt);
    if (end <= start) {
      alert("Thời gian kết thúc phải sau thời gian bắt đầu.");
      return;
    }

    const hasPercent = form.discountPercent !== "" && form.discountPercent != null;
    const hasAmount = form.discountAmount !== "" && form.discountAmount != null;

    if (!hasPercent && !hasAmount) {
      alert("Vui lòng nhập Discount Amount hoặc Discount Percent.");
      return;
    }

    const payload = {
      name: form.name.trim(),
      discountAmount: hasAmount ? Number(form.discountAmount) : null,
      discountPercent: hasPercent ? Number(form.discountPercent) : null,
      startAt: new Date(form.startAt).toISOString(),
      endAt: new Date(form.endAt).toISOString(),
      isActive: form.isActive,
    };

    try {
      if (id) {
        await promotionApi.update(id, { id, ...payload });
      } else {
        await promotionApi.create(payload);
      }
      navigate("/admin/promotions");
    } catch (err) {
      console.error("Failed to save promotion:", err);
      alert("Lưu promotion thất bại, thử lại sau.");
    }
  };

  const title = id ? "Cập nhật Promotion" : "Tạo Promotion mới";

  return (
    <AdminLayout title={title}>
      <div className="max-w-2xl bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        <form onSubmit={submit} className="grid gap-4 md:grid-cols-2">
          {/* Name */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Tên Promotion
            </label>
            <input
              name="name"
              value={form.name}
              onChange={onChange}
              placeholder="Ví dụ: Giảm 20% cuối tuần"
              className="w-full px-3 py-2 border rounded-xl text-sm focus:ring-2 focus:ring-purple-500 outline-none"
              required
            />
          </div>

          {/* Discount Percent */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Discount Percent (%)
            </label>
            <input
              name="discountPercent"
              type="number"
              min="0"
              max="100"
              value={form.discountPercent}
              onChange={onChange}
              placeholder="Ví dụ: 20"
              className="w-full px-3 py-2 border rounded-xl text-sm focus:ring-2 focus:ring-purple-500 outline-none"
            />
            <p className="mt-1 text-[11px] text-slate-400">
              Để trống nếu dùng giảm theo số tiền.
            </p>
          </div>

          {/* Discount Amount */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Discount Amount (VND)
            </label>
            <input
              name="discountAmount"
              type="number"
              min="0"
              value={form.discountAmount}
              onChange={onChange}
              placeholder="Ví dụ: 50000"
              className="w-full px-3 py-2 border rounded-xl text-sm focus:ring-2 focus:ring-purple-500 outline-none"
            />
            <p className="mt-1 text-[11px] text-slate-400">
              Để trống nếu dùng giảm theo %.
            </p>
          </div>

          {/* StartAt */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Bắt đầu từ
            </label>
            <input
              type="datetime-local"
              name="startAt"
              value={form.startAt}
              onChange={onChange}
              className="w-full px-3 py-2 border rounded-xl text-sm focus:ring-2 focus:ring-purple-500 outline-none"
              required
            />
          </div>

          {/* EndAt */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Kết thúc lúc
            </label>
            <input
              type="datetime-local"
              name="endAt"
              value={form.endAt}
              onChange={onChange}
              className="w-full px-3 py-2 border rounded-xl text-sm focus:ring-2 focus:ring-purple-500 outline-none"
              required
            />
          </div>

          {/* isActive */}
          <div className="md:col-span-2 flex items-center gap-2 mt-2">
            <input
              id="isActive"
              name="isActive"
              type="checkbox"
              checked={form.isActive}
              onChange={onChange}
              className="h-4 w-4"
            />
            <label
              htmlFor="isActive"
              className="text-sm text-slate-700 select-none"
            >
              Promotion đang được kích hoạt (Active)
            </label>
          </div>

          {/* Actions */}
          <div className="md:col-span-2 flex justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={() => navigate("/admin/promotions")}
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