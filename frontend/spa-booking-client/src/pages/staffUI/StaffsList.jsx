import { useEffect, useState } from "react";
import LayoutWrapper from "../../components/Layout/LayoutWrapper";
import { staffApi } from "../../api/staffApi";
import StaffCard from "../../components/UI/StaffCard";

export default function StaffsList() {
  const [staffs, setStaffs] = useState([]);

  useEffect(() => {
    staffApi.getAll().then(setStaffs).catch(console.error);
  }, []);

  return (
    <LayoutWrapper>
      <div className="py-8">
        <h2 className="text-3xl md:text-4xl font-bold mb-3 text-center text-gray-900">
          Đội ngũ chuyên viên
        </h2>
        <p className="text-center text-gray-500 mb-8 text-sm">
          Những người mang lại trải nghiệm thư giãn và chăm sóc tốt nhất cho bạn tại LumiSpa.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {staffs.map((s) => (
            <StaffCard key={s.id} staff={s} />
          ))}
        </div>
      </div>
    </LayoutWrapper>
  );
}