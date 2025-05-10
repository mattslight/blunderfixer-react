// src/pages/home/ConfirmModal.tsx
import { formatDistanceToNow } from 'date-fns';
import { Clock, MapPin, X } from 'lucide-react';
import { useEffect, useRef } from 'react';

interface ConfirmModalProps {
  show: boolean;
  profile: {
    username: string;
    name?: string;
    avatar?: string;
    country?: string; // e.g. https://api.chess.com/pub/country/US
    location?: string; // free-text location from API
    last_online?: number;
    last_played?: number;
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

  const lastActivityTime = Math.max(profile.last_online, profile.last_played);

  // Prevent scrolling when open
  useEffect(() => {
    document.body.classList.toggle('overflow-hidden', show);
    return () => document.body.classList.remove('overflow-hidden');
  }, [show]);

  if (!show) return null;

  // Derive flag emoji
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
        className="relative w-full max-w-md scale-95 transform rounded-xl border border-gray-700 bg-black/80 p-6 shadow-xl transition duration-150 ease-out md:scale-100"
      >
        {/* Close button */}
        <button
          onClick={onCancel}
          aria-label="Close"
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          <X size={20} />
        </button>

        <div className="space-y-2 text-center">
          {/* Avatar */}
          <div>
            {profile.avatar ? (
              <img
                src={profile.avatar}
                alt={`${profile.username} avatar`}
                className="mx-auto h-24 w-24 rounded-full border-2 border-gray-600"
              />
            ) : (
              <div className="mx-auto h-24 w-24 rounded-full bg-gray-600" />
            )}
          </div>

          <div>
            {/* Name + Flag */}
            <h2 className="text-lg font-semibold text-white">
              {profile.name || profile.username}{' '}
              {flagEmoji && <span className="text-xl">{flagEmoji}</span>}
            </h2>

            {/* Location */}
            {profile.location && (
              <div className="flex items-center justify-center space-x-1 text-sm text-gray-400">
                <MapPin className="h-4 w-4" />
                <span>{profile.location}</span>
              </div>
            )}
          </div>

          {/* Last seen */}
          {profile.last_online && (
            <div className="flex items-center justify-center space-x-1 text-sm text-gray-400">
              <Clock className="h-4 w-4" />
              <span>
                Last seen{' '}
                {formatDistanceToNow(new Date(lastActivityTime * 1000), {
                  addSuffix: true,
                })}
              </span>
            </div>
          )}

          {/* Actions */}
          <div className="mt-8 flex justify-between space-x-4 pt-2">
            <button
              onClick={onCancel}
              className="px-4 py-2 text-sm whitespace-pre text-gray-300 hover:text-white focus:outline-none"
            >
              Not me
            </button>
            <button
              onClick={onConfirm}
              className="rounded-full bg-green-500 px-5 py-2 text-sm font-semibold text-white hover:bg-green-600 focus:outline-none"
            >
              Continue as @{profile.username}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
