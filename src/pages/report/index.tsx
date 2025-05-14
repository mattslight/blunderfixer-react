// src/pages/report/index.tsx
import { useGameAnalysis } from '@/pages/games/hooks/useGameAnalysis';
import { useGameData } from '@/pages/games/hooks/useGameData';
import { GameSummary } from '@/pages/report/components/GameSummary';
import { Loader } from 'lucide-react';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

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
    if (analysedIds.has(analysisId)) {
      setSelectedId(analysisId);
    } else {
      analyse(analysisId);
    }
  }, [analysisId, analysedIds, analyse, navigate, setSelectedId]);

  // guard
  if (!analysisId) return null;

  // show spinner while we’re waiting
  if (loading || !analysis.length) {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <Loader className="h-8 w-8 animate-spin text-green-400" />
        <p className="mt-4 text-lg text-gray-300">Running analysis…</p>
      </div>
    );
  }

  const game = gamesMap[analysisId]!;

  const onDrill = (pgn: string, halfMoveIndex: number) => {
    alert('Drill down to this position');
    navigate('/analyse', { state: { pgn, halfMoveIndex } });
  };

  return (
    <div className="p-0 md:p-4 2xl:ml-10">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 text-blue-600 hover:underline"
      >
        ← Back
      </button>
      <GameSummary game={game} analysis={analysis} onDrill={onDrill} />
    </div>
  );
}
