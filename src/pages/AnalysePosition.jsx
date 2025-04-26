import { useState } from "react";
import { Chessboard } from "react-chessboard";
import { analyseFEN } from "../api/analyse";
import ReactMarkdown from 'react-markdown';
import remarkGfm from "remark-gfm";

const DEFAULT_FEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
//const SAMPLE_FEN = "r1bqkbnr/pp1p1ppp/2n5/2p1p3/4P3/2P2N2/PP1P1PPP/RNBQKB1R w KQkq - 2 4"

export default function AnalysePosition() {
  const [fen, setFEN] = useState("");
  const [boardFEN, setBoardFEN] = useState(DEFAULT_FEN);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [arrows, setArrows] = useState([]);
  const [moveSquares, setMoveSquares] = useState({});
  const [explanation, setExplanation] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [userQuestion, setUserQuestion] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [loadingExplanation, setLoadingExplanation] = useState(false);

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
    setExplanation(null);
    setChatMessages([]);
    try {
      const analysis = await analyseFEN(fen);
      setResult(analysis);

      const [from, to] = getMoveParts(analysis.top_moves[0].move);

      setArrows([[from, to, "rgba(0, 255, 0, 0.6)"]]);
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

  async function handleGetExplanation() {
    setLoadingExplanation(true);
    setExplanation(null);
    try {
      const response = await fetch('http://127.0.0.1:8000/explain-lines', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fen: result.fen,
          top_moves: result.top_moves
        })
      });
      const data = await response.json();
      setExplanation(data.explanation || "Failed to get explanation.");
    } catch (err) {
      console.error(err);
      setExplanation("Error fetching explanation.");
    } finally {
      setLoadingExplanation(false);
    }
  }

  async function handleCoachChatSubmit() {
    if (!userQuestion.trim()) return;
    setChatLoading(true);
    try {
      const response = await fetch('http://127.0.0.1:8000/coach-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fen: result.fen,
          past_messages: chatMessages,
          user_message: userQuestion
        })
      });
      const data = await response.json();
      if (data.reply) {
        setChatMessages([
          ...chatMessages,
          { role: "user", content: userQuestion },
          { role: "assistant", content: data.reply }
        ]);
        setUserQuestion("");
      } else {
        console.error("Coach chat error:", data.error);
      }
    } catch (err) {
      console.error("Failed to chat with coach:", err);
    } finally {
      setChatLoading(false);
    }
  }

  function handleNewAnalysis() {
    setFEN("");
    setBoardFEN(DEFAULT_FEN);
    setResult(null);
    setArrows([]);
    setMoveSquares({});
    setExplanation(null);
    setChatMessages([]);
    setUserQuestion("");
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-4xl font-bold mb-4">Analyse Position</h1>

      {/* FEN Input + Analyse Button */}
      <div className="flex w-full max-w-lg mb-4 gap-2">
        <textarea
          className="flex-grow p-2 border border-gray-300 rounded dark:bg-gray-800 dark:text-white dark:border-gray-600 resize-none"
          rows="2"
          placeholder="Enter FEN string here"
          value={fen}
          onChange={handleFenChange}
        />
        <button
          onClick={handleAnalyse}
          disabled={!fen || loading}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 whitespace-nowrap"
        >
          {loading ? "Analysing..." : "Analyse"}
        </button>
      </div>

      {/* Error */}
      {error && <p className="mt-4 text-red-500">{error}</p>}

      {/* Board + Analysis Section */}
      {result && (
        <div className="mt-6 w-full max-w-lg bg-gray-100 dark:bg-gray-700 rounded p-4">
          <h2 className="text-2xl font-semibold mb-4">Analysis Board</h2>

          <Chessboard 
            position={boardFEN}
            customArrows={arrows}
            customSquareStyles={moveSquares}
          />

          {/* Top Moves */}
          <div className="mt-4">
            <h2 className="text-xl font-semibold mb-2">Top Recommendations</h2>
            <ul className="space-y-4">
              {result.top_moves.map((move, index) => (
                <li key={index} className="bg-white dark:bg-gray-800 p-4 rounded shadow">
                  <p className="text-lg font-bold mb-2">
                    {index === 0 ? "Best Move" : `Alternative ${index}`}
                  </p>
                  <p><strong>Move:</strong> {move.move}</p>
                  <p><strong>Evaluation:</strong> {move.evaluation > 0 ? "+" : ""}{move.evaluation}</p>
                  <p className="mt-2"><strong>Line:</strong></p>
                  <p className="text-sm text-gray-700 dark:text-gray-300 break-words">
                    {move.line.slice(0, 5).join(" → ")}{move.line.length > 5 ? " ..." : ""}
                  </p>
                </li>
              ))}
            </ul>
          </div>

          {/* Buttons */}
          <div className="flex gap-4 mt-6">
            <button
              onClick={handleGetExplanation}
              disabled={loadingExplanation}
              className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
            >
              {loadingExplanation ? "Thinking..." : "Get Coach Explanation"}
            </button>
            <button
              onClick={handleNewAnalysis}
              className="px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Start New Analysis
            </button>
          </div>

          {/* Coach Explanation */}
          {explanation && (
            <div className="mt-6 p-4 bg-green-100 dark:bg-green-900 rounded">
              <h3 className="text-lg font-bold mb-2">Coach's Insight</h3>
              <div className="prose dark:prose-invert  prose-table:border-spacing-y-2 prose-table:border-b prose-th:border-b prose-td:border-b prose-th:border-grey-700">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {explanation}
                </ReactMarkdown>
              </div>
            </div>
          )}

          {/* Coach Chat */}
          <div className="mt-8 w-full">
            <h3 className="text-lg font-bold mb-2">Ask Coach a Question</h3>

            <div className="space-y-4 mb-4">
              {chatMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`p-2 rounded ${
                    msg.role === "user"
                      ? "bg-blue-100 dark:bg-blue-700 text-right"
                      : "bg-gray-100 dark:bg-gray-700 text-left"
                  }`}
                >
                  <div className="text-sm prose dark:prose-invert whitespace-pre-wrap">
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex space-x-2">
              <input
                type="text"
                className="flex-1 p-2 border rounded dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                placeholder="Type your question..."
                value={userQuestion}
                onChange={(e) => setUserQuestion(e.target.value)}
                disabled={chatLoading}
              />
              <button
                onClick={handleCoachChatSubmit}
                disabled={!userQuestion.trim() || chatLoading}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
              >
                {chatLoading ? "Sending..." : "Ask"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
