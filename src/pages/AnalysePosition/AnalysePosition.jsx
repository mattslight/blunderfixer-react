import { useEffect, useState } from 'react';
import { Chessboard } from 'react-chessboard';

import { Chess } from 'chess.js';

import CoachChat from './CoachChat';
import CoachExplanation from './CoachExplanation';
import ExamplePositions from './ExamplePositions';
import PositionFeatures from './PositionFeatures';
import TopmovesCarousel from './TopmovesCarousel';

import { extractFeatures } from '@/api/analyse'; // you can replace this with local logic
import { useCoachExplanation } from '@/hooks/useCoachExplanation';
import { useStockfish } from '@/hooks/useStockfish';

const DEFAULT_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

export default function AnalysePosition({ startingFen, pgnMode = false }) {
  // --- State
  const [fen, setFEN] = useState(startingFen || '');
  const [boardFEN, setBoardFEN] = useState(startingFen || DEFAULT_FEN);
  const [features, setFeatures] = useState(null);
  const [error, setError] = useState(null);

  // board highlights
  const [arrows, setArrows] = useState([]);
  const [moveSquares, setMoveSquares] = useState({});

  // Stockfish
  const {
    lines = [], // [{ rank, moves, scoreCP, mateIn, searchDepth }]
    bestMove, // SAN string
    currentDepth, // number
    runAnalysis, // (fen, depth?) => void
    stopAnalysis,
  } = useStockfish(26, 3);

  // only run SF + feature extraction once boardFEN changes *after* mount
  useEffect(() => {
    // if you're still on default and the user never pasted anything, bail
    if (!startingFen && boardFEN === DEFAULT_FEN) {
      return;
    }

    stopAnalysis();
    runAnalysis(boardFEN, 26);

    extractFeatures(boardFEN)
      .then((f) => setFeatures(f))
      .catch(() => setError('Feature extraction failed'));
  }, [boardFEN, runAnalysis, startingFen, stopAnalysis]);

  // 2) draw arrow from bestMove (SAN) → from/to
  useEffect(() => {
    // only if SF gave us a move AND at least one line
    if (!bestMove || lines[0]?.moves.length === 0) {
      setArrows([]);
      setMoveSquares({});
      return;
    }

    const chess = new Chess(boardFEN);
    let mv;
    try {
      mv = chess.move(bestMove);
    } catch (e) {
      console.warn('Cannot apply SAN:', bestMove, e);
      return;
    }
    if (!mv) {
      console.warn('SAN not legal:', bestMove);
      return;
    }

    setArrows([[mv.from, mv.to, 'rgba(0,255,0,0.6)']]);
    setMoveSquares({
      [mv.from]: { backgroundColor: 'rgba(255,255,0,0.5)' },
      [mv.to]: { backgroundColor: 'rgba(0,255,0,0.5)' },
    });
  }, [bestMove, boardFEN, lines]);

  // 3) reset if parent gives new startingFen (e.g. PGN stepping)
  useEffect(() => {
    if (!startingFen) return;
    setFEN(startingFen);
    setBoardFEN(startingFen);
  }, [startingFen]);

  // coach explanation
  const {
    explanation,
    loadingExplanation,
    error: explanationError,
    getExplanation,
  } = useCoachExplanation();

  // FEN textarea handler
  function handleFenChange(e) {
    const f = e.target.value.trim();
    setFEN(f);
    setBoardFEN(f || DEFAULT_FEN);
  }

  return (
    <div className="flex flex-col items-center space-y-6">
      {/* Board & lines */}
      <div className="w-full max-w-lg">
        <div className="text-sm text-gray-400">
          <b>Main lines</b> (<i>depth {currentDepth}</i>)
        </div>
        <div className="mt-2 space-y-1">
          {lines
            .filter((l) => l.moves.length > 0)
            .map((l) => (
              <div
                key={l.rank}
                className="no-scrollbar flex overflow-x-auto text-sm whitespace-nowrap text-gray-200"
              >
                <span className="min-w-[3rem] shrink-0 text-gray-500">
                  #{l.rank}
                </span>
                <span className="flex-1 truncate">{l.moves.join(' → ')}</span>
                <span className="ml-2 shrink-0 text-gray-400">
                  <b>
                    {l.scoreCP != null
                      ? (l.scoreCP / 100).toFixed(2)
                      : `#${l.mateIn}`}
                  </b>
                </span>
              </div>
            ))}
        </div>
        <Chessboard
          position={boardFEN}
          customArrows={arrows}
          customSquareStyles={moveSquares}
          customBoardStyle={{
            borderRadius: '6px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.5)',
          }}
          customDarkSquareStyle={{ backgroundColor: '#2d3748' }}
          customLightSquareStyle={{ backgroundColor: '#1a202c' }}
          customNotationStyle={{ color: '#aaa', fontWeight: 'semibold' }}
        />
      </div>

      {/* FEN input */}
      {!pgnMode && (
        <div className="w-full max-w-lg space-y-2">
          <textarea
            rows={2}
            className="w-full rounded border p-2 dark:bg-gray-800 dark:text-white"
            placeholder="Paste a FEN string…"
            value={fen}
            onChange={handleFenChange}
          />
        </div>
      )}

      {/* Examples & errors */}
      {!pgnMode && (
        <ExamplePositions setFEN={setFEN} setBoardFEN={setBoardFEN} />
      )}
      {(error || explanationError) && (
        <p className="text-red-500">{error || explanationError}</p>
      )}

      {/* Explanations & features */}
      <div className="w-full max-w-lg space-y-4">
        <TopmovesCarousel lines={lines} />
        {!explanation && (
          <button
            onClick={() => getExplanation({ lines, features })}
            disabled={loadingExplanation}
            className="w-full rounded bg-green-600 py-2 text-white hover:bg-green-700 disabled:opacity-50"
          >
            {loadingExplanation ? 'Thinking…' : 'Get Explanation'}
          </button>
        )}
        {explanation && <CoachExplanation explanation={explanation} />}
        <PositionFeatures features={features} />
        <CoachChat lines={lines} features={features} />
      </div>
    </div>
  );
}
