// src/pages/games/components/GameSummary.tsx
import { useProfile } from '@/hooks/useProfile';
import {
  getErrorSeverity,
  getTimeSeverity,
  Severity,
  TimeControl,
} from '@/lib/severity';
import { AnalysisNode, GameRecord } from '@/types';
import GameSummaryGraph from './GameSummaryGraph';
import GameSummaryHeader from './GameSummaryHeader';
import GameSummaryTable from './GameSummaryTable';
import TimeUsageChart from './TimeUsageChart';

interface CombinedEntry {
  move: GameRecord['moves'][0];
  analysis: AnalysisNode;
  tags: Severity[];
  impact: number;
}

interface GameSummaryProps {
  game: GameRecord;
  analysis: AnalysisNode[];
}

type TimePoint = { move: number; heroTime: number; oppTime: number };

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

  // combine moves with dual-tag severities
  const combined: CombinedEntry[] = analysis.map((a) => {
    const mv = game.moves[a.halfMoveIndex - 1];
    // compute both error and time tags
    let tags: Severity[] = [];
    if (mv.side === heroSide) {
      const errTag = getErrorSeverity(a.deltaCP);
      const timeTag = getTimeSeverity({
        deltaCP: a.deltaCP,
        timeSpent: mv.timeSpent,
        ply: a.halfMoveIndex,
        tc,
      });
      tags = [errTag, timeTag].filter((t) => t !== 'none') as Severity[];
    }
    if (tags.length === 0) tags = ['none'];

    // impact adjusted for perspective
    const impact = heroSide === 'b' ? -a.deltaCP : a.deltaCP;
    return { move: mv, analysis: a, tags, impact };
  });

  // build time usage series
  const timeData: TimePoint[] = [];
  analysis.forEach((a) => {
    const ply = a.halfMoveIndex;
    const full = Math.ceil(ply / 2);
    const mv = game.moves[ply - 1];
    const isHero = mv.side === heroSide;
    const t = mv.timeSpent ?? 0;

    let pt = timeData.find((x) => x.move === full);
    if (!pt) {
      pt = { move: full, heroTime: 0, oppTime: 0 };
      timeData.push(pt);
    }
    if (isHero) pt.heroTime += t;
    else pt.oppTime += t;
  });

  return (
    <article className="mx-auto mb-6 w-full max-w-3xl space-y-6 md:p-4">
      <GameSummaryHeader game={game} />
      <GameSummaryGraph data={chartData} max={MAX} />
      <TimeUsageChart data={timeData} game={game} heroSide={heroSide} />
      <GameSummaryTable combined={combined} />
    </article>
  );
}
