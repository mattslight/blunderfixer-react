import { JSX } from 'react';
import { CalendarClock, TimerReset } from 'lucide-react';

import blitzIcon from '@/assets/blitz.png';
import bulletIcon from '@/assets/bullet.png';
import { TIME_ORDER } from '@/const/phase';
import { type TimeClass, useChessComRatings } from '@/hooks/useChessComRatings';

const icons: Record<TimeClass, JSX.Element> = {
  bullet: (
    <img src={bulletIcon} alt="bullet" className="inline h-6 bg-transparent" />
  ),
  blitz: (
    <img src={blitzIcon} alt="blitz" className="inline h-6 bg-transparent" />
  ),
  rapid: <TimerReset className="mb-1 inline h-5 bg-transparent" />,
  daily: <CalendarClock className="mb-1 inline h-5 bg-transparent" />,
};

export default function EloDisplay() {
  const { rating, delta, timeClass, setTimeClass, preferred } =
    useChessComRatings();

  const sortedPreferred = [...preferred].sort(
    (a, b) => TIME_ORDER.indexOf(a) - TIME_ORDER.indexOf(b)
  );

  return (
    <div className="flex w-full max-w-md flex-col items-center p-4">
      <div className="mx-auto mt-4 flex w-64 items-center justify-between rounded">
        <div className="relative flex flex-col" title="Chess.com rating">
          <div className="flex items-baseline space-x-2 text-white">
            <span className="text-2xl font-bold">
              {rating !== null ? rating : '--'}
            </span>
            <span className="text-sm font-medium">Elo</span>

            {delta !== null && (
              <span
                className={`text-sm ${delta >= 0 ? 'text-green-400' : 'text-red-400'}`}
              >
                {delta >= 0 ? '+' : ''}
                {delta}
              </span>
            )}
          </div>
        </div>
        {preferred.length > 1 && (
          <div className="flex space-x-2">
            {sortedPreferred.map((tc) => (
              <button
                key={tc}
                onClick={() => setTimeClass(tc)}
                className={`rounded p-1 ${
                  tc === timeClass
                    ? 'bg-stone-700 text-white'
                    : 'text-white opacity-50'
                }`}
                title={tc.charAt(0).toUpperCase() + tc.slice(1)}
                aria-label={tc}
              >
                {icons[tc]}
              </button>
            ))}
          </div>
        )}
      </div>
      <RecentForm timeClass={timeClass} />
    </div>
  );
}

type Props = {
  timeClass: TimeClass;
};

function RecentForm({ timeClass }: Props) {
  const formByTimeClass: Record<TimeClass, string[]> = {
    bullet: ['win', 'loss', 'win', 'win', 'draw'],
    blitz: ['loss', 'loss', 'win', 'draw', 'win'],
    rapid: ['draw', 'win', 'win', 'loss', 'loss'],
    daily: ['win', 'draw', 'draw', 'win', 'loss'],
  };

  const form = formByTimeClass[timeClass] || [];

  return (
    <div className="flex w-full items-center justify-center space-x-2 py-2 text-sm text-stone-400">
      <span className="font-medium capitalize">{timeClass} form</span>
      <div className="flex space-x-1">
        {form.map((f, i) => {
          let bg = 'bg-stone-500';
          if (f === 'win') bg = 'bg-green-600';
          else if (f === 'loss') bg = 'bg-red-600';
          return <div key={i} className={`${bg} h-2 w-2 rounded-full`} />;
        })}
      </div>
    </div>
  );
}
