import GameLoader from './analyse/components/GameLoader';

export default function GameHistory() {
  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <h1 className="mt-20 mb-4 text-4xl font-bold">Game History</h1>
      <GameLoader />
    </div>
  );
}
