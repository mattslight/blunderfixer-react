// src/pages/home/CoachingBoard.jsx
import { Chessboard } from 'react-chessboard';

import coachImageSrc from '@/assets/coach.png';
export default function CoachingBoard({
  boardFEN = 'r1bqk2r/pppp1pp1/2n2n1p/2b1p3/P1B1P3/2N2N2/1PPP1PPP/R1BQK2R w KQkq - 0 1',
  boardWidth = 360,
}) {
  return (
    <div className="mx-auto grid max-w-4xl grid-cols-1 justify-items-center gap-8 rounded-2xl bg-black p-8 lg:grid-cols-2">
      {/* Left column: heading + board */}
      <div className="flex w-full flex-col items-center text-center lg:items-start lg:text-left">
        <h2 className="py-10 text-4xl font-bold tracking-tight text-white lg:pt-0">
          Every move.{' '}
          <span className="font-black text-green-400">Perfected.</span>
        </h2>

        {/* Now this wrapper really is full-width */}
        <div className="flex items-center justify-center">
          <Chessboard
            position={boardFEN}
            arePiecesDraggable={false}
            onPieceDrop={() => false}
            onSquareClick={() => {}}
            customBoardStyle={{
              borderRadius: '0.5em',
              boxShadow: '0 2px 10px rgba(0, 0, 0, 0.5)',
            }}
            customDarkSquareStyle={{
              backgroundColor: 'rgb(157,163,180)',
            }}
            customLightSquareStyle={{
              backgroundColor: 'rgb(245,242,230)',
              mixBlendMode: 'multiply',
            }}
            boardWidth={boardWidth}
            showBoardNotation={false}
          />
        </div>
      </div>

      {/* Right column: chat & coach */}
      <div className="flex flex-col items-center justify-between lg:items-start">
        {/* Chat bubbles */}
        <div className="w-full max-w-xs space-y-4">
          {/* Student bubble */}
          <div className="bg-opacity-80 relative rounded-xl bg-emerald-600 px-4 py-3 text-white lg:mt-30">
            <p className="font-semibold">
              Coach, I’m thinking d4 here — thoughts?
            </p>
            {/* tail */}
            <span className="absolute bottom-0 left-6 h-0 w-0 translate-y-full border-t-6 border-r-6 border-l-6 border-t-green-700 border-r-transparent border-l-transparent" />
          </div>

          {/* Coach reply bubble */}
          <div className="bg-opacity-80 relative rounded-xl bg-purple-700 px-4 py-3 text-white">
            <p className="font-semibold">
              Is there a move you can play that gets the king safe and prepares
              d4?
            </p>
            {/* tail */}
            <span className="absolute right-6 bottom-0 h-0 w-0 translate-y-full border-t-6 border-r-6 border-l-6 border-t-purple-700 border-r-transparent border-l-transparent" />
          </div>
        </div>

        {/* Coach image */}
        <img
          src={coachImageSrc}
          alt="Coach illustration"
          className="mt-8 -mb-8 w-64 self-center rounded-lg shadow-lg md:mt-0 md:self-end"
        />
      </div>
    </div>
  );
}
