import { useEffect, useState } from "react";
import LayoutWrapper from "../../components/Layout/LayoutWrapper";
import { serviceApi } from "../../api/serviceApi";
import ServiceCard from "../../components/UI/ServiceCard";

export default function ServicesList() {
  const [services, setServices] = useState([]);

  useEffect(() => {
    serviceApi.getAll().then(setServices).catch(console.error);
  }, []);

  return (
    <LayoutWrapper>
      <h2 className="text-3xl font-bold mb-6">All Services</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {services.map(s => <ServiceCard key={s.id} service={s} />)}
      </div>
    </LayoutWrapper>
  );
}