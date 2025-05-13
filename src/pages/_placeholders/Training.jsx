import { Flag, PlayCircle, Target } from 'lucide-react';

export default function Training() {
  return (
    <div className="-mt-14 flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 p-8 text-white">
      {/* Hero */}
      <h1 className="mb-4 text-center text-4xl font-extrabold md:text-5xl">
        🔥 Training Coming Soon!
      </h1>
      <p className="mb-8 max-w-md text-center text-xl text-slate-300">
        Identify your top mistakes and drill them with real-game exercises
      </p>

      {/* Key Benefits */}
      <ul className="mx-auto mb-12 max-w-sm space-y-6">
        <li className="flex items-start">
          <Flag className="mt-1 h-6 w-6 text-green-400" />
          <div className="ml-3">
            <h3 className="font-bold">Quick Detection</h3>
            <p className="text-slate-300">Highlight repeat errors instantly</p>
          </div>
        </li>
        <li className="flex items-start">
          <PlayCircle className="mt-1 h-6 w-6 text-green-400" />
          <div className="ml-3">
            <h3 className="font-bold">Real Drills</h3>
            <p className="text-slate-300">Practice with your own positions</p>
          </div>
        </li>
        <li className="flex items-start">
          <Target className="mt-1 h-6 w-6 text-green-400" />
          <div className="ml-3">
            <h3 className="font-bold">Mastery Score</h3>
            <p className="text-slate-300">Track progress until mastery</p>
          </div>
        </li>
      </ul>

      {/* Call to Action */}
      <button className="rounded-lg border-b-4 border-b-green-700 bg-green-500 px-8 py-3 text-lg font-semibold transition hover:bg-green-600">
        Notify Me
      </button>
    </div>
  );
}
