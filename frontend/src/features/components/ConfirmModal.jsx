import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

export default function ConfirmModal({
  open,
  title,
  message,
  onConfirm,
  onCancel
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl w-full max-w-md shadow-lg">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <h3 className="font-semibold text-base">{title}</h3>
          <button onClick={onCancel} className="text-gray-500 hover:text-black">
            <FontAwesomeIcon icon={faXmark} />
          </button>
        </div>

        {/* Body */}
        <div className="px-4 py-4 text-sm text-gray-700">
          {message}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-4 py-3 border-t">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-md border text-sm"
          >
            No
          </button>

          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-md bg-red-600 text-white text-sm"
          >
            Yes, Delete
          </button>
        </div>
      </div>
    </div>
  );
}
