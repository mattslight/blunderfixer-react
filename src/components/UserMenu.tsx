// src/components/UserMenu.tsx
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, LogOut, UserPen } from 'lucide-react';

import { useProfile } from '@/hooks/useProfile';
export default function UserMenu() {
  const { profile, setUsername } = useProfile();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Close dropdown on outside click
  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  // derive flag emoji
  const countryCode = profile.country?.split('/').pop()?.toUpperCase() || '';
  const flagEmoji = countryCode
    ? countryCode
        .split('')
        .map((c) => String.fromCodePoint(c.charCodeAt(0) + 127397))
        .join('')
    : '';

  return (
    <div className="relative inline-block text-left" ref={menuRef}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center rounded-full bg-stone-800 p-1 focus:ring-2 focus:ring-stone-300 focus:outline-none"
        aria-haspopup="true"
        aria-expanded={open}
      >
        <span className="sr-only">Open user menu</span>
        <img
          className="h-8 w-8 rounded-full"
          src={profile.avatar || '/default-avatar.png'}
          alt={profile.name || profile.username}
        />
        <ChevronDown className="ml-1 h-4 w-4 text-stone-400" />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-56 origin-top-right rounded-xl border border-stone-800 bg-black/90 shadow-lg backdrop-blur-lg">
          <div className="px-4 py-3 text-center">
            <div className="flex items-center justify-center">
              {profile.avatar ? (
                <img
                  src={profile.avatar}
                  alt={profile.name || profile.username}
                  className="h-10 w-10 rounded-full border border-stone-600"
                />
              ) : (
                <div className="h-10 w-10 rounded-full bg-stone-600" />
              )}
            </div>
            <p className="mt-2 text-white">
              {profile.name || profile.username}{' '}
              {flagEmoji && <span className="ml-1">{flagEmoji}</span>}
            </p>
            <p className="text-xs text-stone-400">@{profile.username}</p>
          </div>
          <div className="divide-y divide-stone-700">
            <ul className="py-1 text-stone-300">
              <li>
                <button
                  onClick={() => {
                    setOpen(false);
                    navigate('/settings');
                  }}
                  className="flex w-full items-center px-4 py-2 text-sm hover:bg-stone-700"
                >
                  {' '}
                  <UserPen className="mr-2 h-5 w-5" />
                  Profile & Settings
                </button>
              </li>
              {/* <li>
                <button
                  onClick={() => {
                    setOpen(false);
                    navigate('/settings');
                  }}
                  className="flex w-full items-center px-4 py-2 text-sm hover:bg-stone-700"
                >
                  Account settings
                </button>
              </li> */}
            </ul>
            <ul className="py-1 text-stone-300">
              <li>
                <button
                  onClick={() => {
                    // clear profile and redirect to home/login
                    setUsername('');
                    setOpen(false);
                  }}
                  className="flex w-full items-center px-4 py-2 text-sm hover:bg-stone-700"
                >
                  <LogOut className="mr-2 h-5 w-5" />
                  Sign out
                </button>
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
