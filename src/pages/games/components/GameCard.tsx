// src/components/GameCard.tsx
import { Calendar, Timer } from 'lucide-react';
import { RecentGame } from '../hooks/useRecentGames';

interface GameCardProps {
  game: RecentGame;
  hero: string;
  onAnalyse: (g: RecentGame) => void;
}

export default function GameCard({ game, hero, onAnalyse }: GameCardProps) {
  // helper formatters (you could also lift these out)
  const tcParts = game.time_control.split('+').map(Number);
  const mins = Math.floor(tcParts[0] / 60);
  const secs = tcParts[0] % 60;
  const humanTC = `${mins > 0 ? `${mins}m${secs ? ` ${secs}s` : ''}` : `${secs}s}`}${tcParts[1] ? ` +${tcParts[1]}s` : ''}`;

  const side = game.white.username === hero ? 'white' : 'black';
  const opp = side === 'white' ? 'black' : 'white';
  const won = game[side].result === 'win';
  const lost = game[opp].result === 'win';

  const resultLabel = won ? 'Won' : lost ? 'Lost' : 'Draw';
  const resultClass = won
    ? 'bg-green-600 text-white'
    : lost
      ? 'bg-red-600 text-white'
      : 'bg-gray-600 text-white';
  const reasonLabel =
    won || lost
      ? game[won ? opp : side].result.charAt(0).toUpperCase() +
        game[won ? opp : side].result.slice(1)
      : 'Draw';
  const reasonClass =
    won || lost ? 'text-gray-400 bg-gray-800' : 'bg-gray-200 text-gray-800';

  return (
    <li
      className={`mb-6 flex flex-col rounded-lg border-l-4 bg-gray-800 p-6 ${won ? 'border-green-500' : lost ? 'border-red-500' : 'border-gray-500'}`}
    >
      <header className="mb-4">
        <h3 className="text-lg font-semibold text-white">
          {game.white.username}{' '}
          <span className="text-sm text-gray-400">({game.white.rating})</span>
          <span className="mx-2 text-gray-500">vs</span>
          {game.black.username}{' '}
          <span className="text-sm text-gray-400">({game.black.rating})</span>
        </h3>
      </header>

      <div className="mb-4 grid grid-cols-2 gap-4 text-sm text-gray-400">
        <div className="flex items-center space-x-1">
          <Calendar size={16} />
          <time dateTime={new Date(game.end_time * 1000).toISOString()}>
            {new Date(game.end_time * 1000).toLocaleString()}
          </time>
        </div>
        <div className="flex items-center space-x-1">
          <Timer size={16} />
          <span>
            {humanTC} <em>({game.rated ? 'Rated' : 'Casual'})</em>
          </span>
        </div>
        {game.termination && (
          <div>
            Termination:{' '}
            <span className="capitalize">
              {game.termination.split(' won by ')[1]}
            </span>
          </div>
        )}
      </div>

      <footer className="flex items-center justify-between">
        <div className="flex space-x-1">
          <span
            className={`rounded-full px-3 py-1 text-sm font-medium ${resultClass}`}
          >
            {resultLabel}
          </span>
          <span
            className={`rounded-full px-3 py-1 text-sm font-medium italic ${reasonClass}`}
          >
            ({reasonLabel})
          </span>
        </div>
        <button
          onClick={() => onAnalyse(game)}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          Analyse
        </button>
      </footer>
    </li>
  );
}
