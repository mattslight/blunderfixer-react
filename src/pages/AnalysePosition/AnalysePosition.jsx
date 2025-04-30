import { useEffect, useState } from 'react';
import { Chessboard } from 'react-chessboard';

import { Chess } from 'chess.js';

import CoachChat from './CoachChat';
import CoachExplanation from './CoachExplanation';
import ExamplePositions from './ExamplePositions';
import PositionFeatures from './PositionFeatures';
import TopmovesCarousel from './TopmovesCarousel';

import { analyseFEN, extractFeatures } from '@/api/analyse';
import { useCoachExplanation } from '@/hooks/useCoachExplanation';
import { useStockfish } from '@/hooks/useStockfish';

const DEFAULT_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

export default function AnalysePosition({ startingFen, pgnMode = false }) {
  // state
  const [fen, setFEN] = useState(startingFen || '');
  const [boardFEN, setBoardFEN] = useState(startingFen || DEFAULT_FEN);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [arrows, setArrows] = useState([]);
  const [moveSquares, setMoveSquares] = useState({});

  // Stockfish hook
  const {
    lines = [], // AnalysisLine[]: { rank, moves, scoreCP, mateIn, searchDepth }
    bestMove, // string (SAN)
    runAnalysis, // function(fen, depth?)
  } = useStockfish(26, 3);

  console.log('🔍 rendering with lines=', lines);

  console.log('🔍 runAnalysis called with', boardFEN);

  // Draw arrows from SAN bestMove
  useEffect(() => {
    if (!bestMove) {
      setArrows([]);
      setMoveSquares({});
      return;
    }
    // Convert SAN → from/to via chess.js
    const chess = new Chess(boardFEN);
    const mv = chess.move(bestMove);
    if (!mv) return;
    setArrows([[mv.from, mv.to, 'rgba(0,255,0,0.6)']]);
    setMoveSquares({
      [mv.from]: { backgroundColor: 'rgba(255,255,0,0.5)' },
      [mv.to]: { backgroundColor: 'rgba(0,255,0,0.5)' },
    });
  }, [bestMove, boardFEN]);

  // PGN stepping or manual input
  useEffect(() => {
    if (startingFen) {
      setFEN(startingFen);
      setBoardFEN(startingFen);
      setResult(null);
      setArrows([]);
      setMoveSquares({});
      setError(null);
    }
  }, [startingFen]);

  // Coach explanation hook
  const {
    explanation,
    loadingExplanation,
    error: explanationError,
    getExplanation,
  } = useCoachExplanation();

  // Handle textarea FEN changes
  function handleFenChange(e) {
    const newFen = e.target.value.trim();
    setFEN(newFen);
    setBoardFEN(newFen || DEFAULT_FEN);
  }

  // One‐click analysis for your own API
  async function handleAnalyseClick() {
    setLoading(true);
    setError(null);
    setArrows([]);
    setMoveSquares({});
    runAnalysis(boardFEN, 26);

    try {
      const [analysis, features] = await Promise.all([
        analyseFEN(fen, 5),
        extractFeatures(fen),
      ]);
      setResult({ ...analysis, features });
    } catch {
      setError('Failed to analyse position.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-center space-y-6">
      <div className="w-full max-w-lg">
        {/* Depth display (optional) */}
        <div className="text-sm text-gray-400">
          Eval {lines[0]?.searchDepth ?? '–'} moves deep
        </div>

        {/* Best lines */}
        <div className="mt-2 space-y-1">
          {lines.length > 0 &&
            lines
              .filter((line) => line.moves.length > 0)
              .map((line) => (
                <div
                  key={line.rank}
                  className="no-scrollbar flex overflow-x-auto text-sm whitespace-nowrap text-gray-200"
                >
                  <span className="min-w-[3rem] shrink-0 text-gray-500">
                    #{line.rank}
                  </span>
                  <span className="flex-1 truncate">
                    {line.moves.join(' → ')}
                  </span>
                  <span className="ml-2 shrink-0 text-gray-400">
                    <b>
                      {line.scoreCP != null
                        ? (line.scoreCP / 100).toFixed(2)
                        : `#${line.mateIn}`}
                    </b>
                  </span>
                </div>
              ))}
        </div>

        {/* Chessboard */}
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

      {/* FEN input & Analyse button */}
      {!result && (
        <div className="w-full max-w-lg space-y-2">
          {!pgnMode && (
            <textarea
              rows={2}
              className="w-full rounded border p-2 dark:bg-gray-800 dark:text-white"
              placeholder="Paste a FEN string…"
              value={fen}
              onChange={handleFenChange}
            />
          )}
          <button
            onClick={handleAnalyseClick}
            disabled={!fen || loading}
            className="w-full rounded bg-blue-600 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Analysing…' : 'Analyse'}
          </button>
        </div>
      )}

      {/* Example positions + errors */}
      {!result && !pgnMode && (
        <ExamplePositions setFEN={setFEN} setBoardFEN={setBoardFEN} />
      )}
      {(error || explanationError) && (
        <p className="text-red-500">{error || explanationError}</p>
      )}

      {/* Detailed results */}
      {result && (
        <div className="w-full max-w-lg space-y-4">
          <TopmovesCarousel result={result} />
          {!explanation && (
            <button
              onClick={() => getExplanation(result)}
              disabled={loadingExplanation}
              className="w-full rounded bg-green-600 py-2 text-white hover:bg-green-700 disabled:opacity-50"
            >
              {loadingExplanation ? 'Thinking…' : 'Get Explanation'}
            </button>
          )}
          {explanation && <CoachExplanation explanation={explanation} />}
          <PositionFeatures features={result.features} />
          <CoachChat result={result} />
        </div>
      )}
    </div>
  );
}
