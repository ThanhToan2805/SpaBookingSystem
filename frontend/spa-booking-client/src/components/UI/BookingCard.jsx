export default function BookingCard({ booking, onEdit, onCancel }) {
  return (
    <div className="bg-white shadow-md p-4 rounded-lg flex justify-between items-center transform transition duration-300 hover:scale-105 hover:shadow-xl">
      <div>
        <p><strong>Service:</strong> {booking.serviceName || booking.serviceId}</p>
        <p><strong>Start:</strong> {new Date(booking.startAt).toLocaleString()}</p>
        <p><strong>End:</strong> {new Date(booking.endAt).toLocaleString()}</p>
        <p><strong>Status:</strong> {booking.status}</p>
      </div>
      <div className="flex gap-2">
        <button onClick={() => onEdit?.(booking)} className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600">Edit</button>
        <button onClick={() => onCancel?.(booking)} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">Cancel</button>
      </div>
    </div>
  );
}