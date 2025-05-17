// src/pages/report/index.tsx
import { useProfile } from '@/hooks/useProfile';
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

  const {
    profile: { username },
  } = useProfile();

  const heroSide =
    username === game.meta.players.white.player.username ? 'w' : 'b';

  const onDrill = (pgn: string, halfMoveIndex: number) => {
    navigate('/analyse', { state: { pgn, halfMoveIndex, heroSide } });
  };

  return (
    <div className="mx-auto max-w-6xl p-0 md:p-4">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 ml-4 text-blue-600 hover:underline"
      >
        ← Back
      </button>
      <GameSummary
        game={game}
        analysis={analysis}
        onDrill={onDrill}
        heroSide={heroSide}
      />
    </div>
  );
}
