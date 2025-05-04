// src/components/DevErrorBoundary.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { MessageCircleWarning, PlayCircle, PlugZap } from 'lucide-react';

export default class DevErrorBoundary extends React.Component {
  state = { error: null };

  static getDerivedStateFromError(error) {
    return { error };
  }

  //eslint-disable-next-line
  componentDidCatch(error) {
    // optional: log to service
  }

  render() {
    const { error } = this.state;
    if (error) {
      if (import.meta.env.DEV) {
        throw error; // Vite overlay
      }
      // PRODUCTION fallback UI:
      return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 p-6 text-white">
          <MessageCircleWarning className="mb-6 h-16 w-16 animate-pulse text-red-400" />
          <h1 className="mb-4 text-4xl font-extrabold">
            Oops — Something broke!
          </h1>
          <p className="mb-8 max-w-md text-center text-lg text-slate-300">
            {error.message}
          </p>
          <div className="flex gap-4">
            <Link
              to="/analyse"
              className="flex items-center space-x-2 rounded-lg border-b-4 border-b-green-700 bg-green-500 px-6 py-3 font-semibold transition hover:bg-green-600"
            >
              <PlayCircle className="h-5 w-5" />
              <span>Try Again</span>
            </Link>
            <Link
              to="/"
              className="flex items-center space-x-2 rounded-lg border-b-4 border-b-gray-900 bg-gray-700 px-6 py-3 font-semibold transition hover:bg-gray-600"
            >
              <PlugZap className="h-5 w-5" />
              <span>Go Home</span>
            </Link>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
