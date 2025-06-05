export default function HelpPage() {
  return (
    <div className="prose dark:prose-invert mx-auto max-w-3xl px-4 py-8">
      <h1>Help &amp; FAQ</h1>
      <p>
        BlunderFixer helps you understand your chess mistakes and turn them into
        learning opportunities. Below are answers to common questions.
      </p>

      <h2>What is BlunderFixer?</h2>
      <p>
        BlunderFixer analyses your games using Stockfish and our own heuristics
        to highlight blunders and suggest better continuations. Chat with the
        built-in coach to get human-like explanations for every mistake.
      </p>

      <h2>How do I connect my Chess.com account?</h2>
      <p>
        On your first visit you&apos;ll be asked for your Chess.com username. We
        use it to fetch your recent games so you can start analysing right away.
        You can update your username anytime from the Settings page.
      </p>

      <h2>How do I analyse a game?</h2>
      <p>
        Head to the <strong>Analyse</strong> page and paste a PGN or choose one
        of your recent games. You&apos;ll see an evaluation graph, a list of key
        mistakes and an interactive board where you can play out better moves.
      </p>

      <h2>What are drills?</h2>
      <p>
        Drills are critical positions extracted from your games. Practice them
        against the engine to reinforce the right patterns and track your
        progress over time.
      </p>

      <h2>What is Chess IQ?</h2>
      <p>
        Chess IQ is our composite score reflecting your improvement across
        blunder rate, tactical sharpness and time usage. The more you practice
        with BlunderFixer, the higher it climbs.
      </p>

      <h2>Need more help?</h2>
      <p>
        We&apos;re constantly improving. If something doesn&apos;t work or you
        have feature suggestions, send us feedback via the Settings page.
      </p>
    </div>
  );
}
