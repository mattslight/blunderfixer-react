// src/components/AnalyseContainer.jsx
import { useState } from 'react';

import AnalysePGN from './AnalysePGN'; // new, for PGN+games
import AnalysePosition from './AnalysePosition'; // as‐is, for FEN
import GameLoader from './GameLoader'; // new: fetch & pick games

import { useStockfish } from '@/hooks/useStockfish';

export default function AnalyseContainer() {
  const [mode, setMode] = useState('fen');
  const [selectedGamePGN, setSelectedGamePGN] = useState(null);
  const [analysisKey, setAnalysisKey] = useState(0);
  const { stopAnalysis } = useStockfish(/* same args */);

  const handleNewAnalysis = () => {
    setMode('fen');
    setSelectedGamePGN(null);
    setAnalysisKey((k) => k + 1);
    stopAnalysis();
  };

  return (
    <div className="p-4">
      {/* mode tabs */}
      <div className="mb-6 flex items-center justify-center gap-4">
        {['fen', 'pgn'].map((m) => (
          <button
            key={m}
            onClick={() => {
              setMode(m);
              setSelectedGamePGN(null);
            }}
            className={`rounded px-4 py-2 ${
              mode === m
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700'
            }`}
          >
            {m === 'fen' ? 'Analyse FEN' : 'Analyse Recent Games'}
          </button>
        ))}
        <button
          onClick={handleNewAnalysis}
          className="rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700"
        >
          New Analysis
        </button>
      </div>

      {mode === 'fen' && <AnalysePosition key={analysisKey} />}

      {mode === 'pgn' && (
        <>
          {!selectedGamePGN ? (
            <GameLoader onSelectPGN={setSelectedGamePGN} />
          ) : (
            <AnalysePGN
              pgn={selectedGamePGN}
              onBack={() => setSelectedGamePGN(null)}
            />
          )}
        </>
      )}
    </div>
  );
}
