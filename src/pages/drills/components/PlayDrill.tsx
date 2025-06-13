// src/pages/drills/components/PlayDrill.tsx
import { useEffect, useMemo, useState } from 'react';
import { Chessboard } from 'react-chessboard';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { Chess, Square } from 'chess.js';
import { Archive, Clipboard, ClipboardCheck, ExternalLink } from 'lucide-react';

// import EvalBar from '../../analyse/components/EvalBar';
import useAutoMove from '../hooks/useAutoMove';
import useBotPlayer from '../hooks/useBotPlayer';
import { buildDrillFilters, readStickyFilters } from '../utils/filters';
import ArchiveConfirmModal from './ArchiveConfirmModal';
import DrillBanner from './DrillBanner';
import { GameInfoBadges } from './DrillCard/GameInfoBadges';
import { HistoryDots } from './DrillCard/HistoryDots';
import { TimePhaseHeader } from './DrillCard/TimePhaseHeader';
import { useDrill } from './hooks/useDrill';
import { useDrillResult } from './hooks/useDrillResult';
import { useSaveDrillHistory } from './hooks/useSaveDrillHistory';

import { getDrills } from '@/api/drills';
import { updateDrill } from '@/api/drills';
import { PHASE_COLORS, PHASE_DISPLAY } from '@/const/phase';
import useAnalysisEngine from '@/hooks/useAnalysisEngine';
import { useDebounce } from '@/hooks/useDebounce';
import useGameHistory from '@/hooks/useGameHistory';
import useGameResult from '@/hooks/useGameResult';
import useMoveInput from '@/hooks/useMoveInput';
import { useProfile } from '@/hooks/useProfile';

const DEBUG = false;

const REQUIRED_MOVES = 6; // default for early/midgame/late drills

export default function PlayDrill() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    profile: { username },
  } = useProfile();
  const [resetKey, setResetKey] = useState(0);
  const [showConfirm, setShowConfirm] = useState(false);

  // 1) Fetch the drill data
  const { drill, loading, error } = useDrill(id!);

  const handleArchive = async () => {
    if (!drill) return;
    try {
      await updateDrill(drill.id, { archived: true });
      navigate('/drills');
    } catch (err) {
      console.error('Could not archive drill:', err);
    }
  };

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

  const moveCount = moveHistory.length;

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
  const { evalScore, currentDepth } = useAnalysisEngine(
    fen,
    !!drill?.initial_eval,
    1,
    18
  );

  // 9) Decide defaults for this drill:
  const initialEval = drill?.initial_eval ?? null;
  const isEndgame = drill?.phase === 'endgame';
  const maxMoves = REQUIRED_MOVES;
  const lossThreshold = Math.max(drill?.initial_eval / 2, 100); // default to half the initial eval or 100 CP

  // 10) Drill‐result hook
  const {
    result: drillResult, // 'pass' | 'fail' | null
    expectedResult, // 'win' | 'draw' | 'hold' | null
    reason, // contextual reason string
  } = useDrillResult({
    initialEval,
    currentEval: evalScore,
    currentDepth,
    heroSide: heroColor,
    maxMoves,
    isEndgame,
    lossThreshold,
    gameOver: Boolean(gameResult),
    gameResult,
    resetKey,
    moveCount,
  });

  const debouncedDrillResult = useDebounce(drillResult, 500);

  useSaveDrillHistory(
    drill?.id,
    debouncedDrillResult,
    reason,
    currentDepth,
    moveHistory,
    resetKey
  );

  const handleNextDrill = async () => {
    if (!username || !drill?.id) {
      navigate('/drills');
      return;
    }

    try {
      // ✅ mark current drill as seen (skip)
      await updateDrill(drill.id, { mark_played: true });

      // Fetch next drill
      const sticky = readStickyFilters();
      const filters = buildDrillFilters(username, sticky);
      const drills = await getDrills(filters);

      const next = drills.find((d) => d.id !== drill.id);
      if (next) navigate(`/drills/play/${next.id}`);
      else navigate('/drills');
    } catch (err) {
      console.error('Failed to load next drill:', err);
      navigate('/drills');
    }
  };

  // 11) Derive displayPhase & phaseColor for header
  const displayPhase = useMemo(() => {
    if (!drill?.phase) return 'Unknown';
    return PHASE_DISPLAY[drill.phase] ?? 'Unknown';
  }, [drill?.phase]);

  const phaseColor = useMemo(() => {
    return PHASE_COLORS[displayPhase] ?? 'bg-stone-700';
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
        <a
          onClick={() => navigate(-1)}
          aria-label="Back"
          className="xs:ml-0 relative top-4 z-100 ml-4 inline-flex w-fit items-center py-1 pr-4 text-blue-600 hover:underline"
        >
          ← Back
        </a>
        {/* ---------- Board + EvalBar ---------- */}
        <div className="mt-4 flex flex-col items-center">
          <div className="xs:px-0 w-full px-2">
            <DrillBanner
              expectedResult={expectedResult}
              drillResult={debouncedDrillResult}
              reason={reason}
              setResetKey={setResetKey}
              onNext={handleNextDrill}
              initialEval={initialEval}
            />
          </div>
          <div className="mt-4 flex w-full items-center">
            {/* <EvalBar
              score={evalScore}
              className="w-2"
              boardOrientation={heroColor}
            /> */}
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

          {DEBUG && (
            <div className="mt-2 w-full rounded bg-stone-800 p-2 text-xs text-stone-200">
              <div>initialEval: {initialEval}</div>
              <div>currentEval: {evalScore}</div>
              <div>depth: {currentDepth}</div>
              <div>moveCount: {moveCount}</div>
              <div>maxMoves: {maxMoves}</div>
              <div>result: {drillResult}</div>
              <div>reason: {reason}</div>
            </div>
          )}
        </div>
      </div>
      <div className="xs:px-0 mx-auto mt-5 max-w-md space-y-2 px-2">
        <div className="flex flex-row items-center justify-between">
          <div className="flex flex-row items-center space-x-2">
            <div className="text-xs font-bold text-green-400 uppercase">
              Last 5 Tries
            </div>
            <HistoryDots history={drill.history ?? []} />
          </div>
        </div>

        <TimePhaseHeader
          playedAt={drill.game_played_at}
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
        <div className="my-10 flex items-center justify-between gap-4 space-x-2">
          {!drill.pgn && <CopyFenToClipboard fen={fen} />}
          {drill.pgn && (
            <AnalysePositionButton
              pgn={drill.pgn}
              halfMoveIndex={drill.ply + currentIdx}
              heroSide={heroColor === 'black' ? 'b' : 'w'}
            />
          )}
          <button
            onClick={() => setShowConfirm(true)}
            className="flex items-center rounded-md border bg-black/50 px-3 py-2 text-xs text-stone-500 backdrop-blur hover:text-red-400"
          >
            <Archive className="mr-2 h-4 w-4" />
            Archive drill
          </button>
        </div>

        <ArchiveConfirmModal
          show={showConfirm}
          onCancel={() => setShowConfirm(false)}
          onConfirm={handleArchive}
        />
        <div className="mt-32">&nbsp;</div>
      </div>
    </>
  );
}

function CopyFenToClipboard({ fen }) {
  const [isFenCopied, setIsFenCopied] = useState(false);

  const handleCopy = () => {
    if (!fen) return; // guard
    navigator.clipboard.writeText(fen).catch(() => {
      // fallback or error message
    });
    setIsFenCopied(true);
    setTimeout(() => setIsFenCopied(false), 3000);
  };

  return (
    <button
      type="button"
      className="group flex items-center space-x-2 rounded border border-stone-500 bg-stone-950 px-3 py-2 text-xs text-stone-400 transition-colors duration-150 hover:bg-green-500 hover:text-stone-900"
      onClick={handleCopy}
      aria-label={isFenCopied ? 'FEN copied' : 'Copy position FEN'}
    >
      <span aria-hidden="true">
        {isFenCopied ? (
          <ClipboardCheck className="h-4 w-4 text-green-600 transition-opacity duration-200 group-hover:text-black" />
        ) : (
          <Clipboard className="h-4 w-4 text-stone-400 transition-opacity duration-200 group-hover:text-black" />
        )}
      </span>
      <span className="select-none">
        {isFenCopied ? 'Copied!' : 'Copy FEN'}
      </span>
      <div role="status" aria-live="polite" className="sr-only">
        {isFenCopied && 'Position FEN copied to clipboard'}
      </div>
    </button>
  );
}

function AnalysePositionButton({ pgn, halfMoveIndex, heroSide }) {
  const navigate = useNavigate();

  const handleAnalyse = () => {
    navigate('/analyse', { state: { pgn, halfMoveIndex, heroSide } });
  };

  return (
    <button
      className="items-center rounded-md border-b-2 border-b-purple-900 bg-purple-600 px-3 py-2 text-xs font-semibold text-white hover:bg-purple-600"
      onClick={handleAnalyse}
    >
      Analysis Board
      <ExternalLink className="relative bottom-[1px] ml-2 inline-flex h-3 w-3" />
    </button>
  );
}
