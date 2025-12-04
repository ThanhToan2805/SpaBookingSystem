export default function Modal({ open, title, children, onClose }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 animate-fadeIn">
        <h3 className="text-xl font-semibold mb-4">{title}</h3>

        {children}

        <div className="flex justify-end mt-6">
          <button
            className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 transition"
            onClick={onClose}
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}