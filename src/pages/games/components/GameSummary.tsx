// src/pages/games/components/GameSummary.tsx
import { useProfile } from '@/hooks/useProfile';
import { AnalysisNode, GameRecord } from '@/types';
import GameSummaryGraph from './GameSummaryGraph';
import GameSummaryHeader from './GameSummaryHeader';
import GameSummaryTable from './GameSummaryTable';

const BLUNDER = 200; // ≥3-pawn
const MISTAKE = 100; // ≥1-pawn
const INACCURACY = 40; // ≥0.2-pawn

type Severity = 'blunder' | 'mistake' | 'inaccuracy' | 'none';
type Actor = 'hero' | 'opponent';

function getSeverity(deltaCP: number): Severity {
  const absΔ = Math.abs(deltaCP);
  if (absΔ >= BLUNDER) return 'blunder';
  if (absΔ >= MISTAKE) return 'mistake';
  if (absΔ >= INACCURACY) return 'inaccuracy';
  return 'none';
}

interface CombinedEntry {
  move: GameRecord['moves'][0];
  analysis: AnalysisNode;
  severity: Severity;
  actor: Actor;
  impact: number;
}

interface GameSummaryProps {
  game: GameRecord;
  analysis: AnalysisNode[];
}

export function GameSummary({ game, analysis }: GameSummaryProps) {
  const {
    profile: { username },
  } = useProfile();
  const heroSide =
    username === game.meta.players.white.player.username ? 'w' : 'b';
  const MAX = 6;

  console.log(analysis);

  const chartData = analysis.map((a) => ({
    ply: a.halfMoveIndex,
    raw: a.evalCP / 100,
    plot: Math.max(-MAX, Math.min(MAX, a.evalCP / 100)),
    ...a,
  }));

  const combined: CombinedEntry[] = analysis.map((a) => {
    const mv = game.moves[a.halfMoveIndex - 1];
    const sev = mv.side === heroSide ? getSeverity(a.deltaCP) : 'none';
    const actor = mv.side === heroSide ? 'hero' : 'opponent';
    const impact = heroSide === 'b' ? -a.deltaCP : a.deltaCP;

    return { move: mv, analysis: a, severity: sev, actor, impact };
  });

  return (
    <article className="mx-auto mb-6 w-full max-w-3xl md:p-4">
      <GameSummaryHeader game={game} />
      <GameSummaryGraph data={chartData} max={MAX} />
      <GameSummaryTable combined={combined} />
    </article>
  );
}
