import { JSX } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play } from 'lucide-react';

import EloDisplay from '@/components/EloDisplay';

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
    <header>
      <h1 className="text-3xl leading-[1.1] font-bold text-stone-100">
        Welcome back{username ? `, ${username}` : ''}!
      </h1>
      <p className="mt-1 text-sm leading-snug text-stone-400">{greeting}</p>
      <div className="mt-6 flex justify-start">
        <button
          onClick={() =>
            navigate(nextDrillId ? `/drills/play/${nextDrillId}` : '/drills')
          }
          className="rounded bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700"
        >
          Next Drill{' '}
          <Play className="relative bottom-0.25 ml-1 inline h-4 w-4" />
        </button>
      </div>
      <div className="mt-8">
        <EloDisplay />
      </div>
    </header>
  );
}
