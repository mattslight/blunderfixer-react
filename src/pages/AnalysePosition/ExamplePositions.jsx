export default function ExamplePositions({ setFEN, setBoardFEN }) {
  return (
    <div>
      <h2 className="mb-1 text-sm font-semibold">Example Positions</h2>
      <div className="flex flex-wrap gap-2">
        {[
          [
            'Sicilian-ish 🏁',
            'r1bqkbnr/pp1p1ppp/2n5/2p1p3/4P3/2P2N2/PP1P1PPP/RNBQKB1R w KQkq - 2 4',
          ],
          [
            'Simple tactic 🎯',
            '4kb1r/p4ppp/4q3/8/8/1B6/PPP2PPP/2KR4 w - - 0 1',
          ],
          ['One move ⚔️', '5k1r/2q3p1/p3p2p/1B3p1Q/n4P2/6P1/bbP2N1P/1K1RR3'],
          [
            'Fried Liver 🗡️',
            'r1bqkb1r/ppp2Npp/2n5/3np3/2B5/8/PPPP1PPP/RNBQK2R b KQkq - 0 6',
          ],
          [
            'Berlin 🧐',
            'r1bq1bnr/ppp2kpp/2p5/4np2/4P3/8/PPPP1PPP/RNBQ1RK1 w - - 0 9',
          ],
          [
            'Engine Stress 🤯',
            'qrb5/rk1p1K2/p2P4/Pp6/1N2n3/6p1/5nB1/6b1 w - - 0 1',
          ],
          [
            'Nimzo-Indian ♞',
            'rnbqk2r/pppp1ppp/4pn2/8/1bPP4/2N5/PP2PPPP/R1BQKBNR w KQkq - 0 4',
          ],
        ].map(([label, fenStr]) => (
          <button
            key={fenStr}
            onClick={() => {
              setFEN(fenStr);
              setBoardFEN(fenStr);
            }}
            className="rounded bg-gray-200 px-2 py-1 text-xs hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
