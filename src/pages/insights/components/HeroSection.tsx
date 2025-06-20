import { JSX } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, User } from 'lucide-react';

interface Props {
  username: string;
  nextDrillId?: number | string;
  greeting: string | JSX.Element;
}

export default function HeroSection({
  username,
  nextDrillId,
  greeting,
}: Props) {
  const navigate = useNavigate();

  return (
    <header className="mb-4 space-y-1 rounded-lg bg-stone-900/60 py-2 text-stone-300 shadow-inner">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-white">
          Hello {username} 👋
        </h1>
        <div className="flex items-center gap-3"></div>
      </div>
      <p className="text-base leading-tight text-stone-400">{greeting}</p>
      <div className="flex flex-row space-x-4">
        <button
          onClick={() =>
            navigate(nextDrillId ? `/drills/play/${nextDrillId}` : '/drills')
          }
          className="mt-8 rounded bg-green-600 px-5 py-3 text-sm font-semibold text-white hover:bg-green-700"
        >
          Start Fixing{' '}
          <Play className="relative bottom-0.25 ml-1 inline h-4 w-4" />
        </button>
        <button
          onClick={() => navigate('/profile')}
          className="mt-8 rounded bg-indigo-600 px-5 py-3 text-sm font-semibold text-white hover:bg-indigo-700"
        >
          Profile
        </button>
      </div>
    </header>
  );
}
