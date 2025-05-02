export default function MoveLines({ lines, currentDepth }) {
  return (
    <div>
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
          .map((l) => (
            <div
              key={l.rank}
              className="no-scrollbar flex overflow-x-auto text-sm whitespace-nowrap text-gray-200"
            >
              <span className="min-w-[3rem] shrink-0 text-gray-500">
                #{l.rank}
              </span>
              <span className="flex-1 truncate">{l.moves.join(' → ')}</span>
              <span className="ml-2 shrink-0 text-gray-400">
                <b>
                  {l.scoreCP != null
                    ? (l.scoreCP / 100).toFixed(2)
                    : `#${l.mateIn}`}
                </b>
              </span>
            </div>
          ))}
      </div>
    </div>
  );
}
