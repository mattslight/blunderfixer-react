import { formatDistanceToNow } from 'date-fns';

export default function GameSummaryHeader({ game }) {
  // assume game.meta.endTime is seconds since epoch
  const dateObj = new Date(game.meta.endTime * 1000);
  const dateStr = formatDistanceToNow(dateObj, { addSuffix: true }).replace(
    /^about\s*/,
    ''
  );
  return (
    <header className="mb-4 flex items-center justify-between">
      <div>
        <h3 className="text-xl font-medium">
          {game.meta.players.white.player.username}{' '}
          <span className="text-2xl text-white">♞</span>{' '}
          <span className="px-2 text-lg text-gray-400">vs.</span>{' '}
          {game.meta.players.black.player.username}{' '}
          <span className="text-2xl text-black [text-shadow:-0.5px_-0.5px_0_#fff,0.5px_-0.5px_0_#fff,-0.5px_0.5px_0_#fff,0.5px_0.5px_0_#fff]">
            ♞
          </span>
        </h3>
        <p className="text-sm text-gray-400">
          {dateStr} • {game.meta.timeControl}+{game.meta.increment}s •{' '}
          {game.meta.timeClass}
        </p>
      </div>
    </header>
  );
}
