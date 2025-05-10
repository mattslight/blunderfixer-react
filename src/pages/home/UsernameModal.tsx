// src/components/UsernameModal.tsx
import { Loader, X } from 'lucide-react';
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
  const [isLoading, setIsLoading] = useState(false);
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

  const handleContinue = () => {
    if (!username.trim()) return;
    setIsLoading(true);
    onSubmit(username.trim());
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-2 backdrop-blur-md">
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
        <div className="mx-auto mb-6 max-w-xs text-left text-xs text-gray-300">
          <ul className="ml-10 space-y-1">
            <li className="flex items-start">
              <span className="mr-2">🔁</span>
              <span>Review lost positions, ask questions</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">🎯</span>
              <span>Get clear answers on what went wrong</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">🏆</span>
              <span>Practice key ideas until mastery</span>
            </li>
          </ul>
        </div>

        {/* Input */}
        <input
          type="text"
          placeholder="e.g. MagnusCarlsen"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          disabled={isLoading}
          className="mb-5 w-full rounded-full border-2 border-gray-600 bg-black/90 px-4 py-2 text-white placeholder-gray-500 focus:border-blue-400 focus:ring-1 focus:ring-blue-400 focus:outline-none disabled:opacity-50"
        />
        {error && (
          <p className="mb-4 text-center text-sm text-red-400">{error}</p>
        )}

        {/* Actions */}
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-3 py-1 text-sm text-gray-300 hover:text-white focus:outline-none disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleContinue}
            disabled={!username.trim() || isLoading}
            className="flex items-center space-x-2 rounded-full bg-green-500 px-5 py-2 text-sm font-semibold text-white hover:bg-green-600 focus:outline-none disabled:bg-gray-500 disabled:opacity-50"
          >
            {isLoading ? (
              <Loader className="h-5 w-5 animate-spin" />
            ) : (
              <span>Continue</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
