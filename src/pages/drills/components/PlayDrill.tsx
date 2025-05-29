// src/pages/drills/PlayDrill.tsx
import MoveStepper from '@/components/MoveStepper';
import useAnalysisEngine from '@/hooks/useAnalysisEngine';
import useGameHistory from '@/hooks/useGameHistory';
import useMoveInput from '@/hooks/useMoveInput';
import EvalBar from '@/pages/analyse/components/EvalBar';
import { useEffect, useRef, useState } from 'react';
import { Chessboard } from 'react-chessboard';
import { Navigate, useLocation } from 'react-router-dom';
import useAutoMove from '../hooks/useAutoMove';
import useBotPlayer from '../hooks/useBotPlayer';
import BotControls from './BotControls';

export default function PlayDrill() {
  const { state } = useLocation();
  if (!state || typeof state.fen !== 'string') {
    return <Navigate to="/drills" replace />;
  }
  const { fen: initialFEN, orientation } = state as {
    fen: string;
    orientation: 'white' | 'black';
  };

  // 1) Game history
  const { fen, moveHistory, currentIdx, makeMove, setIdx, lastMove } =
    useGameHistory({
      initialFEN,
      initialMoves: [],
      allowBranching: false,
    });

  // 2) User move input
  const {
    optionSquares,
    onSquareClick,
    onPieceDrop,
    showPromotionDialog,
    onPromotionPieceSelect,
    to,
  } = useMoveInput(fen, makeMove);

  // 3) Bot & auto-move
  const [strength, setStrength] = useState(8);
  const { isThinking, playBotMove } = useBotPlayer(fen, strength, makeMove);
  useAutoMove(moveHistory, playBotMove, 300);

  // 4) Eval engine
  const { evalScore, currentDepth } = useAnalysisEngine(fen);

  // 5) Responsive board width
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [boardWidth, setBoardWidth] = useState(0);
  useEffect(() => {
    if (!wrapperRef.current) return;
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setBoardWidth(entry.contentRect.width);
      }
    });
    ro.observe(wrapperRef.current);
    return () => ro.disconnect();
  }, []);

  return (
    <div className="mx-auto max-w-lg space-y-6 p-4">
      {/* Move navigation */}
      <div className="w-full">
        <MoveStepper
          moveList={moveHistory}
          currentIdx={currentIdx}
          setCurrentIdx={setIdx}
        />
      </div>

      {/* Board + EvalBar */}
      <div ref={wrapperRef} className="flex w-full gap-0">
        <div className="flex-1">
          {boardWidth > 0 && (
            <Chessboard
              position={fen}
              boardOrientation={orientation}
              boardWidth={boardWidth - 8}
              animationDuration={300}
              onPieceDrop={onPieceDrop}
              onSquareClick={onSquareClick}
              showPromotionDialog={showPromotionDialog}
              promotionToSquare={to}
              onPromotionPieceSelect={onPromotionPieceSelect}
              promotionDialogVariant={'modal'}
              customSquareStyles={{
                ...optionSquares,
                ...(lastMove
                  ? {
                      [lastMove.from]: {
                        backgroundColor: 'rgba(255,255,0,0.4)',
                      },
                      [lastMove.to]: { backgroundColor: 'rgba(255,255,0,0.4)' },
                    }
                  : {}),
              }}
              customDarkSquareStyle={{ backgroundColor: '#B1B7C8' }}
              customLightSquareStyle={{ backgroundColor: '#F5F2E6' }}
            />
          )}
        </div>
        <EvalBar
          score={evalScore}
          className="w-4"
          boardOrientation={orientation}
        />
      </div>

      {/* Depth control */}
      <BotControls strength={strength} setStrength={setStrength} />
    </div>
  );
}
