export default function GameSummaryHeader({ game, tacticThreshold }) {
  return (
    <header className="mb-4 flex items-center justify-between">
      <div>
        <h3 className="text-lg font-medium">
          {game.meta.players.white.player.username}{' '}
          <span className="text-xl text-white">♞</span> vs{' '}
          {game.meta.players.black.player.username}{' '}
          <span className="text-xl text-black [text-shadow:-0.5px_-0.5px_0_#fff,0.5px_-0.5px_0_#fff,-0.5px_0.5px_0_#fff,0.5px_0.5px_0_#fff]">
            ♞
          </span>
        </h3>
        <p className="text-sm text-gray-400">
          {game.meta.date} • {game.meta.timeControl}+{game.meta.increment}s •{' '}
          {game.meta.timeClass}
        </p>
      </div>
      <div className="text-sm">
        Blunders (Δ≤–{tacticThreshold}): coming soon
      </div>
    </header>
  );
}
