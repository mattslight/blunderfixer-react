// src/pages/drills/components/PlayDrill.tsx
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
import useGameResult from '@/hooks/useGameResult';
import useMoveInput from '@/hooks/useMoveInput';
import EvalBar from '@/pages/analyse/components/EvalBar';

const DEBUG = false;

export default function PlayDrill() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  // 1) Fetch the drill data via SWR
  const { drill, loading, error } = useDrill(id!);

  // 2) Prepare a default FEN (initial chess position) exactly once
  const defaultFEN = useMemo(() => new Chess().fen(), []);
  //    (there are no “pre‐moves” here, so initialMoves = [])
  const initialMoves = useMemo<string[]>(() => [], []);

  // 3) Call useGameHistory unconditionally.
  //    ‣ initialFEN: use drill.fen if it exists, otherwise defaultFEN.
  //    ‣ resetKey: use drill.id if it exists, otherwise undefined.
  //    This ensures:
  //      • On mount, resetKey === undefined → hook initializes with defaultFEN.
  //      • As soon as “drill” arrives, resetKey goes undefined→<id>,
  //        firing the hook’s effect exactly once to reload initialFEN=drill.fen.
  const { fen, moveHistory, currentIdx, makeMove, setIdx, lastMove, reset } =
    useGameHistory({
      initialFEN: drill?.fen ?? defaultFEN,
      initialMoves,
      allowBranching: true,
      resetKey: drill?.id,
    });

  // 4) Derive “orientation” from the current FEN’s side‐to‐move
  //    (once drill arrives, fen will be drill.fen; before that, fen is defaultFEN)
  const heroColor: 'white' | 'black' = useMemo(() => {
    // FEN format: “<piece-placement> <side-to-move> …”
    const side = drill?.fen.split(' ')[1];
    return side === 'b' ? 'black' : 'white';
  }, [drill?.fen]);

  const gameResult = useGameResult(fen, heroColor);

  // 5) Move‐input handlers (these hooks expect a valid `fen` string, which we always have)
  const {
    optionSquares,
    onSquareClick,
    onPieceDrop,
    showPromotionDialog,
    onPromotionPieceSelect,
    to,
  } = useMoveInput(fen, makeMove);

  // 6) Bot & auto‐move (drives an engine move after each human move)
  const [strength, setStrength] = useState(8);
  const { playBotMove } = useBotPlayer(fen, strength, makeMove);
  useAutoMove(moveHistory, playBotMove, 300);

  // 7) Evaluation engine (returns a numeric score for “fen”)
  const { evalScore } = useAnalysisEngine(fen);

  // 8) Responsive board width logic
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

  // 9) Debug logging
  useEffect(() => {
    if (DEBUG) {
      console.log('— PlayDrill debug —');
      console.log(' drill:', drill);
      console.log(' fen:', fen);
      console.log(' heroColor:', heroColor);
      console.log(' moveHistory:', moveHistory);
      console.log(' currentIdx:', currentIdx);
      console.log(' boardWidth:', boardWidth);
      console.log(' gameResult:', gameResult);
      console.log(' evalScore:', evalScore);
    }
  }, [
    drill,
    fen,
    heroColor,
    moveHistory,
    currentIdx,
    boardWidth,
    gameResult,
    evalScore,
  ]);

  // 10) Loading / error guards (after all hooks have been called)
  if (loading) {
    return <p className="p-4 text-center">Loading…</p>;
  }
  if (error || !drill) {
    return <Navigate to="/drills" replace />;
  }

  // 11) Render the board + controls
  return (
    <div className="mx-auto max-w-lg space-y-6 p-4">
      {/* Back → drills list */}
      <button
        onClick={() => navigate('/drills')}
        className="text-blue-500 hover:underline"
      >
        ← Back to list
      </button>

      {/* Board + EvalBar */}
      <div>
        <div ref={wrapperRef} className="flex w-full gap-0">
          <div className="flex-1">
            <Chessboard
              position={fen}
              boardOrientation={heroColor}
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
          </div>
          <EvalBar
            score={evalScore}
            className="w-4"
            boardOrientation={heroColor}
          />
        </div>

        {/* Move Stepper (scroll through history) */}
        <div className="w-full">
          <MoveStepper
            moveList={moveHistory}
            currentIdx={currentIdx}
            setCurrentIdx={setIdx}
          />
        </div>
      </div>

      {/* Bot controls + “Retry” */}
      <BotControls strength={strength} setStrength={setStrength} />
      <button
        onClick={() => reset()}
        className="flex items-center rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
      >
        <RotateCcw className="mr-1 h-4 w-4" />
        Retry
      </button>
      {/* Game result display */}
      {gameResult && (
        <div className="mt-4 text-center">
          <h2 className="text-lg font-semibold">
            Game Result:{' '}
            {gameResult === 'win'
              ? 'You Win!'
              : gameResult === 'loss'
                ? 'You Lose!'
                : 'Draw'}
          </h2>
          <p className="text-sm text-gray-500">
            {gameResult === 'win'
              ? 'Congratulations!'
              : gameResult === 'loss'
                ? 'Better luck next time!'
                : "It's a draw!"}
          </p>
        </div>
      )}
    </div>
  );
}
