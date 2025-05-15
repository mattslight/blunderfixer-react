// src/pages/analyse/components/CoachAndChat.tsx
import { AnimatePresence, motion } from 'framer-motion';
import { Lightbulb, Send, Zap } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const coachImageSrc = '/coach.png';

type Msg = { role: 'coach' | 'user' | 'typing'; text: string };
type Props = {
  fen: string;
  lines: any[];
  features: any;
  legalMoves: string[];
};

const roleStyles = {
  coach: {
    wrapper: 'justify-start',
    bubble: 'bg-green-600 text-white',
    showAvatar: true,
  },
  user: {
    wrapper: 'justify-end',
    bubble: 'bg-blue-500 text-white',
    showAvatar: false,
  },
  typing: {
    wrapper: 'justify-start',
    bubble: 'bg-gray-700 text-gray-400 italic',
    showAvatar: false,
  },
};

function ChatMessage({ msg }: { msg: Msg }) {
  const styles = roleStyles[msg.role];
  return (
    <motion.div
      key={`${msg.role}-${msg.text}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -5 }}
      transition={{ duration: 0.2 }}
      className={`flex items-start space-x-2 ${styles.wrapper}`}
    >
      {styles.showAvatar && (
        <img
          src={coachImageSrc}
          alt="Coach"
          className="h-8 w-8 -scale-x-100 self-end rounded-full"
        />
      )}
      <div
        className={`max-w-[85%] rounded-xl p-3 font-medium md:max-w-[80%] ${styles.bubble}`}
      >
        <div className="prose prose-green dark:prose-invert prose-table:border-spacing-y-2 leading-tight font-medium dark:text-white dark:[--tw-prose-td-borders-opacity:0.5] dark:[--tw-prose-td-borders:theme(colors.white)] dark:[--tw-prose-th-borders-opacity:0.5] dark:[--tw-prose-th-borders:theme(colors.white)]">
          <ReactMarkdown remarkPlugins={[remarkGfm]} children={msg.text} />
        </div>
      </div>
    </motion.div>
  );
}

function ControlButtons({
  onHint,
  onFull,
  loading,
}: {
  onHint: () => void;
  onFull: () => void;
  loading: boolean;
}) {
  return (
    <div className="flex justify-center space-x-4 pt-2">
      <button
        onClick={onHint}
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
        <span>{loading ? 'Analyzing…' : 'Full analysis'}</span>
      </button>
    </div>
  );
}

function ChatInput({
  value,
  onChange,
  onSend,
}: {
  value: string;
  onChange: (text: string) => void;
  onSend: () => void;
}) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const handleInput = (e: React.SyntheticEvent<HTMLTextAreaElement>) => {
    const ta = e.currentTarget;
    ta.style.height = 'auto';
    ta.style.height = `${ta.scrollHeight}px`;
    onChange(ta.value);
  };
  return (
    <div className="sticky bottom-0 z-10 bg-black/20 pb-1 backdrop-blur-lg md:w-lg lg:fixed lg:bottom-4 lg:w-lg xl:w-xl">
      <textarea
        ref={textareaRef}
        rows={1}
        placeholder="Ask coach a question..."
        value={value}
        onChange={(e) => onChange(e.currentTarget.value)}
        onInput={handleInput}
        onKeyDown={(e) =>
          e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), onSend())
        }
        className="w-full resize-none overflow-hidden rounded-lg bg-gray-700 p-2 pr-10 text-white placeholder-gray-400 focus:ring-1 focus:ring-blue-500"
      />
      <button
        onClick={onSend}
        disabled={!value.trim()}
        className="absolute inset-y-0 right-2 rounded-full p-2 text-gray-400 hover:text-white disabled:opacity-50"
      >
        <Send className="relative bottom-1 h-5 w-5 text-white" />
      </button>
    </div>
  );
}

export default function CoachAndChat({
  fen,
  lines,
  features,
  legalMoves,
}: Props) {
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: 'coach',
      text: 'Hey there! Choose a position and let’s dive in...',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [hasSeededContext, setHasSeededContext] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  // scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // reset when fen changes
  useEffect(() => {
    setMessages([
      {
        role: 'coach',
        text: 'Hey there! Choose a position and let’s dive in...',
      },
    ]);
    setHasSeededContext(false);
  }, [fen]);

  const push = useCallback((msg: Msg) => {
    setMessages((m) => [...m, msg]);
  }, []);

  const sendCoachRequest = useCallback(
    async (userMessage: string) => {
      setLoading(true);
      const past = messages
        .filter((m) => m.role !== 'typing')
        .map((m) => ({
          role: m.role === 'coach' ? 'assistant' : m.role,
          content: m.text,
        }));

      const payload: any = {
        fen,
        legal_moves: legalMoves,
        past_messages: past,
        user_message: userMessage,
      };
      if (!hasSeededContext) {
        // ensure mateIn present
        const formattedLines = lines.map((l) => ({
          rank: l.rank,
          depth: l.depth,
          scoreCP: l.scoreCP,
          mateIn: l.mateIn ?? null,
          moves: l.moves,
        }));
        payload.lines = formattedLines;
        payload.features = features;
        setHasSeededContext(true);
      }

      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/coach`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(await res.text());
      const { reply } = await res.json();
      setLoading(false);
      return reply as string;
    },
    [fen, legalMoves, lines, features, messages, hasSeededContext]
  );

  const handleHint = useCallback(async () => {
    const userMsg =
      'Hint: Can you give me a subtle nudge—no revealing the best move?';
    push({ role: 'user', text: userMsg });
    push({ role: 'typing', text: 'Coach is thinking…' });
    try {
      const reply = await sendCoachRequest(userMsg);
      setMessages((m) => m.filter((x) => x.role !== 'typing'));
      push({ role: 'coach', text: reply });
    } catch {
      setMessages((m) => m.filter((x) => x.role !== 'typing'));
      push({ role: 'coach', text: 'Oops, something went wrong 😕' });
    }
  }, [push, sendCoachRequest]);

  const handleFull = useCallback(async () => {
    const userMsg = 'Full analysis: please show key moves with pros and cons.';
    push({ role: 'user', text: userMsg });
    push({ role: 'typing', text: 'Coach is analyzing…' });
    try {
      const reply = await sendCoachRequest(userMsg);
      setMessages((m) => m.filter((x) => x.role !== 'typing'));
      push({ role: 'coach', text: reply });
    } catch {
      setMessages((m) => m.filter((x) => x.role !== 'typing'));
      push({ role: 'coach', text: 'Analysis failed—please try again.' });
    }
  }, [push, sendCoachRequest]);

  const handleAsk = useCallback(async () => {
    const q = input.trim();
    if (!q) return;
    push({ role: 'user', text: q });
    setInput('');
    push({ role: 'typing', text: 'Coach is thinking…' });
    try {
      const reply = await sendCoachRequest(q);
      setMessages((m) => m.filter((x) => x.role !== 'typing'));
      push({ role: 'coach', text: reply });
    } catch {
      setMessages((m) => m.filter((x) => x.role !== 'typing'));
      push({ role: 'coach', text: 'Network error—please try again.' });
    }
  }, [input, push, sendCoachRequest]);

  return (
    <div className="mx-auto flex h-auto max-w-lg flex-col rounded pt-2 shadow-xl lg:mt-4 lg:h-[80vh] lg:w-lg lg:max-w-xl lg:pt-4 xl:w-xl">
      <div className="space-y-4 py-2 lg:flex-1 lg:overflow-y-auto lg:px-4 lg:pb-8">
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <ChatMessage key={`${msg.role}-${msg.text}`} msg={msg} />
          ))}
        </AnimatePresence>
        <ControlButtons
          onHint={handleHint}
          onFull={handleFull}
          loading={loading}
        />
        <div ref={bottomRef} />
      </div>
      <ChatInput value={input} onChange={setInput} onSend={handleAsk} />
    </div>
  );
}
