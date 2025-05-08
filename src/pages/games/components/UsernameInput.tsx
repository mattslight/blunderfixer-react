import { useState, useEffect } from 'react';

export default function UsernameInput({
  onUsernameChange,
}: {
  onUsernameChange?: (u: string) => void;
}) {
  const [username, setUsername] = useState<string>(
    () => localStorage.getItem('bf:username') || ''
  );

  // persist whenever it changes
  useEffect(() => {
    localStorage.setItem('bf:username', username);
    onUsernameChange?.(username);
  }, [username, onUsernameChange]);

  return (
    <div className="mb-4">
      <label className="mb-1 block text-sm font-medium text-gray-200">
        Username
      </label>
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="w-full rounded border border-gray-600 bg-gray-800 px-2 py-1 text-white"
        placeholder="Enter your username…"
      />
    </div>
  );
}
