// src/pages/games/components/GameSummary.tsx
import { AnalysisNode, GameRecord } from '@/types';
import GameSummaryGraph from './GameSummaryGraph';
import GameSummaryHeader from './GameSummaryHeader';
import GameSummaryTable from './GameSummaryTable';

interface GameSummaryProps {
  game: GameRecord;
  analysis: AnalysisNode[];
}

export function GameSummary({ game, analysis }: GameSummaryProps) {
  const MAX = 6; // ±6 pawn cap
  const TACTIC = 300; // 3-pawn threshold

  // Prepare data for the graph
  const chartData = analysis.map((a) => {
    const raw = a.evalCP / 100;
    const plot = Math.max(-MAX, Math.min(MAX, raw));
    return { ply: a.halfMoveIndex + 1, raw, plot, ...a };
  });

  // Combine analysis nodes with moves and flag blunders
  const combined = analysis.map((a) => {
    const move = game.moves[a.halfMoveIndex];
    const isBlunder =
      (move.side === 'w' && a.deltaCP <= -TACTIC) ||
      (move.side === 'b' && a.deltaCP >= TACTIC);
    return { move, a, isBlunder };
  });

  return (
    <article className="mx-auto mb-6 w-full max-w-3xl md:p-4">
      <GameSummaryHeader game={game} />
      <GameSummaryGraph data={chartData} max={MAX} />
      <GameSummaryTable combined={combined} tacticThreshold={TACTIC} />
    </article>
  );
}
