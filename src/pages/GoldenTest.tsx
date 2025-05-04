import { Chessboard } from 'react-chessboard';
import type { ComponentProps } from 'react';

import useGameHistory from '@/hooks/useGameHistory';
import useMoveInput from '@/hooks/useMoveInput';
import EvalBar from './analyse/components/EvalBar';
import MoveStepper from './analyse/components/MoveStepper';

//Infer Chessboard’s props & grab `customArrows` type and the element type
type ChessboardProps = ComponentProps<typeof Chessboard>;
type ArrowArray = NonNullable<ChessboardProps['customArrows']>;
type Arrow = ArrowArray[number];

interface AnalysisBoardProps {
  initialFEN: string;
  bestLine: string; // e.g. “e2e4 e7e5 g1f3 …”
  positionEvaluation: number; // from engine
  arrows: Arrow[]; // [[from, to, color], …]
}

export default function AnalysisBoard({
  initialFEN,
  bestLine = '',
  positionEvaluation,
  arrows,
}: AnalysisBoardProps) {
  // 1) step through history & manage branching
  const { fen, moveHistory, currentIdx, setIdx, makeMove } =
    useGameHistory(initialFEN);

  // 2) click/drag input + promotion flow
  const {
    from,
    to,
    showPromo,
    options: optionSquares,
    onSquareClick,
    onPieceDrop,
    onPromotion,
  } = useMoveInput(fen, (from, to, promotion) => makeMove(from, to, promotion));

  // split bestLine into an array of SANs for the carousel
  const engineLines = bestLine.trim().split(' ');

  // wrap the board + eval in your layout (or drop in directly)
  return (
    <div className="flex flex-col items-center space-y-3">
      {/* 2) MoveStepper navigation */}
      <div className="w-full max-w-lg">
        <MoveStepper
          moveList={moveHistory}
          currentIdx={currentIdx}
          setCurrentIdx={setIdx}
        />
      </div>
      {/* zero-gap flex container*/}
      <div className="flex items-stretch gap-0">
        {/* 1) Board takes all remaining space */}
        <div className="h-116 w-116">
          <Chessboard
            position={fen}
            onSquareClick={onSquareClick}
            onPieceDrop={onPieceDrop}
            showPromotionDialog={showPromo}
            promotionToSquare={to!}
            onPromotionPieceSelect={onPromotion}
            customSquareStyles={optionSquares}
            customArrows={arrows}
            customBoardStyle={{
              boxShadow: `0 4px 12px rgba(0,0,0,0.35),
                          inset 0 0 4px rgba(0,0,0,0.15)`,
            }}
            customDarkSquareStyle={{ backgroundColor: 'rgb(177,183,200)' }}
            customLightSquareStyle={{
              backgroundColor: 'rgb(245,242,230)',
              mixBlendMode: 'multiply',
            }}
          />
        </div>

        {/* 2) EvalBar sits immediately to the right, full-height of the board */}
        <EvalBar score={positionEvaluation} className="h-full w-4" />
      </div>
    </div>
  );
}
