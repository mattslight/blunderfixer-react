import { useProfile } from '@/hooks/useProfile';
import { getSeverity, Severity, TimeControl } from '@/lib/severity';
import { AnalysisNode, GameRecord } from '@/types';
import GameSummaryGraph from './GameSummaryGraph';
import GameSummaryHeader from './GameSummaryHeader';
import GameSummaryTable from './GameSummaryTable';

interface CombinedEntry {
  move: GameRecord['moves'][0];
  analysis: AnalysisNode;
  severity: Severity;
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

  // determine side and max plot range
  const heroSide =
    username === game.meta.players.white.player.username ? 'w' : 'b';
  const MAX = 4;

  // prepare time control
  const tc: TimeControl = {
    base: game.meta.timeControl,
    inc: game.meta.increment,
  };

  // build chart data
  const chartData = analysis.map((a) => ({
    ply: a.halfMoveIndex,
    raw: a.evalCP / 100,
    plot: Math.max(-MAX, Math.min(MAX, a.evalCP / 100)),
    ...a,
  }));

  // combine moves with severities
  const combined: CombinedEntry[] = analysis.map((a) => {
    const mv = game.moves[a.halfMoveIndex - 1];
    const severity =
      mv.side === heroSide
        ? getSeverity({
            deltaCP: a.deltaCP,
            timeSpent: mv.timeSpent,
            ply: a.halfMoveIndex,
            tc,
          })
        : 'none';
    // impact adjusted for perspective
    const impact = heroSide === 'b' ? -a.deltaCP : a.deltaCP;
    return { move: mv, analysis: a, severity, impact };
  });

  return (
    <article className="mx-auto mb-6 w-full max-w-3xl md:p-4">
      <GameSummaryHeader game={game} />
      <GameSummaryGraph data={chartData} max={MAX} />
      <GameSummaryTable combined={combined} />
    </article>
  );
}
