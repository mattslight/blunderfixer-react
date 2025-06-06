import React from 'react';
import { useState } from 'react';
import {
  AlertCircle,
  Archive,
  BarChart2,
  Brain,
  CheckCircle,
  ChevronDown,
  CloudOff,
  Flag,
  Gamepad,
  History,
  LifeBuoy,
  Rocket,
  Search,
  Sliders,
  Star,
  Target,
  Timer,
  TrendingUp,
} from 'lucide-react';

function FAQItem({
  question,
  icon: Icon = AlertCircle, // default changed to AlertCircle
  children,
  defaultOpen = false,
}: {
  question: string;
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-gray-800 py-2">
      <button
        type="button"
        className="flex w-full items-center justify-between text-left"
        onClick={() => setOpen(!open)}
      >
        <span className="flex items-start gap-2 text-base font-semibold text-white">
          <span className="pt-[2px]">
            <Icon className="h-5 w-5 shrink-0 text-green-400" />
          </span>
          <span className="leading-[1.3]">{question}</span>
        </span>
        <ChevronDown
          className={`transition-transform ${open ? 'rotate-180' : ''}`}
          size={20}
        />
      </button>
      {open && <div className="mt-4 text-gray-400">{children}</div>}
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

      {/* Getting Started */}
      <h2 className="mt-20">Getting Started</h2>
      <FAQItem question="What is BlunderFixer?" icon={Rocket} defaultOpen>
        BlunderFixer analyses your games intelligently to highlight blunders and
        suggest better continuations. Chat with the built-in coach to get
        human-like explanations for every mistake.
      </FAQItem>
      <FAQItem question="How do I analyse a game?" icon={Search}>
        Head to the <strong>Analyse</strong> page and paste a PGN or choose one
        of your recent games. You&apos;ll see an evaluation graph, a list of key
        mistakes and an interactive board where you can play out better moves.
      </FAQItem>

      {/* Accounts & Integrations */}
      <h2 className="mt-20">Accounts &amp; Integrations</h2>
      <FAQItem question="How do I connect my Chess.com account?" icon={Gamepad}>
        On your first visit you&apos;ll be asked for your Chess.com username. We
        use it to fetch your recent games so you can start analysing right away.
        You can update your username anytime from the Settings page.
      </FAQItem>
      <FAQItem
        question="Why can't I connect my Lichess.org account?"
        icon={CloudOff}
      >
        We&apos;re excited to add Lichess support soon! The integration is
        underway and will let you sync games just like on Chess.com. Stay tuned.
      </FAQItem>

      {/* Analysing Games */}
      <h2 className="mt-20">Analysing Games</h2>
      <FAQItem question="What does Eval Change mean?" icon={TrendingUp}>
        Eval Change is the engine&apos;s score difference before and after the
        move. A positive number with an up arrow means the position improved for
        you, while a negative number shows it got worse.
      </FAQItem>
      <FAQItem question="What are the two time control issues?" icon={Timer}>
        BlunderFixer flags <strong>Impulsive</strong> moves when you play far
        too quickly and <strong>Overuse</strong> when you spend much more time
        than the clock budget.
        <br />
        <span className="mt-1 inline-flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-cyan-400"></span>
          <span className="text-sm text-gray-300">Impulsive</span>
          <span className="ml-4 h-3 w-3 rounded-full bg-purple-500"></span>
          <span className="text-sm text-gray-300">Overuse</span>
        </span>
        <br />
        These appear in the move list to help you spot time-related decision
        errors.
      </FAQItem>
      <FAQItem question="What does the burndown chart show?" icon={BarChart2}>
        In the report you can toggle the Time graph to <em>burndown</em> mode.
        It tracks how much clock time you and your opponent had left after each
        move so you can spot spikes where you spent or saved a lot of time.
        <br />
        <div className="mt-3 space-y-2 text-sm text-gray-300">
          <div className="flex items-center gap-3">
            <span className="h-0.25 w-12 rounded bg-[oklch(55%_0.20_310)]"></span>
            <span>Opponent</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="h-0.25 w-12 rounded bg-cyan-600"></span>
            <span>You</span>
          </div>
        </div>
      </FAQItem>

      <FAQItem
        question="I want to understand why my move was wrong"
        icon={AlertCircle}
      >
        A deeper analysis mode with coach explanations is in the works. Soon
        you&apos;ll be able to analyse any move and chat with the coach about
        alternative ideas.
      </FAQItem>

      {/* Drills & Practice */}
      <h2 className="mt-20">Drills &amp; Practice</h2>
      <FAQItem question="What are drills?" icon={Target}>
        Drills are critical positions extracted from your games. Practice them
        against the engine to reinforce the right patterns and track your
        progress over time.
      </FAQItem>
      <FAQItem question="What are the drill goals?" icon={Flag}>
        Each drill expects you to either win, draw or hold a position. The
        banner at the top of a drill tells you the goal so you know what to aim
        for.
      </FAQItem>
      <FAQItem question="What is a mastered drill?" icon={Star}>
        When you pass a drill five times in a row we mark it as{' '}
        <strong>Mastered</strong> and move it to your archive so you can focus
        on new mistakes. You can still review mastered drills from the filter
        menu.
      </FAQItem>
      <FAQItem question="Can I see my archived drills?" icon={Archive}>
        Yes. On the Drills page open <em>Filters</em> and enable{' '}
        <q>Show archived drills</q> to browse positions you&apos;ve mastered or
        manually archived.
      </FAQItem>
      <FAQItem
        question="Can I see drills I’ve recently completed?"
        icon={History}
      >
        Absolutely! Tap <strong>Recent Drills</strong> from the Drills page to
        revisit your latest attempts and retry any you want to reinforce.
      </FAQItem>
      <FAQItem
        question="What does the Blunder Size slider control?"
        icon={Sliders}
      >
        Blunder Size filters drills by how big the evaluation swing is. Bigger
        values represent more severe mistakes. Slide right for easier blunders
        or left for only the toughest challenges.
      </FAQItem>
      <FAQItem
        question="What do the tick and cross icons mean next to Last 5 Tries?"
        icon={CheckCircle}
      >
        After each drill attempt we record whether you passed or failed. Green
        ticks show successful tries and grey crosses show misses. The dots fill
        up from left to right so you can quickly track recent progress.
      </FAQItem>

      {/* Scoring & Metrics */}
      <h2 className="mt-20">Scoring &amp; Metrics</h2>
      <FAQItem question="What is Chess IQ™" icon={Brain}>
        Chess IQ™ is our composite score reflecting your improvement across
        blunder rate, tactical sharpness and time usage. The more you practice
        with BlunderFixer, the higher it climbs.
      </FAQItem>

      {/* Troubleshooting & Feedback */}
      <h2 className="mt-20">Troubleshooting &amp; Feedback</h2>
      <FAQItem question="Need more help?" icon={LifeBuoy}>
        We&apos;re constantly improving. If something doesn&apos;t work or you
        have feature suggestions, send us feedback via the Settings page or
        email{' '}
        <a href="mailto:support@blunderfixer.com">support@blunderfixer.com</a>.
      </FAQItem>
    </div>
  );
}
