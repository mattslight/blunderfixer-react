// src/pages/analyse/components/CoachAndChat.tsx
import { AnimatePresence, motion } from 'framer-motion';
import { Lightbulb, Send, Zap } from 'lucide-react';
import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import useCoachExplanation from '../hooks/useCoachExplanation';
import PositionFeatures from './PositionFeatures';

const coachImageSrc = '/coach.png';

type Msg = { role: 'coach' | 'user' | 'typing'; text: string };
type Props = {
  fen: string;
  lines: any[];
  features: any;
  legalMoves: string[];
};

export default function CoachAndChat({
  fen,
  lines,
  features,
  legalMoves,
}: Props) {
  // Hook for “full analysis”
  const {
    explanation,
    loading: analysisLoading,
    error: analysisError,
    getExplanation,
  } = useCoachExplanation();

  // Unified bubble stream
  const [messages, setMessages] = useState<Msg[]>([
    { role: 'coach', text: 'Hey there! Choose a position and lets dive in...' },
  ]);
  const [input, setInput] = useState('');

  const push = (msg: Msg) => setMessages((m) => [...m, msg]);

  // 1) Full-analysis button
  const handleFullAnalysis = async () => {
    push({ role: 'user', text: 'Full analysis please' });
    push({ role: 'typing', text: 'Coach is typing…' });
    try {
      const txt = await getExplanation({
        fen,
        lines,
        legal_moves: legalMoves,
        features,
      });
      // remove “typing…”
      setMessages((m) => m.filter((x) => x.role !== 'typing'));
      push({ role: 'coach', text: txt });
    } catch {
      setMessages((m) => m.filter((x) => x.role !== 'typing'));
      push({ role: 'coach', text: 'Oops, something went wrong 😕' });
    }
  };

  // 2) Hint-button stub (swap in useCoachHint later)
  const handleHint = () => {
    push({ role: 'user', text: 'Give me a hint' });
    push({ role: 'coach', text: 'Hint endpoint not wired yet.' });
  };

  // 3) Free-form Q/A against /coach-chat
  const handleAsk = async () => {
    const q = input.trim();
    if (!q) return;
    // 3a) record user
    push({ role: 'user', text: q });
    setInput('');
    // 3b) show typing
    push({ role: 'typing', text: 'Coach is thinking…' });

    // build past_messages
    const past = messages
      .filter((m) => m.role !== 'typing')
      .map((m) => ({
        role: m.role === 'user' ? 'user' : 'assistant',
        content: m.text,
      }));

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/coach-chat`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fen,
            legal_moves: legalMoves,
            past_messages: past,
            user_message: q,
          }),
        }
      );
      const data = await res.json();
      setMessages((m) => m.filter((x) => x.role !== 'typing'));
      if (data.reply) {
        push({ role: 'coach', text: data.reply });
      } else {
        push({ role: 'coach', text: `Error: ${data.error}` });
      }
    } catch {
      setMessages((m) => m.filter((x) => x.role !== 'typing'));
      push({ role: 'coach', text: 'Network error—please try again.' });
    }
  };

  return (
    <div className="mx-auto max-w-lg space-y-4 rounded bg-gray-800 p-4 shadow-xl lg:mt-12 lg:mr-2 lg:max-w-2xl">
      {/* 👥 Animated bubbles */}
      <AnimatePresence initial={false}>
        {messages.map((msg, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.2, delay: i * 0.05 }}
            className={`flex items-start space-x-2 ${
              msg.role === 'user' ? 'justify-end' : ''
            }`}
          >
            {msg.role === 'coach' && (
              <img
                src={coachImageSrc}
                alt="Coach"
                className="relative top-6 h-10 w-10 -scale-x-100 transform self-end rounded-full border-1 border-green-900"
              />
            )}

            <div
              className={`max-w-[80%] rounded-xl border-b-2 border-b-black p-3 ${msg.role === 'coach' ? 'rounded-bl-none bg-green-600 text-white' : ''} ${msg.role === 'user' ? 'rounded-br-none bg-blue-500 text-white' : ''} ${msg.role === 'typing' ? 'bg-gray-700 text-gray-400 italic' : ''} `}
            >
              <div className="prose prose-green dark:prose-invert prose-table:border-spacing-y-2 leading-normal font-medium dark:[--tw-prose-td-borders-opacity:0.5] dark:[--tw-prose-td-borders:theme(colors.white)] dark:[--tw-prose-th-borders-opacity:0.5] dark:[--tw-prose-th-borders:theme(colors.white)]">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {msg.text}
                </ReactMarkdown>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* 🔥 Action buttons */}
      <div className="flex justify-center space-x-4">
        <button
          onClick={handleHint}
          className="inline-flex items-center space-x-1 rounded-full border-b-2 border-b-purple-800 bg-purple-600 px-3 py-1 text-sm font-semibold text-white shadow-md transition-transform ease-out hover:bg-purple-700 hover:shadow-lg active:scale-95"
        >
          <Lightbulb className="h-4 w-4" />
          <span>Hint</span>
        </button>

        <button
          onClick={handleFullAnalysis}
          disabled={analysisLoading}
          className={`inline-flex items-center space-x-2 rounded-full border-b-2 border-b-green-900 bg-green-600 px-3 py-1 text-sm font-semibold text-white shadow-md transition-transform ease-out hover:bg-green-700 hover:shadow-lg active:scale-95 ${analysisLoading && 'cursor-not-allowed opacity-50'} `}
        >
          <Zap className="h-4 w-4" />
          <span>{analysisLoading ? 'Analyzing…' : 'Full analysis'}</span>
        </button>
      </div>

      {/* ?? Always-on input with send button */}
      <div className="relative -m-2 mt-6">
        <input
          type="text"
          placeholder="Ask coach a question..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAsk()}
          className="w-full rounded-lg bg-gray-700 p-2 pr-10 text-white placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:outline-none"
        />
        <button
          onClick={handleAsk}
          disabled={!input.trim()}
          className="absolute top-1/2 right-2 -translate-y-1/2 rounded-full p-1 text-gray-400 hover:text-white disabled:opacity-50"
        >
          <Send className="h-5 w-5 text-white" />
        </button>
      </div>

      {/* 📊 Positional features after a true analysis */}
      {explanation && <PositionFeatures features={features} />}
    </div>
  );
}
