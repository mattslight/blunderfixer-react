// src/pages/drills/components/TimePhaseHeader.tsx
import { formatDistanceToNow, parseISO } from 'date-fns';
import { Clock } from 'lucide-react';

type Props = {
  playedAt: string;
  displayPhase: string;
  phaseColor: string;
};

export function TimePhaseHeader({ playedAt, displayPhase, phaseColor }: Props) {
  const formatted = formatDistanceToNow(parseISO(playedAt), {
    addSuffix: true,
  }).replace(/^about\s*/, '');
  return (
    <div className="flex items-center justify-between text-xs text-stone-500">
      <time dateTime={playedAt}>
        <Clock className="relative bottom-0.25 mr-1 inline h-3 w-3" />
        {formatted}
      </time>
      <span
        className={`rounded px-2 py-0.5 text-xs font-semibold text-stone-300 ${phaseColor}`}
      >
        {displayPhase}
      </span>
    </div>
  );
}
