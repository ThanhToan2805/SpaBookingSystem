import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import LayoutWrapper from "../../components/Layout/LayoutWrapper";
import { serviceApi } from "../../api/serviceApi";

export default function ServiceDetail() {
  const { id } = useParams();
  const [service, setService] = useState(null);

  useEffect(() => {
    serviceApi.getById(id).then(setService).catch(console.error);
  }, [id]);

  if (!service) return <LayoutWrapper>Loading...</LayoutWrapper>;

  return (
    <LayoutWrapper>
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg overflow-hidden transform transition duration-300 hover:shadow-xl">
        <img src={service.imageUrl || "/placeholder.png"} alt={service.name} className="w-full h-64 object-cover"/>
        <div className="p-6">
          <h2 className="text-3xl font-bold mb-4">{service.name}</h2>
          <p className="text-gray-700 mb-4">{service.description}</p>
          <p className="font-bold text-purple-600 text-xl mb-4">${service.price.toFixed(2)}</p>
          <p><strong>Duration:</strong> {service.durationMinutes} minutes</p>
          <button className="mt-4 bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-700">
            Book Now
          </button>
        </div>
      </div>
    </LayoutWrapper>
  );
}