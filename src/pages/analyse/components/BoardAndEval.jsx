// src/pages/analyse/components/BoardAndEval.jsx
import { Chessboard } from 'react-chessboard';

import EvalBar from './EvalBar';
import ExamplePositions from './ExamplePositions';
import MoveLines from './MoveLines';
import MoveStepper from './MoveStepper';

export default function BoardAndEval({
  fen,
  lines,
  arrows,
  moveSquares,
  currentDepth,
  evalScore,

  moveList,
  currentIdx,
  setCurrentIdx,
  onPieceDrop, // ← pulled in here

  onSquareClick,
  showPromotionDialog,
  moveTo,
  onPromotionPieceSelect,
  optionSquares,

  setPGN, // for example‐position picker
}) {
  // 1) If no FEN yet, show your examples picker
  if (!fen) {
    return (
      <div className="p-4">
        <ExamplePositions onPickFEN={(f) => setPGN(`[FEN "${f}"]\n\n`)} />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center space-y-3">
      {/* 2) MoveStepper navigation */}
      <div className="w-full max-w-lg">
        <MoveStepper
          moveList={moveList}
          currentIdx={currentIdx}
          setCurrentIdx={setCurrentIdx}
        />
      </div>
      {/* <-- zero-gap flex container --> */}
      <div className="flex w-full max-w-lg items-stretch gap-0">
        <div className="flex-1">
          <Chessboard
            position={fen}
            onSquareClick={onSquareClick}
            showPromotionDialog={showPromotionDialog}
            promotionToSquare={moveTo}
            onPromotionPieceSelect={onPromotionPieceSelect}
            customSquareStyles={{
              ...moveSquares,
              ...optionSquares,
            }}
            onPromotionCheck={(src, dst, piece) =>
              piece[1] === 'P' && (dst[1] === '8' || dst[1] === '1')
            }
            onPieceDrop={onPieceDrop}
            customArrows={arrows}
            customBoardStyle={{
              boxShadow: `0 4px 12px rgba(0,0,0,0.35),
                        inset 0 0 4px rgba(0,0,0,0.15)`,
            }}
            customDarkSquareStyle={{
              backgroundColor: 'rgb(177,183,200)',
            }}
            customLightSquareStyle={{
              backgroundColor: 'rgb(245,242,230)',
              mixBlendMode: 'multiply',
            }}
          />
        </div>

        {/* EvalBar sits flush to the right, no margin/padding */}
        <EvalBar score={evalScore} className="w-4" />
      </div>

      {/* 4) Engine continuation lines */}
      <div className="w-full max-w-lg">
        <MoveLines lines={lines} currentDepth={currentDepth} />
      </div>
    </div>
  );
}
