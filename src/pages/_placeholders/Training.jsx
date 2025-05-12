import { Flag, PlayCircle, Target } from 'lucide-react';

export default function Training() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 px-8 text-white">
      {/* Hero */}
      <h1 className="mb-4 items-center justify-center text-center text-4xl font-extrabold md:text-5xl">
        🔥 Training Coming Soon!
      </h1>
      <p className="mb-8 max-w-xl text-center text-xl text-slate-300">
        Automatically spot your most common mistake patterns and drill them with
        replayable exercises pulled straight from your own games.
      </p>

      {/* Key Benefits */}
      <ul className="mb-12 w-full max-w-md space-y-8">
        <li className="flex items-start">
          <Flag className="mt-1 h-6 w-6 text-green-400" />
          <div className="ml-4">
            <h3 className="font-bold text-white">Pattern Detection</h3>
            <p className="text-slate-300">
              Instantly flag recurring tactical, positional or time-pressure
              errors.
            </p>
          </div>
        </li>
        <li className="flex items-start">
          <PlayCircle className="mt-1 h-6 w-6 text-green-400" />
          <div className="ml-4">
            <h3 className="font-bold text-white">Bespoke Drills</h3>
            <p className="text-slate-300">
              Practice replayable drills generated from your actual game
              positions.
            </p>
          </div>
        </li>
        <li className="flex items-start">
          <Target className="mt-1 h-6 w-6 text-green-400" />
          <div className="ml-4">
            <h3 className="font-bold text-white">Mastery Score</h3>
            <p className="text-slate-300">
              Earn a playback score and repeat the drill until you truly master
              it.
            </p>
          </div>
        </li>
      </ul>

      {/* Call to Action */}
      <button className="rounded-lg border-b-4 border-b-green-700 bg-green-500 px-8 py-3 text-lg font-semibold text-white transition hover:bg-green-600">
        Notify Me When Live
      </button>
    </div>
  );
}
