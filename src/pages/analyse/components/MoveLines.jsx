export default function MoveLines({ lines, currentDepth }) {
  return (
    <div className="rounded bg-gray-800 p-2">
      <div className="flex flex-row items-center justify-between text-sm text-gray-400">
        <div>
          <b>Best continuations</b>
        </div>
        <div className="text-xs text-gray-500">
          (<i>depth {currentDepth}</i>)
        </div>
      </div>
      <div className="mt-2 space-y-1">
        {lines
          .filter((l) => l.moves.length > 0)
          .map((l) => {
            // 1) Mate formatting
            let display;
            if (typeof l.mateIn === 'number') {
              const n = Math.abs(l.mateIn);
              display = `${l.mateIn > 0 ? '+M' : '-M'}${n}`;
            }
            // 2) Otherwise centipawns (already normalized in your hook)
            else if (typeof l.scoreCP === 'number') {
              const sign = l.scoreCP >= 0 ? '+' : '';
              display = `${sign}${(l.scoreCP / 100).toFixed(2)}`;
            }

            // pick pill colors by sign
            const sign = display.charAt(0);
            const pillClasses =
              sign === '+' ? 'bg-white text-black' : 'bg-black text-white';
            return (
              <div
                key={l.rank}
                className="no-scrollbar flex overflow-x-auto text-sm whitespace-nowrap text-gray-200"
              >
                <span className="min-w-[2rem] shrink-0 font-semibold text-gray-500">
                  #{l.rank}
                </span>
                <span className="flex-1 truncate text-gray-400">
                  {l.moves.join(' → ')}
                </span>
                <span className="ml-2 shrink-0 text-gray-400">
                  <b className={`${pillClasses} rounded px-1`}>{display}</b>
                </span>
              </div>
            );
          })}
      </div>
    </div>
  );
}
