// src/pages/drills/components/PlayDrill.tsx
import { useEffect, useMemo, useState } from 'react';
import { Chessboard } from 'react-chessboard';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { Chess, Square } from 'chess.js';
import { Crosshair, RotateCcw } from 'lucide-react';

import useAutoMove from '../hooks/useAutoMove';
import useBotPlayer from '../hooks/useBotPlayer';
import useDrill from '../hooks/useDrill';
import { useDrillResult } from '../hooks/useDrillResult';
import BotControls from './BotControls';

import MoveStepper from '@/components/MoveStepper';
import useAnalysisEngine from '@/hooks/useAnalysisEngine';
import useGameHistory from '@/hooks/useGameHistory';
import useGameResult from '@/hooks/useGameResult';
import useMoveInput from '@/hooks/useMoveInput';
import { useStickyValue } from '@/hooks/useStickyValue';
import EvalBar from '@/pages/analyse/components/EvalBar';

const DEBUG = false;

const REQUIRED_MOVES = 5; // default for early/midgame drills
const LOSS_THRESHOLD = 100; // default loss threshold in centipawns

export default function PlayDrill() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [resetKey, setResetKey] = useState(0);

  // 1) Fetch the drill data
  const { drill, loading, error } = useDrill(id!);

  useEffect(() => {
    if (drill?.fen) {
      setResetKey((prev) => prev + 1);
    }
  }, [drill?.fen]);

  // 2) Default FEN until drill.fen shows up
  const defaultFEN = useMemo(() => new Chess().fen(), []);
  const initialMoves = useMemo<string[]>(() => [], []);

  // 3) Game history (initialFEN switches to drill.fen as soon as it's loaded)
  const { fen, moveHistory, currentIdx, makeMove, setIdx, lastMove } =
    useGameHistory({
      initialFEN: drill?.fen,
      initialMoves,
      allowBranching: true,
      resetKey,
    });

  // 4) Hero’s color (from drill.fen’s side-to-move)
  const heroColor: 'white' | 'black' = useMemo(() => {
    const side = (drill?.fen ?? defaultFEN).split(' ')[1];
    return side === 'b' ? 'black' : 'white';
  }, [drill?.fen, defaultFEN]);

  // 5) GameResult (if we ever need it for full-game drills)
  const gameResult = useGameResult(fen, heroColor);

  // 6) Move‐input handlers
  const {
    optionSquares,
    onSquareClick,
    onPieceDrop,
    showPromotionDialog,
    onPromotionPieceSelect,
    to,
  } = useMoveInput(fen, makeMove);

  // 7) Bot‐move logic
  const [strength, setStrength] = useStickyValue('drillBotStrength', 8);
  const { playBotMove } = useBotPlayer(fen, strength, makeMove);
  useAutoMove(moveHistory, playBotMove, 300);

  // 8) Engine evaluation (numerical, in centipawns)
  const { evalScore } = useAnalysisEngine(fen, !!drill?.initial_eval, 1, 18);

  // 9) Decide defaults for this drill:
  //    • initialEval must come from drill.initialEval (or null until loaded)
  //    • maxMoves = 0 if phase=endgame; else drill.maxMoves or 3
  //    • lossThreshold = drill.lossThreshold or 100 (centipawns)
  const initialEval = drill?.initial_eval ?? null;
  const maxMoves = drill?.phase === 'endgame' ? 0 : REQUIRED_MOVES;
  const lossThreshold = LOSS_THRESHOLD;

  // 10) Drill‐result hook
  const {
    result: drillResult, // 'pass' | 'fail' | null
    expectedResult, // 'win' | 'draw' | 'hold' | null
  } = useDrillResult({
    initialEval,
    currentEval: evalScore,
    heroSide: heroColor,
    maxMoves,
    lossThreshold,
    gameOver: Boolean(gameResult),
    gameResult,
    resetKey,
    moveHistory,
  });

  ////12) Debug logging
  useEffect(() => {
    if (DEBUG) {
      console.log('— PlayDrill debug —');
      console.log(' drill fen:', drill?.fen);
      console.log(' fen:', fen);
      console.log(' initialEval:', initialEval);
      console.log(' currentEval:', evalScore);
      console.log(' heroColor:', heroColor);
      console.log(' moveHistory:', moveHistory);
      console.log(' currentIdx:', currentIdx);
      console.log(' gameResult:', gameResult);
      console.log(' drillResult:', drillResult);
      console.log(' expectedResult:', expectedResult);
      console.log(' maxMoves:', maxMoves, 'lossThreshold:', lossThreshold);
    }
  }, [
    drill,
    fen,
    heroColor,
    moveHistory,
    currentIdx,
    gameResult,
    drillResult,
    expectedResult,
    maxMoves,
    lossThreshold,
    initialEval,
    evalScore,
  ]);

  // 13) Loading / error guards
  if (loading) {
    return <p className="p-4 text-center">Loading…</p>;
  }
  if (error || !drill) {
    return <Navigate to="/drills" replace />;
  }

  // 15) Render
  return (
    <div className="mx-auto max-w-md space-y-6 p-4">
      {/* ← Back to drills list */}
      <button
        onClick={() => navigate('/drills')}
        className="text-sm text-blue-400 hover:underline"
      >
        ← Back to list
      </button>

      {/* Drill Goal Banner (only show before result) */}
      {expectedResult && !drillResult && (
        <div className="flex items-center justify-center rounded-md border border-indigo-600 bg-indigo-800/30 px-4 py-2 text-center text-indigo-200">
          <Crosshair className="mr-1 h-4 w-4 text-indigo-400" />
          <span className="text-sm">
            <span className="mr-1 font-bold">Goal</span>
            {expectedResult === 'win' && 'Convert the Win'}
            {expectedResult === 'hold' && 'Defend like Gurkesh!'}
            {expectedResult === 'draw' && 'Hold the Draw'}
          </span>
        </div>
      )}

      {/* Drill Result Banner */}
      {drillResult && (
        <div
          className={`rounded-md px-4 py-2 text-center text-sm font-medium ${
            drillResult === 'pass'
              ? 'border border-green-500 bg-green-900 text-green-100'
              : 'border border-red-500 bg-red-900 text-red-100'
          }`}
        >
          {drillResult === 'pass'
            ? '✅ You met the goal!'
            : '❌ You failed—try again.'}
        </div>
      )}

      {/* ---------- Board + EvalBar ---------- */}
      <div className="flex flex-col items-center">
        <div className="flex w-full items-center gap-2">
          <div className="flex-1">
            <Chessboard
              customBoardStyle={{
                borderRadius: '0.5rem',
              }}
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
            score={evalScore ?? drill?.initial_eval}
            className="w-2 rounded"
            boardOrientation={heroColor}
          />
        </div>

        {/* Move Stepper (to scroll through history) */}
        <div className="w-full">
          <MoveStepper
            moveList={moveHistory}
            currentIdx={currentIdx}
            setCurrentIdx={setIdx}
          />
        </div>
      </div>

      {/* ---------- Footer: Bot Controls + Retry ---------- */}
      <div className="flex w-full items-center justify-between space-x-4">
        <BotControls strength={strength} setStrength={setStrength} />

        <button
          onClick={() => setResetKey((prev) => prev + 1)}
          className="flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        >
          <RotateCcw className="mr-1 h-4 w-4" />
          Retry
        </button>
      </div>
    </div>
  );
}
