import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import LayoutWrapper from "../../components/Layout/LayoutWrapper";
import { serviceApi } from "../../api/serviceApi";
import { staffApi } from "../../api/staffApi";
import { timeSlotApi } from "../../api/timeSlotApi";
import { bookingApi } from "../../api/bookingApi";

export default function BookingForm() {
  const { register, handleSubmit } = useForm();
  const [services, setServices] = useState([]);
  const [staffs, setStaffs] = useState([]);
  const [timeSlots, setTimeSlots] = useState([]);

  useEffect(() => {
    serviceApi.getAll().then(setServices);
    staffApi.getAll().then(setStaffs);
    timeSlotApi.getAll().then(setTimeSlots);
  }, []);

  const onSubmit = (data) => {
    bookingApi.create(data)
      .then(() => alert("Booking created successfully"))
      .catch(err => alert("Booking failed: " + err.message));
  };

  return (
    <LayoutWrapper>
      <h2 className="text-3xl font-bold mb-6">Book a Service</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 max-w-lg mx-auto">
        <select {...register("serviceId")} className="border p-2 rounded">
          <option value="">Select Service</option>
          {services.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>

        <select {...register("staffId")} className="border p-2 rounded">
          <option value="">Select Staff (optional)</option>
          {staffs.map(s => <option key={s.id} value={s.id}>{s.userName}</option>)}
        </select>

        <select {...register("timeSlotId")} className="border p-2 rounded">
          <option value="">Select Time Slot</option>
          {timeSlots.filter(ts => ts.isAvailable).map(ts => (
            <option key={ts.id} value={ts.id}>
              {new Date(ts.startAt).toLocaleString()} - {new Date(ts.endAt).toLocaleTimeString()}
            </option>
          ))}
        </select>

        <textarea {...register("note")} placeholder="Notes" className="border p-2 rounded"/>

        <button type="submit" className="bg-purple-600 text-white py-2 rounded hover:bg-purple-700">Book Now</button>
      </form>
    </LayoutWrapper>
  );
}