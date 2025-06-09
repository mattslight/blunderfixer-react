import { JSX, useRef } from 'react';
import { CalendarClock, TimerReset } from 'lucide-react';

import blitzIcon from '@/assets/blitz.png';
import bulletIcon from '@/assets/bullet.png';
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

  const touchStartX = useRef<number | null>(null);
  const lastTrigger = useRef(0);
  const cooldown = 700; // ms

  const cycleTimeClass = (dir: 'left' | 'right') => {
    const index = preferred.indexOf(timeClass);
    if (index === -1) return;
    const nextIndex =
      dir === 'left'
        ? (index + 1) % preferred.length
        : (index - 1 + preferred.length) % preferred.length;
    setTimeClass(preferred[nextIndex]);
  };

  return (
    <div
      className="mt-4 flex items-center justify-between rounded bg-stone-800 px-4 py-3"
      onWheel={(e) => {
        const now = Date.now();
        const threshold = 5;

        if (Math.abs(e.deltaX) < threshold) return;

        if (now - lastTrigger.current > cooldown) {
          cycleTimeClass(e.deltaX > 0 ? 'left' : 'right');
          lastTrigger.current = now;
        }
      }}
      onTouchStart={(e) => (touchStartX.current = e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (touchStartX.current === null) return;
        const diff = e.changedTouches[0].clientX - touchStartX.current;
        if (Math.abs(diff) > 30) {
          cycleTimeClass(diff < 0 ? 'left' : 'right');
        }
        touchStartX.current = null;
      }}
    >
      <div className="relative flex flex-col">
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
          {preferred.map((tc) => (
            <button
              key={tc}
              onClick={() => setTimeClass(tc)}
              className={`rounded p-1 ${
                tc === timeClass
                  ? 'bg-stone-700 text-white'
                  : 'text-white opacity-50'
              }`}
              title={tc.charAt(0).toUpperCase() + tc.slice(1)}
            >
              {icons[tc]}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
