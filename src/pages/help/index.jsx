import { useState } from 'react';
import {
  BarChart2,
  Brain,
  CheckCircle,
  ChevronDown,
  HelpCircle,
  Info,
  PlugZap,
  Sword,
  TrendingDown,
} from 'lucide-react';

function FAQItem({
  question,
  icon: Icon = HelpCircle,
  children,
  defaultOpen = false,
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-gray-700 py-4">
      <button
        type="button"
        className="flex w-full items-center justify-between text-left"
        onClick={() => setOpen(!open)}
      >
        <span className="flex items-center gap-2 font-semibold">
          <Icon className="h-4 w-4 text-green-400" />
          {question}
        </span>
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
    <div className="prose dark:prose-invert mx-auto max-w-3xl space-y-8 px-6 py-12 md:py-16">
      <h1>Help &amp; FAQ</h1>
      <p>
        BlunderFixer helps you understand your chess mistakes and turn them into
        learning opportunities. Tap a question below to learn more.
      </p>

      <FAQItem question="What is BlunderFixer?" icon={HelpCircle} defaultOpen>
        BlunderFixer analyses your games using Stockfish and our own heuristics
        to highlight blunders and suggest better continuations. Chat with the
        built-in coach to get human-like explanations for every mistake.
      </FAQItem>

      <FAQItem question="How do I connect my Chess.com account?" icon={PlugZap}>
        On your first visit you&apos;ll be asked for your Chess.com username. We
        use it to fetch your recent games so you can start analysing right away.
        You can update your username anytime from the Settings page.
      </FAQItem>

      <FAQItem
        question="Why can't I connect my Lichess.org account?"
        icon={PlugZap}
      >
        We&apos;re excited to add Lichess support soon! The integration is
        underway and will let you sync games just like on Chess.com. Stay tuned.
      </FAQItem>

      <FAQItem question="How do I analyse a game?" icon={Sword}>
        Head to the <strong>Analyse</strong> page and paste a PGN or choose one
        of your recent games. You&apos;ll see an evaluation graph, a list of key
        mistakes and an interactive board where you can play out better moves.
      </FAQItem>

      <FAQItem question="What are drills?" icon={Sword}>
        Drills are critical positions extracted from your games. Practice them
        against the engine to reinforce the right patterns and track your
        progress over time.
      </FAQItem>

      <FAQItem question="What is Chess IQ™?" icon={Brain}>
        Chess IQ™ is our composite score reflecting your improvement across
        blunder rate, tactical sharpness and time usage. The more you practice
        with BlunderFixer, the higher it climbs.
      </FAQItem>

      <FAQItem
        question="What does the Blunder Size slider control?"
        icon={TrendingDown}
      >
        Blunder Size filters drills by how big the evaluation swing is. Bigger
        values represent more severe mistakes. Slide right for easier blunders
        or left for only the toughest challenges.
      </FAQItem>

      <FAQItem
        question="What do the tick and cross icons mean?"
        icon={CheckCircle}
      >
        After each drill attempt we record whether you passed or failed. Green
        ticks show successful tries and grey crosses show misses. The dots fill
        up from left to right so you can quickly track recent progress.
      </FAQItem>

      <FAQItem question="What are the drill goals?" icon={BarChart2}>
        Each drill expects you to either win, draw or hold a worse position. The
        banner at the top of a drill tells you the goal so you know what to aim
        for.
      </FAQItem>

      <FAQItem question="What is a mastered drill?" icon={CheckCircle}>
        When you pass a drill five times in a row we mark it as{' '}
        <strong>Mastered</strong>
        and move it to your archive so you can focus on new mistakes. You can
        still review mastered drills from the filter menu.
      </FAQItem>

      <FAQItem question="Can I see my archived drills?" icon={Info}>
        Yes. On the Drills page open <em>Filters</em> and enable{' '}
        <q>Show archived drills</q>
        to browse positions you&apos;ve mastered or manually archived.
      </FAQItem>

      <FAQItem question="Can I see drills I've recently completed?" icon={Info}>
        Absolutely! Tap <strong>Recent Drills</strong> from the Drills page to
        revisit your latest attempts and retry any you want to reinforce.
      </FAQItem>

      <FAQItem
        question="I want to understand why my move was wrong"
        icon={HelpCircle}
      >
        A deeper analysis mode with coach explanations is in the works. Soon
        you&apos;ll be able to analyse any move and chat with the coach about
        alternative ideas.
      </FAQItem>

      <FAQItem question="Need more help?" icon={Info}>
        We&apos;re constantly improving. If something doesn&apos;t work or you
        have feature suggestions, send us feedback via the Settings page or
        email
        <a href="mailto:support@blunderfixer.com">support@blunderfixer.com</a>.
      </FAQItem>
    </div>
  );
}
