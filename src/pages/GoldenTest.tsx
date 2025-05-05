import { Chessboard } from 'react-chessboard';
import { DEFAULT_POSITION } from 'chess.js';

import useAnalysisEngine from '@/hooks/useAnalysisEngine';
import useGameHistory from '@/hooks/useGameHistory';
import useMoveInput from '@/hooks/useMoveInput';
import EvalBar from './analyse/components/EvalBar';
import MoveStepper from './analyse/components/MoveStepper';
import MoveLines from './analyse/components/MoveLines';
import TopMovesCarousel from './analyse/components/TopMovesCarousel';

interface AnalysisBoardProps {
  initialFEN?: string;
}

export default function AnalysisBoard({
  initialFEN = DEFAULT_POSITION,
}: AnalysisBoardProps) {
  // 1) step through history & manage branching
  const { fen, moveHistory, currentIdx, setIdx, makeMove } =
    useGameHistory(initialFEN);

  // 2) engine analysis (arrows, eval, lines)
  const { lines, currentDepth, arrows, evalScore, legalMoves } =
    useAnalysisEngine(fen);

  // 3) click/drag + promotion
  const {
    from,
    to,
    showPromo,
    options: optionSquares,
    onSquareClick,
    onPieceDrop,
    onPromotion,
  } = useMoveInput(fen, (f, t, prom) => makeMove(f, t, prom));

  // Carousel slide change handler
  function onSlideChange(props: any) {
    console.log('onSlideChange', props);
  }

  return (
    <div className="flex flex-col items-center space-y-3">
      {/* Move navigation */}
      <div className="w-full max-w-lg">
        <MoveStepper
          moveList={moveHistory}
          currentIdx={currentIdx}
          setCurrentIdx={setIdx}
        />
      </div>

      {/* Board + side-panel row */}
      <div className="flex items-stretch gap-0">
        {/* Board (fixed size) */}
        <div className="h-116 w-116 flex-none">
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

        {/* Eval bar (fixed width) */}
        <div className="flex-none">
          <EvalBar score={evalScore} className="h-full w-4" />
        </div>

        {/* Move lines (scrollable) */}
        <div className="w-64 flex-none overflow-auto">
          <MoveLines lines={lines} currentDepth={currentDepth} />
        </div>

        {/* Top-moves carousel (fixed width) */}
        <div className="w-64 flex-none">
          <TopMovesCarousel lines={lines} onSlideChange={onSlideChange} />
        </div>
      </div>
    </div>
  );
}
