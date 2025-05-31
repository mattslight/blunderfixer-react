// src/pages/drills/PlayDrill.tsx

import { useEffect, useMemo, useRef, useState } from 'react';
import { Chessboard } from 'react-chessboard';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { Chess, Square } from 'chess.js';
import { RotateCcw } from 'lucide-react';

import useAutoMove from '../hooks/useAutoMove';
import useBotPlayer from '../hooks/useBotPlayer';
import useDrill from '../hooks/useDrill';
import BotControls from './BotControls';

import MoveStepper from '@/components/MoveStepper';
import useAnalysisEngine from '@/hooks/useAnalysisEngine';
import useGameHistory from '@/hooks/useGameHistory';
import useMoveInput from '@/hooks/useMoveInput';
import EvalBar from '@/pages/analyse/components/EvalBar';

export default function PlayDrill() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  // 1) Fetch the drill data via SWR
  const { drill, loading, error } = useDrill(id!);

  // 2) Fallback “starting” FEN until drill arrives
  const defaultFEN = new Chess().fen(); // standard initial chess position
  const [initialFEN, setInitialFEN] = useState<string>(defaultFEN);

  // 3) Derive orientation from the INITIAL FEN (side to move = hero).
  //    We’ll parse drill.fen once when it arrives.
  const [orientation, setOrientation] = useState<'white' | 'black'>('white');

  useEffect(() => {
    if (drill?.fen) {
      setInitialFEN(drill.fen);

      // Split "rnbqkbnr/... w KQkq - 0 1" → take index 1 ("w" or "b")
      const parts = drill.fen.split(' ');
      setOrientation(parts[1] === 'b' ? 'black' : 'white');
    }
  }, [drill]);

  // 4) Memoize an empty array so that useGameHistory doesn’t reset repeatedly
  const initialMoves = useMemo<string[]>(() => [], []);

  // 5) Always call useGameHistory with a valid FEN and stable initialMoves
  const { fen, moveHistory, currentIdx, makeMove, setIdx, lastMove, reset } =
    useGameHistory({
      initialFEN,
      initialMoves,
      allowBranching: true,
    });

  // 6) Move‐input handlers (on‐click, drag/drop, promotion)
  const {
    optionSquares,
    onSquareClick,
    onPieceDrop,
    showPromotionDialog,
    onPromotionPieceSelect,
    to,
  } = useMoveInput(fen, makeMove);

  // 7) Bot & auto‐move
  const [strength, setStrength] = useState(8);
  const { playBotMove } = useBotPlayer(fen, strength, makeMove);
  useAutoMove(moveHistory, playBotMove, 300);

  // 8) Evaluation engine
  const { evalScore } = useAnalysisEngine(fen);

  // 9) Responsive board width
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

  // 10) Loading / error guards
  if (loading) {
    return <p className="p-4 text-center">Loading...</p>;
  }
  if (error || !drill) {
    return <Navigate to="/drills" replace />;
  }

  // 11) Render the board with a fixed `orientation` (hero’s side to move)
  return (
    <div className="mx-auto max-w-lg space-y-6 p-4">
      {/* Back to drills list */}
      <button
        onClick={() => navigate('/drills')}
        className="text-sm text-blue-500 hover:underline"
      >
        ← Back to list
      </button>

      {/* Board + EvalBar */}
      <div>
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
                promotionToSquare={to as Square}
                onPromotionPieceSelect={onPromotionPieceSelect}
                promotionDialogVariant={'modal'}
                customSquareStyles={{
                  ...optionSquares,
                  ...(lastMove
                    ? {
                        [lastMove.from]: {
                          backgroundColor: 'rgba(255,255,0,0.4)',
                        },
                        [lastMove.to]: {
                          backgroundColor: 'rgba(255,255,0,0.4)',
                        },
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
        <div className="w-full">
          <MoveStepper
            moveList={moveHistory}
            currentIdx={currentIdx}
            setCurrentIdx={setIdx}
          />
        </div>
      </div>

      {/* Bot controls and “Retry” button */}
      <BotControls strength={strength} setStrength={setStrength} />
      <button
        onClick={() => reset()}
        className="items-center rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
      >
        <RotateCcw className="relative bottom-0.25 mr-1 inline-flex h-4 w-4" />
        Retry
      </button>
    </div>
  );
}
