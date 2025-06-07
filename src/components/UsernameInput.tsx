// src/components/UsernameInput.tsx
interface Props {
  username: string;
  onUsernameChange: (u: string) => void;
  id: string;
}

export default function UsernameInput({ username, onUsernameChange }: Props) {
  return (
    <div className="mb-4">
      <input
        type="text"
        value={username}
        onChange={(e) => onUsernameChange(e.target.value)}
        className="w-full rounded border border-stone-600 bg-stone-800 px-2 py-1 text-white"
        placeholder="Enter your username…"
      />
    </div>
  );
}
