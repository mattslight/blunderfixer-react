import { formatDistanceToNow, parseISO } from 'date-fns';
import { Tooltip } from 'flowbite-react';
import { Check, X } from 'lucide-react';

type HistoryDotsProps = {
  history: HistoryEntry[];
};

type HistoryEntry = {
  result: 'pass' | 'fail';
  reason?: string | null;
  timestamp: string; // ISO date string
};

export function HistoryDots({ history }: HistoryDotsProps) {
  // we need to sort the history by played_at in descending order
  history.sort((a, b) => {
    const dateA = new Date(a.timestamp).getTime();
    const dateB = new Date(b.timestamp).getTime();
    return dateB - dateA; // Sort descending
  });
  const padded: (HistoryEntry | null)[] = [...history].slice(0, 5);
  // now reverse the order to show most recent first
  padded.reverse();
  while (padded.length < 5) padded.push(null);

  return (
    <div className="flex items-center gap-1">
      {padded.map((entry, idx) => {
        const formattedTimestamp = formatDistanceToNow(
          parseISO(entry.timestamp),
          {
            addSuffix: true,
          }
        ).replace(/^about\s*/, '');

        const tooltipContent = (
          <>
            <span className="text-green-400">{formattedTimestamp}</span>
            <br />
            {entry.reason}
          </>
        );
        if (entry?.result === 'pass') {
          return (
            <Tooltip key={idx} content={tooltipContent}>
              <div className="flex h-4 w-4 items-center justify-center rounded-full bg-gray-300 text-gray-800">
                <Check className="h-2.5 w-2.5" strokeWidth={3} />
              </div>
            </Tooltip>
          );
        } else if (entry?.result === 'fail') {
          return (
            <Tooltip key={idx} content={tooltipContent}>
              <div className="flex h-4 w-4 items-center justify-center rounded-full border border-gray-300 text-gray-300">
                <X className="h-2.5 w-2.5" strokeWidth={3} />
              </div>
            </Tooltip>
          );
        } else {
          return (
            <div
              key={idx}
              className="h-4 w-4 rounded-full border border-gray-600 bg-transparent"
            />
          );
        }
      })}
    </div>
  );
}
