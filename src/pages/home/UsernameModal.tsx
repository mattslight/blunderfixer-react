// src/components/UsernameModal.tsx
import { X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface UsernameModalProps {
  onClose(): void;
  onSubmit(username: string): void;
  error?: string;
}

export default function UsernameModal({
  onClose,
  onSubmit,
  error,
}: UsernameModalProps) {
  const [username, setUsername] = useState('');
  const modalRef = useRef<HTMLDivElement>(null);

  // Close on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  // Click outside to close
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md">
      <div
        ref={modalRef}
        className="relative w-full max-w-md rounded-xl border border-gray-700 bg-black/80 p-6 shadow-xl"
      >
        {/* Close */}
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          <X size={20} />
        </button>

        {/* Header */}
        <h2 className="mt-4 mb-2 text-center text-xl font-medium text-white">
          Enter your Chess.com username
        </h2>
        <p className="mb-6 text-center text-sm text-gray-400">
          We’ll pull in your latest games for instant analysis.
        </p>

        {/* Benefits */}
        <div className="mb-6 space-y-1 text-center text-xs text-gray-300">
          <p>🔁 Review lost positions, ask questions</p>
          <p>🎯 Get clear answers on what went wrong</p>
          <p>🏆 Practice key ideas until mastery</p>
        </div>
        {/* Input */}
        <input
          type="text"
          placeholder="e.g. MagnusCarlsen"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="mb-5 w-full rounded-full border-2 border-gray-600 bg-black/90 px-4 py-2 text-white placeholder-gray-500 focus:border-blue-400 focus:ring-1 focus:ring-blue-400 focus:outline-none"
        />
        {error && (
          <p className="mb-4 text-center text-sm text-red-400">{error}</p>
        )}

        {/* Actions */}
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-3 py-1 text-sm text-gray-300 hover:text-white focus:outline-none"
          >
            Cancel
          </button>
          <button
            onClick={() => onSubmit(username.trim())}
            disabled={!username.trim()}
            className="flex flex-row rounded-full bg-green-500 px-5 py-2 align-middle text-sm font-semibold text-white hover:bg-green-600 focus:outline-none disabled:bg-gray-500 disabled:opacity-50"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}
