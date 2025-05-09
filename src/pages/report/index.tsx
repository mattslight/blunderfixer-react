// src/pages/report/index.tsx
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useGameData } from '@/pages/games/hooks/useGameData';
import { useGameAnalysis } from '@/pages/games/hooks/useGameAnalysis';
import { GameSummary } from '@/pages/games/components/GameSummary';

export default function ReportPage() {
  const { analysisId } = useParams<{ analysisId: string }>();
  const navigate = useNavigate();
  const { gamesMap } = useGameData();
  const { analysis, loading, analysedIds, analyse, setSelectedId } =
    useGameAnalysis(gamesMap);

  useEffect(() => {
    if (!analysisId) {
      navigate('/games');
      return;
    }
    // if we already analysed, just pick it; if not, kick off analysis
    if (analysedIds.has(analysisId)) {
      setSelectedId(analysisId);
    } else {
      analyse(analysisId);
    }
  }, [analysisId, analysedIds, analyse, navigate, setSelectedId]);

  if (!analysisId) return null;
  if (loading || !analysis.length) {
    return <p className="p-4">Running analysis…</p>;
  }

  const game = gamesMap[analysisId]!;

  return (
    <div className="p-4">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 text-blue-600 hover:underline"
      >
        ← Back to games
      </button>
      <GameSummary game={game} analysis={analysis} />
    </div>
  );
}
