// src/pages/home/ConfirmModal.tsx

interface ConfirmModalProps {
  show: boolean;
  profile: { username: string; name?: string };
  onConfirm(): void;
  onCancel(): void;
}

export default function ConfirmModal({
  show,
  profile,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  if (!show) return null;

  return (
    <div
      className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black"
      onClick={onCancel}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="w-full max-w-sm rounded-lg bg-white p-6 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="mb-4 text-lg font-semibold text-gray-800">
          Confirm your handle
        </h2>
        <p className="mb-6 text-gray-700">
          We found <span className="font-bold">{profile.username}</span>
          {profile.name ? ` (${profile.name})` : ''}. Proceed?
        </p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onCancel}
            className="rounded px-4 py-2 text-gray-700 hover:bg-gray-100 focus:outline-none"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="rounded bg-green-500 px-4 py-2 font-semibold text-white hover:bg-green-600 focus:outline-none"
          >
            Yes, continue
          </button>
        </div>
      </div>
    </div>
  );
}
