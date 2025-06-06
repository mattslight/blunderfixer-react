export default function MoveLines({ lines, currentDepth: _currentDepth }) {
  return (
    <div className="rounded bg-stone-800 p-2">
      <div className="space-y-1">
        {lines
          .filter((l) => l.moves.length > 0)
          .map((l) => {
            // 1) Mate formatting
            let display;
            let advantageSide = 'w';
            if (typeof l.mateIn === 'number') {
              const n = Math.abs(l.mateIn);
              display = `M${n}`;
              advantageSide = l.mateIn > 0 ? 'w' : 'b';
            }
            // 2) Otherwise centipawns (already normalized in your hook)
            else if (typeof l.scoreCP === 'number') {
              const sign = l.scoreCP >= 0 ? '+' : '';
              advantageSide = l.scoreCP >= 0 ? 'w' : 'b';
              display = `${sign}${(l.scoreCP / 100).toFixed(2)}`;
            }

            // pick pill colors by sign
            const pillClasses =
              advantageSide === 'w'
                ? 'bg-white text-black'
                : 'bg-black text-white';
            return (
              <div
                key={l.rank}
                className="no-scrollbar flex overflow-x-auto text-sm whitespace-nowrap text-stone-200"
              >
                <span className="min-w-[2rem] shrink-0 font-semibold text-stone-500">
                  #{l.rank}
                </span>
                <span className="flex-1 truncate text-stone-400">
                  {l.moves.join(' → ')}
                </span>
                <span className="ml-2 shrink-0 text-stone-400">
                  <b className={`${pillClasses} rounded px-1`}>{display}</b>
                </span>
              </div>
            );
          })}
      </div>
    </div>
  );
}
