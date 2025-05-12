export default function GameSummaryHeader({ game }) {
  return (
    <header className="mb-8 flex items-center justify-between">
      <h3 className="align-middle text-xl font-medium">
        <span className="text-3xl text-white">♞</span>{' '}
        {game.meta.players.white.player.username}{' '}
        {game.meta.players.white.player.rating}
      </h3>
      <h3 className="text-xl font-medium text-white">
        <span className="text-3xl text-black [text-shadow:-0.5px_-0.5px_0_#4F46E5,0.5px_-0.5px_0_#4F46E5,-0.5px_0.5px_0_#4F46E5,0.5px_0.5px_0_#4F46E5]">
          ♞
        </span>{' '}
        {game.meta.players.black.player.username}{' '}
      </h3>
    </header>
  );
}
