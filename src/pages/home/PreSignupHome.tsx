import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import ConfirmModal from './ConfirmModal';
import UsernameModal from './UsernameModal';

import { useProfile } from '@/hooks/useProfile';

import {
  Flag,
  MessageCircleWarning,
  Play,
  PlayCircle,
  PlugZap,
  Target,
  Trophy,
} from 'lucide-react';

import CoachingBoard from './CoachingBoard';

export default function HomePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [usernameError, setUsernameError] = useState<string | undefined>();
  const [pendingProfile, setPendingProfile] = useState<{
    username: string;
    name?: string;
    avatar?: string;
    country?: string;
  } | null>(null);

  const { setUsername } = useProfile();
  const navigate = useNavigate();

  function handleSubmit(candidate: string) {
    setUsernameError(undefined);
    fetch(`https://api.chess.com/pub/player/${candidate.toLowerCase()}`)
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((profile: any) => {
        setPendingProfile({
          username: profile.username,
          name: profile.name,
          avatar: profile.avatar, // url to their avatar
          country: profile.country, // free-text location
        });
      })
      .catch(() => setUsernameError('That handle doesn’t exist on Chess.com.'));
  }

  function handleConfirm() {
    if (!pendingProfile) return;
    setUsername(pendingProfile.username);
    setPendingProfile(null);
    setIsModalOpen(false);
    navigate('/games');
  }

  function handleCancelConfirm() {
    setPendingProfile(null);
    setIsModalOpen(true);
  }

  return (
    <div className="-mt-10 min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 p-6 text-white sm:p-10">
      {/* Hero */}
      <section className="bg-noise container mx-auto mt-16 mb-10 p-4 text-center">
        <h1 className="mb-4 text-center text-5xl font-extrabold text-white lg:text-7xl">
          <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            The <span className="text-white">#1</span> AI Chess Coach
          </span>
        </h1>

        <p className="mb-8 text-2xl text-slate-300">
          Learn from your mistakes – <i>fast</i>
        </p>
        <div className="flex flex-col items-center justify-center space-y-1 md:flex-row md:gap-8">
          <p className="text-md text-slate-400">
            <b className="text-slate-200">345,920</b> Blunders Fixed
          </p>
          <p className="text-md text-slate-400">
            <span className="mr-1 text-green-400">♥</span>
            Trusted by <b className="text-slate-200">3,289</b> Chess lovers
          </p>
        </div>
        <div className="mx-auto mt-20 grid max-w-2xl grid-cols-1 gap-6 md:grid-cols-2">
          <div
            onClick={() => setIsModalOpen(true)}
            className="cursor-pointer rounded-xl border-b-6 border-b-emerald-900 bg-emerald-500 p-6 text-white shadow-2xl transition hover:bg-green-700"
          >
            <div className="mb-4 flex items-center justify-center">
              <Trophy className="h-8 w-8" />
            </div>
            <h3 className="mb-2 text-center text-xl font-bold">Start Fixing</h3>
            <p className="text-center text-sm text-green-100">
              Analyse recent games or practice positions
            </p>
          </div>

          <div
            onClick={() => setIsModalOpen(true)}
            className="cursor-pointer rounded-xl border-b-6 border-b-gray-900 bg-gray-700 p-6 text-white shadow-2xl transition hover:bg-gray-600"
          >
            <div className="mb-4 flex items-center justify-center">
              <PlugZap className="h-8 w-8" />
            </div>
            <h3 className="mb-2 text-center text-xl font-bold">
              Connect Chess.com
            </h3>
            <p className="text-center text-sm text-slate-300">
              Instant coaching analysis on recent games
            </p>
          </div>
        </div>
      </section>

      {isModalOpen && (
        <UsernameModal
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleSubmit}
          error={usernameError}
        />
      )}

      {pendingProfile && (
        <ConfirmModal
          show={true}
          profile={pendingProfile!}
          onConfirm={handleConfirm}
          onCancel={handleCancelConfirm}
        />
      )}

      <section>
        <div className="container mx-auto px-4 py-16">
          <CoachingBoard />
        </div>
        <div
          onClick={() => setIsModalOpen(true)}
          className="mt-8 flex flex-col justify-center gap-4 sm:flex-row"
        >
          <button className="rounded-lg border-b-4 border-b-green-700 bg-green-500 px-8 py-3 text-lg font-semibold text-white transition hover:bg-green-600">
            Get Started for Free
          </button>
        </div>
      </section>

      {/* Key Features */}
      <section className="container mx-auto mb-10 px-4 py-24">
        {/* Section intro */}
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <p className="mb-2 font-semibold tracking-wider text-green-400 uppercase">
            Key Features
          </p>
          <h2 className="text-3xl font-bold text-white">
            Master your game.{' '}
            <span className="font-black text-amber-400">Intelligently.</span>
          </h2>
          <p className="mt-4 text-lg text-slate-400">
            From instant blunder alerts to personalised coaching, BlunderFixer
            turns mistakes into learning moments.
          </p>
        </div>

        {/* Feature list */}
        <ul className="mx-auto max-w-2xl space-y-8">
          <li className="flex items-start">
            <Flag className="mt-1 h-6 w-6 text-green-500" />
            <div className="ml-4">
              <h4 className="font-bold text-white">Blunder Detection</h4>
              <p className="text-slate-300">
                Instantly flags your costly moves so you know exactly what went
                wrong.
              </p>
            </div>
          </li>

          <li className="flex items-start">
            <Target className="mt-1 h-6 w-6 text-green-500" />
            <div className="ml-4">
              <h4 className="font-bold text-white">Deep Classification</h4>
              <p className="text-slate-300">
                Tactical, positional or time-pressure errors explained in plain
                English.
              </p>
            </div>
          </li>

          <li className="flex items-start">
            <Play className="mt-1 h-6 w-6 text-green-500" />
            <div className="ml-4">
              <h4 className="font-bold text-white">Interactive Replay</h4>
              <p className="text-slate-300">
                Practice better lines against the engine and see instant
                improvement.
              </p>
            </div>
          </li>
        </ul>
      </section>

      <hr className="mx-20 mb-20 rounded-full border-b-4 border-black opacity-60" />

      {/* How It Works */}
      <section className="mb-20 py-16">
        <div className="container mx-auto px-4">
          {/* Intro */}
          <div className="mb-12 text-center">
            <p className="font-semibold tracking-wider text-green-400 uppercase">
              How It Works
            </p>
            <h2 className="mt-2 text-3xl font-bold text-white">
              Review. Chat.{' '}
              <span className="font-black text-red-500">Improve.</span>
            </h2>
          </div>

          {/* Steps */}
          <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-12 gap-y-8 sm:grid-cols-2">
            {/* Step 1 */}
            <div className="flex items-start">
              <PlayCircle className="mt-1 h-6 w-6 flex-shrink-0 text-green-500" />
              <div className="ml-4">
                <h3 className="font-bold text-white">Pick Your Game</h3>
                <p className="mt-1 text-slate-300">
                  Upload a PGN or connect with Chess.com to pull in your latest
                  match.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex items-start">
              <MessageCircleWarning className="mt-1 h-6 w-6 flex-shrink-0 text-green-500" />
              <div className="ml-4">
                <h3 className="font-bold text-white">Chat with Coach</h3>
                <p className="mt-1 text-slate-300">
                  Ask any question about your mistakes and get clear, practical
                  answers.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex items-start">
              <Target className="mt-1 h-6 w-6 flex-shrink-0 text-green-500" />
              <div className="ml-4">
                <h3 className="font-bold text-white">Replay & Improve</h3>
                <p className="mt-1 text-slate-300">
                  Practice better lines move-by-move and see how the outcome
                  changes.
                </p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="flex items-start">
              <Trophy className="mt-1 h-6 w-6 flex-shrink-0 text-green-500" />
              <div className="ml-4">
                <h3 className="font-bold text-white">Track Your Wins</h3>
                <p className="mt-1 text-slate-300">
                  Review your progress over time and celebrate every
                  improvement.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Final CTA */}
      <section className="mb-20 overflow-hidden rounded-3xl border-r-2 border-b-4 border-l-1 border-r-gray-800 border-b-gray-700 border-l-gray-700 bg-gradient-to-br from-gray-800 to-black">
        <div className="container mx-auto px-8 py-20 text-center">
          <h2 className="text-center text-4xl font-bold tracking-tight text-white">
            From blunder to{' '}
            <span className="relative inline-block">
              <span className="relative z-10 bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
                Brilliance.
              </span>
              <span className="absolute bottom-0 left-0 block h-2 w-full -skew-x-12 bg-green-400 opacity-60"></span>
            </span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-400">
            Instant, human-like insights on every move — no waiting, no fluff.
          </p>
          <div
            onClick={() => setIsModalOpen(true)}
            className="mt-8 flex flex-col justify-center gap-4 sm:flex-row"
          >
            <button className="rounded-lg border-b-4 border-b-green-700 bg-green-500 px-8 py-3 text-lg font-semibold text-white transition hover:bg-green-600">
              Get Started for Free
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
