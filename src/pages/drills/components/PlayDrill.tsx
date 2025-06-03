// src/pages/drills/components/PlayDrill.tsx
import { useEffect, useMemo, useState } from 'react';
import { Chessboard } from 'react-chessboard';
import { Navigate, useParams } from 'react-router-dom';
import { Chess, Square } from 'chess.js';
import { Crosshair, RotateCcw } from 'lucide-react';

import useAutoMove from '../hooks/useAutoMove';
import useBotPlayer from '../hooks/useBotPlayer';
import { useDrillResult } from '../hooks/useDrillResult';
import { GameInfoBadges } from './DrillCard/GameInfoBadges';
import { HistoryDots } from './DrillCard/HistoryDots';
import { TimePhaseHeader } from './DrillCard/TimePhaseHeader';
import useDrill from './hooks/useDrill';

import { PHASE_COLORS, PHASE_DISPLAY } from '@/constants/phase';
import useAnalysisEngine from '@/hooks/useAnalysisEngine';
import useGameHistory from '@/hooks/useGameHistory';
import useGameResult from '@/hooks/useGameResult';
import useMoveInput from '@/hooks/useMoveInput';

const DEBUG = false;

const REQUIRED_MOVES = 5; // default for early/midgame drills
const LOSS_THRESHOLD = 100; // default loss threshold in centipawns

export default function PlayDrill() {
  const { id } = useParams<{ id: string }>();
  const [resetKey, setResetKey] = useState(0);

  // 1) Fetch the drill data
  const { drill, loading, error } = useDrill(id!);

  // Whenever a new drill arrives, bump resetKey to re‐initialize
  useEffect(() => {
    if (drill?.fen) {
      setResetKey((prev) => prev + 1);
    }
  }, [drill?.fen]);

  // 2) Default FEN until drill.fen shows up
  const defaultFEN = useMemo(() => new Chess().fen(), []);
  const initialMoves = useMemo<string[]>(() => [], []);

  // 3) Game history (initialFEN switches to drill.fen as soon as it's loaded)
  const { fen, moveHistory, currentIdx, makeMove, lastMove } = useGameHistory({
    initialFEN: drill?.fen,
    initialMoves,
    allowBranching: true,
    resetKey,
  });

  // 4) Hero’s color (from drill.fen’s side‐to‐move)
  const heroColor: 'white' | 'black' = useMemo(() => {
    const side = (drill?.fen ?? defaultFEN).split(' ')[1];
    return side === 'b' ? 'black' : 'white';
  }, [drill?.fen, defaultFEN]);

  // 5) GameResult (for full‐game drills)
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
  const { playBotMove } = useBotPlayer({ fen, makeMove });
  useAutoMove(moveHistory, playBotMove, 300);

  // 8) Engine evaluation (numerical, in centipawns)
  const { evalScore } = useAnalysisEngine(fen, !!drill?.initial_eval, 1, 18);

  // 9) Decide defaults for this drill:
  //    • initialEval from drill.initial_eval (or null until loaded)
  //    • maxMoves = 0 if phase=endgame; else REQUIRED_MOVES
  //    • lossThreshold = LOSS_THRESHOLD
  const initialEval = drill?.initial_eval ?? null;
  const maxMoves = drill?.phase === 'endgame' ? 0 : REQUIRED_MOVES;
  const lossThreshold = LOSS_THRESHOLD;

  // 10) Drill‐result hook
  const {
    result: drillResult, // 'pass' | 'fail' | null
    expectedResult, // 'win' | 'draw' | 'hold' | null
    reason, // contextual reason string
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

  // 11) Derive displayPhase & phaseColor for header
  const displayPhase = useMemo(() => {
    if (!drill?.phase) return 'Unknown';
    return PHASE_DISPLAY[drill.phase] ?? 'Unknown';
  }, [drill?.phase]);

  const phaseColor = useMemo(() => {
    return PHASE_COLORS[displayPhase] ?? 'bg-gray-700';
  }, [displayPhase]);

  // 12) Debug logging
  useEffect(() => {
    if (DEBUG) {
      console.log('— PlayDrill debug —');
      console.log(' drill:', drill);
      console.log(' fen:', fen);
      console.log(' initialEval:', initialEval);
      console.log(' currentEval:', evalScore);
      console.log(' heroColor:', heroColor);
      console.log(' moveHistory:', moveHistory);
      console.log(' currentIdx:', currentIdx);
      console.log(' gameResult:', gameResult);
      console.log(' drillResult:', drillResult);
      console.log(' expectedResult:', expectedResult);
      console.log(' reason:', reason);
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
    reason,
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

  // 14) Render
  return (
    <>
      <div className="mx-auto max-w-md space-y-4">
        {/* ---------- Board + EvalBar ---------- */}
        <div className="flex flex-col items-center">
          <div className="my-4">
            <DrillBanner
              expectedResult={expectedResult}
              drillResult={drillResult}
              reason={reason}
              setResetKey={setResetKey}
            />
          </div>
          <div className="flex w-full items-center">
            <div className="flex-1">
              <Chessboard
                position={fen}
                customBoardStyle={{ borderRadius: '0.25rem' }}
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
                customNotationStyle={{
                  fontSize: '0.7rem',
                  color: 'oklch(65% 0.03 264)',
                  fontWeight: 700,
                }}
                customDarkSquareStyle={{ backgroundColor: '#B1B7C8' }}
                customLightSquareStyle={{ backgroundColor: '#F5F2E6' }}
              />
            </div>
          </div>
          {/* Move Stepper (to scroll through history)
          <div className="w-full">
            <MoveStepper
              moveList={moveHistory}
              currentIdx={currentIdx}
              setCurrentIdx={setIdx}
            />
          </div> */}
        </div>
      </div>
      <div className="xs:px-0 mx-auto mt-5 max-w-md space-y-4 px-4">
        <div className="flex flex-row items-center justify-start space-x-2">
          <div className="text-xs font-bold text-green-400 uppercase">
            Last 5 Tries
          </div>
          <HistoryDots history={drill.history ?? []} />
        </div>

        <TimePhaseHeader
          playedAt={drill.played_at}
          displayPhase={displayPhase}
          phaseColor={phaseColor}
        />
        {/*
        Game Info Badges (from DrillCard)
        ---------------------------------
        Shows time class, time control, opponent, eval swing, and result.
      */}
        <GameInfoBadges
          timeClass={drill.time_class}
          timeControl={drill.time_control}
          opponent={{
            username: drill.opponent_username,
            rating: drill.opponent_rating,
          }}
          evalSwing={drill.eval_swing}
          heroResult={drill.hero_result}
          hideGameResult={true}
        />
      </div>
    </>
  );
}

function DrillBanner({ expectedResult, drillResult, reason, setResetKey }) {
  return (
    <div className="flex w-full flex-col items-center space-y-2">
      {/* Drill Goal Banner (only show before result) */}
      {expectedResult && !drillResult && (
        <div className="flex w-full items-center justify-center rounded border border-indigo-500 bg-indigo-900 px-4 py-2 text-center text-indigo-200">
          <Crosshair className="mr-1 h-4 w-4 text-indigo-400" />
          <span className="text-sm">
            <span className="mr-1 font-bold text-white/80">Goal</span>
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
          onClick={() => {
            if (drillResult === 'fail') setResetKey((prev) => prev + 1);
          }}
        >
          {drillResult === 'pass'
            ? `✅ ${reason ?? 'You met the goal!'}`
            : `❌ ${reason ?? 'Better luck next time.'}`}
          {drillResult === 'fail' && (
            <button
              onClick={() => setResetKey((prev) => prev + 1)}
              className="ml-2 inline-flex items-center rounded-md bg-green-600 px-2 py-1 text-xs font-medium text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <RotateCcw className="mr-1 h-3 w-3" />
              Retry
            </button>
          )}
        </div>
      )}
    </div>
  );
}
