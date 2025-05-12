// src/pages/analyse/components/CoachAndChat.tsx
import { AnimatePresence, motion } from 'framer-motion';
import { Lightbulb, Send, Zap } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import useCoachExplanation from '../hooks/useCoachExplanation';

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
  const {
    explanation,
    loading: analysisLoading,
    getExplanation,
  } = useCoachExplanation();

  const [messages, setMessages] = useState<Msg[]>([
    {
      role: 'coach',
      text: 'Hey there! Choose a position and let’s dive in...',
    },
  ]);
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const push = (msg: Msg) => setMessages((m) => [...m, msg]);

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
      setMessages((m) => m.filter((x) => x.role !== 'typing'));
      push({ role: 'coach', text: txt });
    } catch {
      setMessages((m) => m.filter((x) => x.role !== 'typing'));
      push({ role: 'coach', text: 'Oops, something went wrong 😕' });
    }
  };

  const handleHint = () => {
    push({ role: 'user', text: 'Give me a hint' });
    push({ role: 'coach', text: 'Hint endpoint not wired yet.' });
  };

  const handleAsk = async () => {
    const q = input.trim();
    if (!q) return;
    push({ role: 'user', text: q });
    setInput('');
    push({ role: 'typing', text: 'Coach is thinking…' });

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
      push({ role: 'coach', text: data.reply || `Error: ${data.error}` });
    } catch {
      setMessages((m) => m.filter((x) => x.role !== 'typing'));
      push({ role: 'coach', text: 'Network error—please try again.' });
    }
  };

  return (
    <div className="mx-auto flex h-auto max-w-lg flex-col rounded bg-gray-800 shadow-xl md:mt-4 md:h-[80vh] md:max-w-2xl">
      {/* 1) Message list */}
      <div className="space-y-4 px-4 py-2 md:flex-1 md:overflow-y-auto">
        <AnimatePresence initial={false}>
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.2, delay: i * 0.05 }}
              className={`flex items-start space-x-2 ${msg.role === 'user' ? 'justify-end' : ''} `}
            >
              {msg.role === 'coach' && (
                <img
                  src={coachImageSrc}
                  alt="Coach"
                  className="h-8 w-8 -scale-x-100 self-end rounded-full"
                />
              )}
              <div
                className={`max-w-[80%] rounded-xl p-3 ${msg.role === 'coach' ? 'bg-green-600 text-white' : ''} ${msg.role === 'user' ? 'bg-blue-500 text-white' : ''} ${msg.role === 'typing' ? 'bg-gray-700 text-gray-400 italic' : ''} `}
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

        <div className="flex justify-center space-x-4 pt-2">
          <button
            onClick={handleHint}
            className="inline-flex items-center space-x-1 rounded-full border-b-2 border-b-purple-800 bg-purple-600 px-3 py-1 text-sm font-semibold text-white shadow-md hover:bg-purple-700 active:scale-95"
          >
            <Lightbulb className="h-4 w-4" />
            <span>Hint</span>
          </button>
          <button
            onClick={handleFullAnalysis}
            disabled={analysisLoading}
            className={`inline-flex items-center space-x-2 rounded-full border-b-2 border-b-green-900 bg-green-600 px-3 py-1 text-sm font-semibold text-white shadow-md hover:bg-green-700 active:scale-95 ${analysisLoading ? 'cursor-not-allowed opacity-50' : ''} `}
          >
            <Zap className="h-4 w-4" />
            <span>{analysisLoading ? 'Analyzing…' : 'Full analysis'}</span>
          </button>
        </div>

        <div ref={bottomRef} />
      </div>

      {/* 2) Input bar */}
      <div className="sticky bottom-0 -mb-4 bg-gray-800 p-4 md:relative md:pb-4">
        <textarea
          rows={1}
          placeholder="Ask coach a question..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onInput={(e) => {
            const ta = e.currentTarget as HTMLTextAreaElement;
            ta.style.height = 'auto';
            ta.style.height = `${ta.scrollHeight}px`;
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleAsk();
            }
          }}
          className="w-full resize-none overflow-hidden rounded-lg bg-gray-700 p-2 pr-10 text-white placeholder-gray-400 focus:ring-1 focus:ring-blue-500"
        />
        <button
          onClick={handleAsk}
          disabled={!input.trim()}
          className="absolute inset-y-0 right-6 rounded-full p-1 text-gray-400 hover:text-white disabled:opacity-50"
        >
          <Send className="relative bottom-0.5 h-5 w-5 text-white" />
        </button>
      </div>

      {/* 3) Optional, Debug Positional features */}
      {/*explanation && <PositionFeatures features={features} /> */}
    </div>
  );
}
