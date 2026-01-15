import { X } from "lucide-react";

export default function Modal({ title, children, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* OVERLAY */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/40"
      />

      {/* MODAL */}
      <div className="relative bg-white w-full max-w-md rounded-xl shadow-lg p-6 z-10">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-gray-800">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={18} />
          </button>
        </div>

        {/* BODY */}
        {children}
      </div>
    </div>
  );
}
