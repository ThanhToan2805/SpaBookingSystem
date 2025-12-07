export default function Button({ children, className = "", ...props }) {
  return (
    <button
      {...props}
      className={`px-4 py-2 rounded-lg font-medium text-white 
        bg-linear-to-r from-purple-600 to-purple-500
        hover:from-purple-700 hover:to-purple-600 
        transition-all duration-300 shadow-sm hover:shadow-lg active:scale-95
        ${className}`}
    >
      {children}
    </button>
  );
}