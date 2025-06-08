import { Clock, Crosshair, Zap } from 'lucide-react';
import type { JSX } from 'react';

import { type TimeClass, useChessComRatings } from '@/hooks/useChessComRatings';

const icons: Record<TimeClass, JSX.Element> = {
  bullet: <Crosshair className="inline h-5 w-5" />,
  blitz: <Zap className="inline h-5 w-5" />,
  rapid: <Clock className="inline h-5 w-5" />,
};

export default function EloDisplay() {
  const { rating, delta, timeClass, setTimeClass } = useChessComRatings();

  return (
    <div className="mt-4 flex items-center justify-between rounded bg-stone-800 px-4 py-3">
      <div className="flex items-baseline space-x-2 text-white">
        {icons[timeClass]}
        <span className="text-2xl font-bold">
          {rating !== null ? rating : '--'}
        </span>
        {delta !== null && (
          <span
            className={`text-sm ${delta >= 0 ? 'text-green-400' : 'text-red-400'}`}
          >
            {delta >= 0 ? '+' : ''}
            {delta}
          </span>
        )}
      </div>
      <div className="flex space-x-2">
        {(['bullet', 'blitz', 'rapid'] as TimeClass[]).map((tc) => (
          <button
            key={tc}
            onClick={() => setTimeClass(tc)}
            className={`rounded p-1 ${
              tc === timeClass ? 'bg-stone-700 text-white' : 'text-stone-400'
            }`}
            title={tc.charAt(0).toUpperCase() + tc.slice(1)}
          >
            {icons[tc]}
          </button>
        ))}
      </div>
    </div>
  );
}
