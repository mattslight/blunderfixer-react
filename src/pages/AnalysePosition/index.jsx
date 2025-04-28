import { useState } from "react";
import { Chessboard } from "react-chessboard";
import { analyseFEN, extractFeatures } from "../../api/analyse";
import ReactMarkdown from 'react-markdown';
import remarkGfm from "remark-gfm";
import TopmovesCarousel from "./TopmovesCarousel"

const DEFAULT_FEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

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
  const [showFeatures, setShowFeatures] = useState(false);

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

      const [analysis, features] = await Promise.all([
        analyseFEN(fen, 5),
        extractFeatures(fen),
      ]);
      setResult({ ...analysis, features });

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
          fen:         result.fen,
          top_moves:   result.top_moves,
          legal_moves: result.legal_moves,
          features:    result.features,
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
          legal_moves: result.legal_moves,
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
    <div className="flex flex-col items-center justify-center min-h-screen">
      {!result && (
      <>
        <h1 className="text-4xl font-bold mb-4">Analyse Position</h1>
        <div className="flex flex-col w-full max-w-lg mb-16 space-y-4">
          {/* Row 1: FEN input + Analyse button */}
          <div className="flex gap-2">
            <textarea
              className="flex-1 p-2 border border-gray-300 rounded dark:bg-gray-800 dark:text-white dark:border-gray-600 resize-none"
              rows={2}
              placeholder="Paste a FEN string here to start analysing..."
              value={fen}
              onChange={handleFenChange}
            />
            <button
              onClick={handleAnalyse}
              disabled={!fen || loading}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 whitespace-nowrap"
            >
              {loading ? "Loading..." : "Load"}
            </button>
          </div>

          {/* Row 2: Example Positions */}
          <div>
            <h2 className="text-sm font-semibold mb-1">Example Positions</h2>
            <div className="flex flex-wrap gap-2">
              {[
                  ["Sicilian-ish 🏁",   "r1bqkbnr/pp1p1ppp/2n5/2p1p3/4P3/2P2N2/PP1P1PPP/RNBQKB1R w KQkq - 2 4"],
                  ["Simple tactic 🎯",  "4kb1r/p4ppp/4q3/8/8/1B6/PPP2PPP/2KR4 w - - 0 1"],
                  ["One move ⚔️",  "5k1r/2q3p1/p3p2p/1B3p1Q/n4P2/6P1/bbP2N1P/1K1RR3"],
                  ["Fried Liver 🗡️",    "r1bqkb1r/ppp2Npp/2n5/3np3/2B5/8/PPPP1PPP/RNBQK2R b KQkq - 0 6"],
                  ["Berlin 🧐", "r1bq1bnr/ppp2kpp/2p5/4np2/4P3/8/PPPP1PPP/RNBQ1RK1 w - - 0 9"],
                  ["Engine Stress 🤯",  "qrb5/rk1p1K2/p2P4/Pp6/1N2n3/6p1/5nB1/6b1 w - - 0 1"],
                  ["Nimzo-Indian ♞",    "rnbqk2r/pppp1ppp/4pn2/8/1bPP4/2N5/PP2PPPP/R1BQKBNR w KQkq - 0 4"]
              ].map(([label, fenStr]) => (
                <button
                  key={fenStr}
                  onClick={() => {
                    setFEN(fenStr);
                    setBoardFEN(fenStr);
                  }}
                  className="text-xs px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </>
    )}


      {/* Error */}
      {error && <p className="mt-4 text-red-500">{error}</p>}

      {/* Board + Analysis Section */}
      {result && (
        <div className="w-full max-w-lg rounded">
          <Chessboard 
            position={boardFEN}
            customArrows={arrows}
            customSquareStyles={moveSquares}
          />

          {/* Top Moves Carousel */}

          <TopmovesCarousel 
            result={result} 
            onSlideChange={(index) => {
              if (!result?.top_moves[index]) return;
              const [from, to] = getMoveParts(result.top_moves[index].move);
              setArrows([[from, to, "rgba(0, 255, 0, 0.6)"]]);
              setMoveSquares({
                [from]: { backgroundColor: "rgba(255, 255, 0, 0.5)" },
                [to]: { backgroundColor: "rgba(0, 255, 0, 0.5)" },
              });
            }}
          />


          {/* Buttons */}
          <div className="flex gap-4 mt-6">
            {!explanation && <button
              onClick={handleGetExplanation}
              disabled={loadingExplanation}
              className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
            >
              {loadingExplanation ? "Thinking..." : "Get Coach Explanation"}
            </button>}
            <button
              onClick={handleNewAnalysis}
              className="px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              New Position
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

          {/* 🧩 Position Features toggle */}
          <button
            onClick={() => setShowFeatures(f => !f)}
            className="mt-6 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
          >
            {showFeatures ? "Hide 🧩 Position Features" : "Show 🧩 Position Features"}
          </button>

          {/* collapsible panel */}
          {showFeatures && (
            <div className="w-full max-w-lg mt-4 p-4 bg-gray-100 dark:bg-gray-800 rounded overflow-auto">
              <h4 className="font-semibold mb-2">Raw Feature Dump</h4>
              <pre className="text-xs whitespace-pre-wrap">
                {JSON.stringify(result.features, null, 2)}
              </pre>
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
