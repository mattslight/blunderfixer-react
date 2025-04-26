import { useState } from "react";
import { analyseFEN } from "../api/analyse-fen"; // make sure you created /api/analyse.js

export default function AnalysePosition() {
  const [fen, setFEN] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleAnalyse() {
    setLoading(true);
    setError(null);
    try {
      const analysis = await analyseFEN(fen);
      setResult(analysis);
    } catch (err) {
      console.error("Error analysing FEN:", err);
      setError("Failed to analyse position.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen p-4">
      <h1 className="text-4xl font-bold mb-4">Analyse Position</h1>
      <p className="text-lg mb-6">Paste a FEN to get started</p>

      <textarea
        className="w-full max-w-lg p-2 border border-gray-300 rounded mb-4 dark:bg-gray-800 dark:text-white dark:border-gray-600"
        rows="3"
        placeholder="Enter FEN string here"
        value={fen}
        onChange={(e) => setFEN(e.target.value)}
      />

      <button
        onClick={handleAnalyse}
        disabled={!fen || loading}
        className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "Analysing..." : "Analyse"}
      </button>

      {error && <p className="mt-4 text-red-500">{error}</p>}

      {result && (
        <div className="mt-6 p-4 w-full max-w-lg bg-gray-100 dark:bg-gray-700 rounded">
          <h2 className="text-2xl font-semibold mb-2">Analysis Result</h2>
          <pre className="whitespace-pre-wrap break-words">{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
