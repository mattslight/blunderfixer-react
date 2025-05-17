// src/pages/analyse/components/CoachAndChat.tsx
import { AnimatePresence, motion } from 'framer-motion';
import { Lightbulb, Send, Zap } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

import { Msg, useCoach } from '../hooks/useCoach';

const coachImageSrc = '/coach.png';

type Props = {
  fen: string;
  lines: any[];
  features: any;
  legalMoves: string[];
  heroSide: 'w' | 'b';
};

/* ---------- role → style map ------------------------------------------------ */
const roleStyles = {
  coach: {
    wrapper: 'justify-start',
    bubble: 'bg-green-600 text-white',
    avatar: true,
  },
  user: {
    wrapper: 'justify-end',
    bubble: 'bg-blue-500  text-white',
    avatar: false,
  },
  typing: {
    wrapper: 'justify-start',
    bubble: 'bg-gray-700 text-gray-400 italic',
    avatar: false,
  },
} as const;

/* ---------- single chat bubble --------------------------------------------- */
function ChatMessage({ msg }: { msg: Msg }) {
  const s = roleStyles[msg.role];
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -5 }}
      transition={{ duration: 0.2 }}
      className={`flex items-start space-x-2 ${s.wrapper}`}
    >
      {s.avatar && (
        <img
          src={coachImageSrc}
          alt="Coach"
          className="h-8 w-8 -scale-x-100 self-end rounded-full"
        />
      )}
      {msg.role !== 'typing' ? (
        <div
          className={`max-w-[85%] rounded-xl p-3 font-medium md:max-w-[80%] ${s.bubble}`}
        >
          <div className="prose prose-green dark:prose-invert prose-table:border-spacing-y-2 leading-tight font-medium dark:text-white dark:[--tw-prose-td-borders-opacity:0.5] dark:[--tw-prose-td-borders:theme(colors.white)] dark:[--tw-prose-th-borders-opacity:0.5] dark:[--tw-prose-th-borders:theme(colors.white)]">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {msg.text}
            </ReactMarkdown>
          </div>
        </div>
      ) : (
        <div
          className={`max-w-[85%] rounded-xl p-3 font-medium md:max-w-[80%] ${s.bubble}`}
        >
          <div className="flex items-end space-x-1">
            <span className="mr-2 self-end">{msg.text}</span>
            {[0, 0.1, 0.2].map((d, i) => (
              <motion.span
                key={i}
                className="mb-1 h-1 w-1 rounded-full bg-gray-400"
                animate={{ y: [0, -6, 0] }}
                transition={{
                  repeat: Infinity,
                  duration: 0.6,
                  ease: 'easeOut',
                  delay: d, // stagger start
                  repeatDelay: 0.4, // pause before next bounce
                }}
              />
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}

/* ---------- bottom textarea ------------------------------------------------ */
function ChatInput({
  value,
  setValue,
  send,
}: {
  value: string;
  setValue: (v: string) => void;
  send: () => void;
}) {
  const ref = useRef<HTMLTextAreaElement>(null);

  /* auto-grow textarea */
  const onInput = () => {
    const ta = ref.current!;
    ta.style.height = 'auto';
    ta.style.height = `${ta.scrollHeight}px`;
  };

  return (
    <div className="sticky bottom-0 z-10 bg-black/20 pb-1 backdrop-blur-lg md:w-lg lg:fixed lg:bottom-4 lg:w-lg xl:w-xl">
      <textarea
        ref={ref}
        rows={1}
        value={value}
        onInput={onInput}
        placeholder="Ask coach a question…"
        onChange={(e) => setValue(e.currentTarget.value)}
        onKeyDown={(e) =>
          e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), send())
        }
        className="w-full resize-none overflow-hidden rounded-lg bg-gray-700 p-2 pr-10 text-white placeholder-gray-400 focus:ring-1 focus:ring-blue-500"
      />
      <button
        onClick={send}
        disabled={!value.trim()}
        className="absolute inset-y-0 right-2 rounded-full p-2 text-gray-400 hover:text-white disabled:opacity-50"
      >
        <Send className="relative bottom-[2px] h-5 w-5 text-white" />
      </button>
    </div>
  );
}

/* small Tailwind helpers for the buttons (optional) */
const btn = `inline-flex items-center space-x-1 rounded-full border-b-2
             shadow-md px-3 py-1 text-sm font-semibold text-white active:scale-95`;
export const buttonStyles = {
  blue: `${btn} border-blue-800 bg-blue-600 hover:bg-blue-700`,
  purple: `${btn} border-purple-900 bg-purple-600 hover:bg-purple-700`,
};

/* ---------- main component ------------------------------------------------- */
export default function CoachAndChat(props: Props) {
  const { messages, loading, ask, onHint, onFull } = useCoach({
    ...props,
    apiBase: import.meta.env.VITE_API_BASE_URL,
  });

  /* local UI input ---------------------------------- */
  const [input, setInput] = useState('');
  const send = () => {
    const q = input.trim();
    if (q) {
      setInput('');
      ask(q);
    }
  };

  /* scroll to bottom on new message ----------------- */
  const bottomRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="mx-auto flex h-auto max-w-lg flex-col rounded pt-2 shadow-xl lg:mt-4 lg:h-[80vh] lg:w-lg lg:max-w-xl lg:pt-4 xl:w-xl">
      {/* messages area */}
      <div className="space-y-4 py-2 lg:flex-1 lg:overflow-y-auto lg:px-4 lg:pb-8">
        <AnimatePresence initial={false}>
          {messages.map((m) => (
            <ChatMessage key={`${m.role}-${m.text}`} msg={m} />
          ))}
        </AnimatePresence>

        {/* buttons */}
        <div className="flex justify-center space-x-4 pt-2">
          <button
            onClick={onHint}
            disabled={loading}
            className="inline-flex items-center space-x-1 rounded-full border-b-2 border-blue-800 bg-blue-600 px-3 py-1 text-sm font-semibold text-white shadow-md hover:bg-blue-700 active:scale-95"
          >
            <Lightbulb className="h-4 w-4" />
            <span>Hint</span>
          </button>
          <button
            onClick={onFull}
            disabled={loading}
            className={`inline-flex items-center space-x-2 rounded-full border-b-2 border-purple-900 bg-purple-600 px-3 py-1 text-sm font-semibold text-white shadow-md hover:bg-purple-700 active:scale-95 ${loading ? 'cursor-not-allowed opacity-50' : ''}`}
          >
            <Zap className="h-4 w-4" />
            <span>Full analysis</span>
          </button>
        </div>

        <div ref={bottomRef} />
      </div>

      {/* input bar */}
      <ChatInput value={input} setValue={setInput} send={send} />
    </div>
  );
}
