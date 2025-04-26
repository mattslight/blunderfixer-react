import { useState } from "react";
import { Chessboard } from "react-chessboard";
import { analyseFEN } from "../api/analyse";

const DEFAULT_FEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

export default function AnalysePosition() {
  const [fen, setFEN] = useState("");
  const [boardFEN, setBoardFEN] = useState(DEFAULT_FEN);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [arrows, setArrows] = useState([]);
  const [moveSquares, setMoveSquares] = useState({});

  function handleFenChange(e) {
    const newFen = e.target.value;
    setFEN(newFen);
    if (newFen.trim() !== "") {
      setBoardFEN(newFen.trim());
    } else {
      setBoardFEN(DEFAULT_FEN);
    }
  }

  function getMoveParts(moveString) {
    if (!moveString || moveString.length < 4) return [null, null];
    const from = moveString.slice(0, 2);
    const to = moveString.slice(2, 4);
    return [from, to];
  }

  async function handleAnalyse() {
    setLoading(true);
    setError(null);
    setArrows([]);
    setMoveSquares({});
    try {
      const analysis = await analyseFEN(fen);
      setResult(analysis);

      const [from, to] = getMoveParts(analysis.top_moves[0].move);

      // Draw arrow
      setArrows([[from, to, "rgba(0, 255, 0, 0.6)"]]);

      // Animate move
      setMoveSquares({
        [from]: { backgroundColor: "rgba(255, 255, 0, 0.5)" },
        [to]: { backgroundColor: "rgba(0, 255, 0, 0.5)" },
      });

    } catch (err) {
      console.error("Error analysing FEN:", err);
      setError("Failed to analyse position.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-4xl font-bold mb-4">Analyse Position</h1>
      <p className="text-lg mb-6">Paste a FEN to get started</p>

      <textarea
        className="w-full max-w-lg p-2 border border-gray-300 rounded mb-4 dark:bg-gray-800 dark:text-white dark:border-gray-600 overflow-x-auto resize-none"
        rows="2"
        placeholder="Enter FEN string here"
        value={fen}
        onChange={handleFenChange}
      />

      <button
        onClick={handleAnalyse}
        disabled={!fen || loading}
        className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "Analysing..." : "Analyse"}
      </button>

      {error && <p className="mt-4 text-red-500">{error}</p>}

      <div className="mt-6 w-full max-w-lg bg-gray-100 dark:bg-gray-700 rounded p-4">
        <h2 className="text-2xl font-semibold mb-4">Analysis Board</h2>

        <Chessboard 
          position={boardFEN}
          customArrows={arrows}
          customSquareStyles={moveSquares}
        />

        {result && (
          <div className="mt-4">
            <p><strong>Best Move:</strong> {result.top_moves[0].move}</p>
            <p><strong>Evaluation:</strong> {result.top_moves[0].evaluation > 0 ? "+" : ""}{result.top_moves[0].evaluation}</p>
          </div>
        )}
      </div>
    </div>
  );
}
