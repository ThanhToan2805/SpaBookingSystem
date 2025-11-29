import { useEffect, useState } from "react";
import LayoutWrapper from "../../components/Layout/LayoutWrapper";
import { staffApi } from "../../api/staffApi";
import StaffCard from "../../components/UI/StaffCard";

export default function StaffList() {
  const [staffs, setStaffs] = useState([]);

  useEffect(() => {
    staffApi.getAll().then(setStaffs).catch(console.error);
  }, []);

  return (
    <LayoutWrapper>
      <h2 className="text-3xl font-bold mb-6 text-center">Our Staff</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {staffs.map(s => <StaffCard key={s.id} staff={s} />)}
      </div>
    </LayoutWrapper>
  );
}