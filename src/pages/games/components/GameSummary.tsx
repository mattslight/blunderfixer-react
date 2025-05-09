// src/components/GameSummary/GameSummary.tsx
import { GameRecord, AnalysisNode } from '@/types';
import GameSummaryGraph from './GameSummaryGraph';
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
    <article className="mb-6 rounded border border-gray-700 p-4">
      <div className="mb-6 h-40">
        <GameSummaryGraph data={chartData} max={MAX} />
      </div>
      <header className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">
            {game.meta.players.white.player.username} vs{' '}
            {game.meta.players.black.player.username}
          </h3>
          <p className="text-sm text-gray-400">
            {game.meta.date} • {game.meta.timeControl}+{game.meta.increment}s •{' '}
            {game.meta.timeClass}
          </p>
        </div>
        <div className="text-sm">Blunders (Δ≤–{TACTIC}): coming soon</div>
      </header>

      <GameSummaryTable combined={combined} tacticThreshold={TACTIC} />
    </article>
  );
}
