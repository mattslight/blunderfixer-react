// src/pages/settings/index.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { Gem, MapPin, Table, Users } from 'lucide-react';

import UsernameInput from '@/components/UsernameInput';
import { useDebounce } from '@/hooks/useDebounce';
import { useProfile } from '@/hooks/useProfile';

export default function Settings() {
  const { profile, setUsername } = useProfile();
  const navigate = useNavigate();
  // Local input state
  const [localUsername, setLocalUsername] = useState(profile.username);

  // Whenever the real profile username changes (e.g. on load or outside),
  // keep the input in sync
  useEffect(() => {
    setLocalUsername(profile.username);
  }, [profile.username]);

  // Debounce the localUsername
  const debounced = useDebounce(localUsername, 500);

  // When the debounced value differs and is non-empty, update the profile
  useEffect(() => {
    if (debounced && debounced !== profile.username) {
      setUsername(debounced);
    }
  }, [debounced, profile.username, setUsername]);

  // derive flag emoji
  const countryCode = profile.country?.split('/').pop()?.toUpperCase() || '';
  const flagEmoji = countryCode
    ? countryCode
        .split('')
        .map((c) => String.fromCodePoint(c.charCodeAt(0) + 127397))
        .join('')
    : '';

  return (
    <div className="flex min-h-screen items-start justify-center bg-stone-900 p-4 sm:p-6">
      <div className="absolute top-16 left-4 md:hidden">
        <button
          onClick={() => navigate(-1)}
          className="whitespace-pre text-blue-600 hover:underline"
        >
          ← Back
        </button>
      </div>
      <div className="mt-10 w-full max-w-2xl rounded-2xl border border-stone-700 bg-black/80 p-6 shadow-lg">
        <h1 className="mb-2 text-3xl font-bold text-white">Settings</h1>
        <p className="mb-6 text-lg text-stone-400">
          Manage your Chess.com connection and profile
        </p>

        <div className="mb-6 flex items-center space-x-4">
          {profile.avatar ? (
            <img
              src={profile.avatar}
              alt={`${profile.username} avatar`}
              className="h-18 w-18 rounded-full border border-stone-600"
            />
          ) : (
            <div className="h-12 w-12 rounded-full bg-stone-600" />
          )}
          <div className="mb-1">
            <p className="flex items-center text-lg text-white">
              {/* Chess title */}
              {profile.title && (
                <span className="mr-2 rounded-full bg-indigo-600 px-2 py-1 text-xs font-semibold text-white">
                  {profile.title}
                </span>
              )}
              {profile.name || profile.username}
              {flagEmoji && <span className="ml-2 text-xl">{flagEmoji}</span>}
            </p>
            <p className="text-sm text-stone-500">@{profile.username}</p>
            {/* Location */}
            {profile.location && (
              <p className="mt-1 flex items-center text-xs text-stone-400">
                <MapPin className="mr-1 h-4 w-4" />
                {profile.location}
              </p>
            )}
          </div>
        </div>

        {/* � cool profile info � */}
        <div className="mb-4 flex flex-wrap items-center gap-3 text-sm text-stone-400">
          {/* Followers */}
          {typeof profile.followers === 'number' && (
            <span className="inline-flex items-center gap-1 text-sm text-stone-400">
              <Users /> {profile.followers.toLocaleString()} followers
            </span>
          )}

          {/* Chess.com Premium badge */}
          {profile.status === 'premium' && (
            <span className="inline-flex items-center gap-1 rounded-full bg-blue-500 px-3 py-1.5 text-xs font-semibold text-white">
              <Gem className="h-4 w-4" /> Chess.com Premium
            </span>
          )}

          {/* League */}
          {profile.league && (
            <span className="inline-flex rounded-full bg-amber-500 px-3 py-1.5 text-xs font-semibold text-white">
              <Table className="mr-1 h-4 w-4" />
              {profile.league} league
            </span>
          )}
        </div>

        {/* � join/last?online metadata � */}
        <div className="mb-6 space-y-1 text-xs text-stone-500">
          {profile.joined && (
            <div>
              Joined {new Date(profile.joined * 1000).toLocaleDateString()}
            </div>
          )}
          {profile.last_online && (
            <div className="text-xs text-stone-500">
              Last online{' '}
              {formatDistanceToNow(new Date(profile.last_online * 1000), {
                addSuffix: true,
              })}
            </div>
          )}
        </div>

        <label
          htmlFor="username"
          className="mb-1 block text-sm font-medium text-stone-200"
        >
          Chess.com Username
        </label>
        <UsernameInput
          id="username"
          username={localUsername}
          onUsernameChange={setLocalUsername}
        />
        <p className="mt-1 text-xs text-stone-500">
          Enter a new handle to refresh your profile data.
        </p>
      </div>
    </div>
  );
}
