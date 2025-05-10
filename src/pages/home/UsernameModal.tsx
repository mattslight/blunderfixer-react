// src/components/UsernameModal.tsx
import { useState } from 'react';

interface UsernameModalProps {
  /** Called when the user clicks “Cancel” or outside the modal */
  onClose(): void;
  /** Called with the entered username when the user confirms */
  onSubmit(username: string): void;
}

export default function UsernameModal({
  onClose,
  onSubmit,
}: UsernameModalProps) {
  const [username, setUsername] = useState('');

  return (
    <div
      className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div
        className="w-full max-w-sm rounded-lg bg-white p-6 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="mb-4 text-lg font-semibold text-gray-800">
          Enter your Chess.com username
        </h2>

        <input
          type="text"
          placeholder="e.g. MagnusCarlsen"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full rounded border border-gray-300 px-3 py-2 text-black focus:ring focus:outline-none"
        />

        <div className="mt-6 flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded px-4 py-2 text-gray-700 hover:bg-gray-100 focus:outline-none"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => onSubmit(username.trim())}
            disabled={!username.trim()}
            className="rounded bg-green-500 px-4 py-2 font-semibold text-white hover:bg-green-600 focus:outline-none disabled:opacity-50"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
}
