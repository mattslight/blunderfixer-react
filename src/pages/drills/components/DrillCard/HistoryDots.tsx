import { formatDistanceToNow, parseISO } from 'date-fns';
import { Tooltip } from 'flowbite-react';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, X } from 'lucide-react';
import type { ReactElement } from 'react';

type HistoryEntry = {
  result: 'pass' | 'fail';
  reason?: string | null;
  timestamp: string; // ISO date
};

type HistoryDotsProps = {
  history: HistoryEntry[];
};

export function HistoryDots({ history }: HistoryDotsProps) {
  // 1) Make a _copy_ and sort descending by timestamp
  const sorted = [...history].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  // 2) Take up to 5 most recent, then reverse so that the newest is on the right
  const padded: (HistoryEntry | null)[] = sorted.slice(0, 5).reverse();
  while (padded.length < 5) padded.push(null);

  return (
    <div className="flex items-center gap-1">
      <AnimatePresence initial={false}>
        {padded.map((entry, idx) => {
          // 3) Build a stable key: use timestamp for real entries, or `empty-<idx>`
          const key = entry ? entry.timestamp : `empty-${idx}`;

          // 4) Pre‐compute tooltip content / dot‐styles
          let dotContent: ReactElement;
          if (!entry) {
            dotContent = (
              <div className="h-4 w-4 rounded-full border border-stone-600 bg-transparent" />
            );
          } else {
            const formattedDistance = formatDistanceToNow(
              parseISO(entry.timestamp),
              { addSuffix: true }
            ).replace(/^about\s*/, '');

            const tooltipContent = (
              <>
                <span className="text-green-400">{formattedDistance}</span>
                <br />
                {entry.reason}
              </>
            );

            if (entry.result === 'pass') {
              dotContent = (
                <Tooltip content={tooltipContent} key={key}>
                  <div className="flex h-4 w-4 items-center justify-center rounded-full bg-stone-300 text-stone-800">
                    <Check className="h-2.5 w-2.5" strokeWidth={3} />
                  </div>
                </Tooltip>
              );
            } else {
              dotContent = (
                <Tooltip content={tooltipContent} key={key}>
                  <div className="flex h-4 w-4 items-center justify-center rounded-full border border-stone-300 text-stone-300">
                    <X className="h-2.5 w-2.5" strokeWidth={3} />
                  </div>
                </Tooltip>
              );
            }
          }

          // 5) Wrap each dot in a motion.div
          return (
            <motion.div
              key={key}
              layout
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              {dotContent}
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
