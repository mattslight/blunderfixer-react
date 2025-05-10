// src/pages/home/ConfirmModal.tsx
import { X } from 'lucide-react';
import { useEffect, useRef } from 'react';

interface ConfirmModalProps {
  show: boolean;
  profile: {
    username: string;
    name?: string;
    avatar?: string;
    country?: string; // e.g. "https://api.chess.com/pub/country/AE"
  };
  onConfirm(): void;
  onCancel(): void;
}

export default function ConfirmModal({
  show,
  profile,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  // prevent background scroll when open
  useEffect(() => {
    document.body.classList.toggle('overflow-hidden', show);
    return () => document.body.classList.remove('overflow-hidden');
  }, [show]);

  if (!show) return null;

  // derive flag emoji from the country URL
  const countryCode = profile.country?.split('/').pop()?.toUpperCase() || '';
  const flagEmoji = countryCode
    ? countryCode
        .split('')
        .map((c) => String.fromCodePoint(c.charCodeAt(0) + 127397))
        .join('')
    : '';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md">
      <div
        ref={modalRef}
        className="relative w-full max-w-sm rounded-xl border border-gray-700 bg-black/80 p-6 shadow-xl"
      >
        {/* Close */}
        <button
          onClick={onCancel}
          aria-label="Close"
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          <X size={20} />
        </button>

        {/* Avatar & Name */}
        <div className="mb-4 flex flex-col items-center">
          {profile.avatar ? (
            <img
              src={profile.avatar}
              alt={`${profile.username} avatar`}
              className="h-24 w-24 rounded-full border-2 border-gray-600"
            />
          ) : (
            <div className="h-16 w-16 rounded-full bg-gray-600" />
          )}
          <h2 className="mt-2 text-center text-lg font-semibold text-white">
            {profile.name || profile.username}{' '}
            {flagEmoji && <span className="text-xl">{flagEmoji}</span>}
          </h2>
        </div>

        {/* Confirmation */}
        <p className="mb-6 text-center text-sm text-gray-300">
          You’re signing in as{' '}
          <span className="font-medium">@{profile.username}</span>. Continue?
        </p>

        {/* Actions */}
        <div className="flex justify-end space-x-4">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm text-gray-300 hover:text-white focus:outline-none"
          >
            Not me
          </button>
          <button
            onClick={onConfirm}
            className="rounded-full bg-green-500 px-5 py-2 text-sm font-semibold text-white hover:bg-green-600 focus:outline-none"
          >
            Yes, continue
          </button>
        </div>
      </div>
    </div>
  );
}
