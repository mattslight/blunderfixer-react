import UsernameInput from '@/components/UsernameInput';
import { useUsername } from '@/hooks/useUsername';
export default function Help() {
  const { username, setUsername } = useUsername();

  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <h1 className="mb-4 text-4xl font-bold">Settings</h1>
      <p className="text-lg">This is the Settings page.</p>
      <div>
        <UsernameInput username={username} onUsernameChange={setUsername} />
      </div>
    </div>
  );
}
