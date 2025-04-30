import React from 'react';

import {
  Flag,
  MessageCircleWarning,
  Play,
  PlayCircle,
  PlugZap,
  Target,
  Trophy,
} from 'lucide-react';

export default function HomePage() {
  return (
    <div className="-mt-10 min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 p-6 text-white sm:p-10">
      {/* Hero */}
      <section className="bg-noise container mx-auto mt-16 mb-10 p-4 text-center">
        <h1 className="mb-4 text-4xl font-bold sm:text-5xl lg:text-6xl">
          The #1 AI Chess Coach
        </h1>
        <p className="mb-8 text-2xl text-slate-300">
          Learn from your mistakes – <i>fast</i>
        </p>
        <p className="text-md mb-8 text-slate-400">
          <b className="text-slate-200">345,920</b> Blunders Fixed
        </p>
        <div className="mx-auto mt-20 grid max-w-2xl grid-cols-1 gap-6 md:grid-cols-2">
          <div className="cursor-pointer rounded-xl border-b-6 border-b-emerald-900 bg-emerald-500 p-6 text-white shadow-2xl transition hover:bg-green-700">
            <div className="mb-4 flex items-center justify-center">
              <Trophy className="h-8 w-8" />
            </div>
            <h3 className="mb-2 text-center text-xl font-bold">Start Fixing</h3>
            <p className="text-center text-sm text-green-100">
              Analyse recent games or practice positions
            </p>
          </div>

          <div className="cursor-pointer rounded-xl border-b-6 border-b-gray-900 bg-gray-700 p-6 text-white shadow-2xl transition hover:bg-gray-600">
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

      {/* Key Features */}
      <section className="container mx-auto mb-10 px-4 py-24">
        {/* Section intro */}
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <p className="mb-2 font-semibold text-green-400 uppercase">
            Key Features
          </p>
          <h2 className="text-3xl font-bold text-white">
            A smarter way to master your game
          </h2>
          <p className="mt-4 text-lg text-slate-400">
            From instant blunder alerts to personalised coaching, BlunderFixer
            turns mistakes into learning moments.
          </p>
        </div>

        {/* Feature list */}
        <ul className="space-y-8">
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

      <hr className="mx-20 mb-20 border-2 border-t border-black opacity-30" />

      {/* How It Works */}
      <section className="mb-20 py-16">
        <div className="container mx-auto px-4">
          {/* Intro */}
          <div className="mb-12 text-center">
            <p className="font-semibold tracking-wide text-green-400 uppercase">
              How It Works
            </p>
            <h2 className="mt-2 text-3xl font-bold text-white">
              Review. Chat. Improve.
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
      <section className="mb-60 overflow-hidden rounded-3xl bg-gray-900">
        <div className="container mx-auto px-8 py-20 text-center">
          <h2 className="text-4xl font-bold text-white">
            Fix mistakes. Chat with your coach. Win more games.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-400">
            Instant, human-like insights on every blunder — no waiting, no
            fluff.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <button className="rounded-lg border-b-4 border-b-green-700 bg-green-500 px-8 py-3 text-lg font-semibold text-white transition hover:bg-green-600">
              Get Started for Free
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
