import { useEffect, useState } from 'react';
import { Chessboard } from 'react-chessboard';

import { analyseFEN, extractFeatures } from '../../api/analyse';

import CoachChat from './CoachChat';
import CoachExplanation from './CoachExplanation';
import ExamplePositions from './ExamplePositions';
import { useCoachExplanation } from './hooks/useCoachExplanation';
import PositionFeatures from './PositionFeatures';
import TopmovesCarousel from './TopmovesCarousel';

const DEFAULT_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

export default function AnalysePosition({ startingFen, pgnMode = false }) {
  // Inputs: prefill FEN from startingFen if provided
  const [fen, setFEN] = useState(startingFen || '');
  const [boardFEN, setBoardFEN] = useState(startingFen || DEFAULT_FEN);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [arrows, setArrows] = useState([]);
  const [moveSquares, setMoveSquares] = useState({});

  // When startingFen changes (e.g., via PGN stepping), update both input + board
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

  const {
    explanation,
    loadingExplanation,
    error: explanationError,
    getExplanation,
  } = useCoachExplanation();

  function handleFenChange(e) {
    const newFen = e.target.value.trim();
    setFEN(newFen);
    setBoardFEN(newFen || DEFAULT_FEN);
  }

  function getMoveParts(moveString) {
    if (!moveString || moveString.length < 4) return [null, null];
    return [moveString.slice(0, 2), moveString.slice(2, 4)];
  }

  async function handleAnalyse() {
    setLoading(true);
    setError(null);
    setArrows([]);
    setMoveSquares({});
    try {
      const [analysis, features] = await Promise.all([
        analyseFEN(fen, 5),
        extractFeatures(fen),
      ]);
      setResult({ ...analysis, features });

      // Highlight best move
      const [from, to] = getMoveParts(analysis.top_moves[0].move);
      setArrows([[from, to, 'rgba(0, 255, 0, 0.6)']]);
      setMoveSquares({
        [from]: { backgroundColor: 'rgba(255, 255, 0, 0.5)' },
        [to]: { backgroundColor: 'rgba(0, 255, 0, 0.5)' },
      });
    } catch (err) {
      console.error('Error analysing FEN:', err);
      setError('Failed to analyse position.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center space-y-6">
      {/* Board always on top (full width) */}
      <div className="w-full max-w-lg">
        <Chessboard
          position={boardFEN}
          customArrows={arrows}
          customSquareStyles={moveSquares}
          customBoardStyle={{
            borderRadius: '6px',
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.5)',
          }}
          customDarkSquareStyle={{
            backgroundColor: '#779952',
          }}
          customLightSquareStyle={{
            backgroundColor: '#edeed1',
          }}
        />
      </div>

      {/* Controls: FEN input + Analyse button */}
      {!result && (
        <div className="flex w-full max-w-lg flex-col space-y-2">
          {!pgnMode && (
            <textarea
              rows={2}
              className="w-full resize-none rounded border border-gray-300 p-2 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
              placeholder="Paste a FEN string here to start analysing..."
              value={fen}
              onChange={handleFenChange}
            />
          )}
          <button
            onClick={handleAnalyse}
            disabled={!fen || loading}
            className="w-full rounded bg-blue-600 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Analysing…' : 'Analyse'}
          </button>
        </div>
      )}

      {/* Example positions + error */}
      {!result && !pgnMode && (
        <div className="w-full max-w-lg space-y-2">
          <ExamplePositions setFEN={setFEN} setBoardFEN={setBoardFEN} />
          {(error || explanationError) && (
            <p className="text-red-500">{error || explanationError}</p>
          )}
        </div>
      )}

      {/* Analysis results below controls */}
      {result && (
        <div className="flex w-full max-w-lg flex-col space-y-4">
          <TopmovesCarousel
            result={result}
            onSlideChange={(idx) => {
              const mv = result.top_moves[idx];
              if (!mv) return;
              const [f, t] = getMoveParts(mv.move);
              setArrows([[f, t, 'rgba(0, 255, 0, 0.6)']]);
              setMoveSquares({
                [f]: { backgroundColor: 'rgba(255, 255, 0, 0.5)' },
                [t]: { backgroundColor: 'rgba(0, 255, 0, 0.5)' },
              });
            }}
          />
          <div className="flex space-x-2">
            {!explanation && (
              <button
                onClick={() =>
                  getExplanation({
                    fen,
                    top_moves: result.top_moves,
                    legal_moves: result.legal_moves,
                    features: result.features,
                  })
                }
                disabled={loadingExplanation}
                className="flex-1 rounded bg-green-600 py-2 text-white hover:bg-green-700 disabled:opacity-50"
              >
                {loadingExplanation ? 'Thinking…' : 'Get Explanation'}
              </button>
            )}
          </div>
          {explanation && <CoachExplanation explanation={explanation} />}
          <PositionFeatures features={result.features} />
          <CoachChat result={result} />
        </div>
      )}
    </div>
  );
}
