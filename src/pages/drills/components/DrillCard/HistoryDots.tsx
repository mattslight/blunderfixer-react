import { formatDistanceToNow, parseISO } from 'date-fns';
import { Tooltip } from 'flowbite-react';
import { Check, X } from 'lucide-react';

type HistoryEntry = {
  result: 'pass' | 'fail';
  reason?: string | null;
  timestamp: string; // ISO date
};

type HistoryDotsProps = {
  history: HistoryEntry[];
};

export function HistoryDots({ history }: HistoryDotsProps) {
  // Sort descending by timestamp
  history.sort((a, b) => {
    return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
  });

  // Take up to 5 most recent, then reverse so newest is rightmost
  const padded: (HistoryEntry | null)[] = history.slice(0, 5).reverse();
  while (padded.length < 5) padded.push(null);

  return (
    <div className="flex items-center gap-1">
      {padded.map((entry, idx) => {
        if (!entry) {
          // Empty circle for missing entries
          return (
            <div
              key={idx}
              className="h-4 w-4 rounded-full border border-gray-600 bg-transparent"
            />
          );
        }

        // Only format timestamp and build tooltip if `entry` is not null
        const formattedTimestamp = formatDistanceToNow(
          parseISO(entry.timestamp),
          { addSuffix: true }
        ).replace(/^about\s*/, '');

        const tooltipContent = (
          <>
            <span className="text-green-400">{formattedTimestamp}</span>
            <br />
            {entry.reason}
          </>
        );

        if (entry.result === 'pass') {
          return (
            <Tooltip key={idx} content={tooltipContent}>
              <div className="flex h-4 w-4 items-center justify-center rounded-full bg-gray-300 text-gray-800">
                <Check className="h-2.5 w-2.5" strokeWidth={3} />
              </div>
            </Tooltip>
          );
        } else {
          // entry.result === 'fail'
          return (
            <Tooltip key={idx} content={tooltipContent}>
              <div className="flex h-4 w-4 items-center justify-center rounded-full border border-gray-300 text-gray-300">
                <X className="h-2.5 w-2.5" strokeWidth={3} />
              </div>
            </Tooltip>
          );
        }
      })}
    </div>
  );
}
