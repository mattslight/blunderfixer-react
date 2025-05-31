import { Check, X } from 'lucide-react';

type HistoryDotsProps = {
  history: Array<'win' | 'loss'>;
};

export function HistoryDots({ history }: HistoryDotsProps) {
  const padded: Array<'win' | 'loss' | null> = [...history].slice(0, 5);
  while (padded.length < 5) padded.push(null);

  return (
    <div className="flex items-center gap-1">
      {padded.map((res, idx) => {
        if (res === 'win') {
          return (
            <div
              key={idx}
              className="xs:h-4 xs:w-4 flex h-5 w-5 items-center justify-center rounded-full bg-gray-300 text-gray-800 sm:h-5 sm:w-5"
            >
              <Check className="h-2.5 w-2.5" strokeWidth={3} />
            </div>
          );
        } else if (res === 'loss') {
          return (
            <div
              key={idx}
              className="xs:h-4 xs:w-4 flex h-5 w-5 items-center justify-center rounded-full border border-gray-300 text-gray-300 sm:h-5 sm:w-5"
            >
              <X className="h-2.5 w-2.5" strokeWidth={3} />
            </div>
          );
        } else {
          return (
            <div
              key={idx}
              className="xs:h-4 xs:w-4 h-5 w-5 rounded-full border border-gray-600 bg-transparent sm:h-5 sm:w-5"
            />
          );
        }
      })}
    </div>
  );
}
