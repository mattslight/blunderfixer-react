// src/pages/AnalysePosition/GameLoader.jsx
import { useState } from 'react';
import { Calendar, Timer } from 'lucide-react';

// helper to turn "180+2" → "3 min + 2 s", "600" → "10 min"
function formatTimeControl(tc) {
  if (!tc) return '';
  const parts = tc.split('+');
  const init = parseInt(parts[0], 10) || 0;
  const inc = parts[1] != null ? parseInt(parts[1], 10) : null;
  const mins = Math.floor(init / 60);
  const secs = init % 60;
  let initialStr = '';

  if (mins > 0) {
    initialStr = `${mins} min`;
    if (secs > 0) initialStr += ` ${secs}s`;
  } else {
    initialStr = `${secs}s`;
  }

  if (inc != null && !isNaN(inc)) {
    return `${initialStr} + ${inc}s`;
  }
  return initialStr;
}

// capitalize first letter
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// parse a PGN header by name
function parseHeader(pgn, header) {
  const re = new RegExp(`\\[${header} "(.*?)"\\]`);
  const match = pgn.match(re);
  return match ? match[1] : '';
}

export default function GameLoader({ onSelect }) {
  const [username, setUsername] = useState('');
  const [games, setGames] = useState([]);

  async function loadGames() {
    const res = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/public/players/${username}/recent-games?limit=10`
    );
    if (!res.ok) {
      alert('Failed to fetch games');
      return;
    }
    const data = await res.json();
    setGames(data);
  }

  return (
    <div className="mx-auto min-h-screen max-w-lg space-y-4">
      <div className="flex gap-2">
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Chess.com username"
          className="flex-1 rounded border p-2 dark:bg-stone-700 dark:text-white"
        />
        <button
          onClick={loadGames}
          disabled={!username.trim()}
          className="rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700 disabled:opacity-50"
        >
          Load
        </button>
      </div>

      <ul className="space-y-2">
        {games.map((g) => {
          const hero = username.trim().toLowerCase();
          const whiteU = g.white.username.toLowerCase();
          const blackU = g.black.username.toLowerCase();
          const heroSide =
            whiteU === hero ? 'white' : blackU === hero ? 'black' : null;
          const oppSide = heroSide === 'white' ? 'black' : 'white';

          // result pills
          let resultLabel, resultClass, borderClass;
          if (
            (heroSide === 'white' && g.white.result === 'win') ||
            (heroSide === 'black' && g.black.result === 'win')
          ) {
            resultLabel = 'Won';
            resultClass = 'bg-green-600 text-white';
            borderClass = 'border-l-4 border-green-500';
          } else if (
            heroSide &&
            ((heroSide === 'white' && g.black.result === 'win') ||
              (heroSide === 'black' && g.white.result === 'win'))
          ) {
            resultLabel = 'Lost';
            resultClass = 'bg-red-600 text-white';
            borderClass = 'border-l-4 border-red-500';
          } else {
            resultLabel = 'Draw';
            resultClass = 'bg-stone-600 text-white';
            borderClass = 'border-l-4 border-stone-500';
          }

          // reason pills
          let reasonLabel, reasonClass;
          if (resultLabel === 'Won') {
            reasonLabel = capitalize(g[oppSide].result || '');
            reasonClass = 'text-stone-400 bg-grey-800';
          } else if (resultLabel === 'Lost') {
            reasonLabel = capitalize(g[heroSide].result || '');
            reasonClass = 'text-stone-400 bg-grey-800';
          } else {
            reasonLabel = 'Draw';
            reasonClass = 'bg-stone-200 text-stone-800';
          }

          // time control
          const humanTC = formatTimeControl(g.time_control);
          // opening info
          const ecoCode = g.eco || parseHeader(g.pgn, 'ECO');
          const ecoUrl = g.eco_url || parseHeader(g.pgn, 'ECOUrl');
          const rawName = ecoUrl.split('/').pop() || '';
          const namePart = rawName.split('.')[0] || '';
          const openingName = namePart.replace(/-/g, ' ');

          return (
            <li
              key={g.uuid}
              className={`mb-6 flex flex-col rounded-lg bg-stone-800 p-6 transition-shadow hover:shadow-lg ${borderClass}`}
            >
              {/* Players */}
              <div className="mb-2">
                <h3 className="text-lg font-semibold text-white">
                  {g.white.username}{' '}
                  <span className="text-sm text-stone-400">
                    ({g.white.rating})
                  </span>
                  <span className="mx-2 text-stone-500">vs</span>
                  {g.black.username}{' '}
                  <span className="text-sm text-stone-400">
                    ({g.black.rating})
                  </span>
                </h3>
              </div>

              {/* Metadata */}
              <div className="mb-4 grid grid-cols-2 gap-4 text-sm text-stone-400">
                <div className="flex items-center space-x-1">
                  <Calendar size={16} />
                  <time dateTime={new Date(g.end_time * 1000).toISOString()}>
                    {new Date(g.end_time * 1000).toLocaleString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </time>
                </div>
                <div className="flex items-center space-x-1">
                  <Timer size={16} />
                  <span>
                    {humanTC}{' '}
                    <span className="italic">
                      ({g.rated ? 'Rated' : 'Casual'})
                    </span>
                  </span>
                </div>
                {g.termination && (
                  <div>
                    Termination:{' '}
                    <span className="capitalize">
                      {g.termination.split(' won by ')[1]}
                    </span>
                  </div>
                )}
              </div>
              {/* Opening */}
              {ecoCode && ecoUrl && (
                <div className="mb-4 text-sm text-stone-300">
                  {openingName}{' '}
                  <a
                    href={ecoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium underline"
                  >
                    {ecoCode}
                  </a>
                </div>
              )}

              {/* Footer: pills + button */}
              <div className="flex items-center justify-between">
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
                  onClick={() => onSelect(g)}
                  className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                >
                  Analyse
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
