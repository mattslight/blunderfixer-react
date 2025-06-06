import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

function FAQItem({ question, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-gray-700 py-4">
      <button
        type="button"
        className="flex w-full items-center justify-between text-left"
        onClick={() => setOpen(!open)}
      >
        <span className="font-semibold">{question}</span>
        <ChevronDown
          className={`transition-transform ${open ? 'rotate-180' : ''}`}
          size={20}
        />
      </button>
      {open && <div className="mt-2 text-sm">{children}</div>}
    </div>
  );
}

export default function HelpPage() {
  return (
    <div className="prose dark:prose-invert mx-auto max-w-3xl px-4 py-8">
      <h1>Help &amp; FAQ</h1>
      <p>
        BlunderFixer helps you understand your chess mistakes and turn them into
        learning opportunities. Tap a question below to learn more.
      </p>

      <FAQItem question="What is BlunderFixer?" defaultOpen>
        BlunderFixer analyses your games using Stockfish and our own heuristics
        to highlight blunders and suggest better continuations. Chat with the
        built-in coach to get human-like explanations for every mistake.
      </FAQItem>

      <FAQItem question="How do I connect my Chess.com account?">
        On your first visit you&apos;ll be asked for your Chess.com username. We
        use it to fetch your recent games so you can start analysing right away.
        You can update your username anytime from the Settings page.
      </FAQItem>

      <FAQItem question="How do I analyse a game?">
        Head to the <strong>Analyse</strong> page and paste a PGN or choose one
        of your recent games. You&apos;ll see an evaluation graph, a list of key
        mistakes and an interactive board where you can play out better moves.
      </FAQItem>

      <FAQItem question="What are drills?">
        Drills are critical positions extracted from your games. Practice them
        against the engine to reinforce the right patterns and track your
        progress over time.
      </FAQItem>

      <FAQItem question="What is Chess IQ?">
        Chess IQ is our composite score reflecting your improvement across
        blunder rate, tactical sharpness and time usage. The more you practice
        with BlunderFixer, the higher it climbs.
      </FAQItem>

      <FAQItem question="Need more help?">
        We&apos;re constantly improving. If something doesn&apos;t work or you
        have feature suggestions, send us feedback via the Settings page or
        email
        <a href="mailto:support@blunderfixer.com">support@blunderfixer.com</a>.
      </FAQItem>
    </div>
  );
}
