// src/components/UsernameInput.tsx
interface Props {
  username: string;
  onUsernameChange: (u: string) => void;
}

export default function UsernameInput({ username, onUsernameChange }: Props) {
  return (
    <div className="mb-4">
      <label className="mb-1 block text-sm font-medium text-gray-200">
        Username
      </label>
      <input
        type="text"
        value={username}
        onChange={(e) => onUsernameChange(e.target.value)}
        className="w-full rounded border border-gray-600 bg-gray-800 px-2 py-1 text-white"
        placeholder="Enter your username…"
      />
    </div>
  );
}
