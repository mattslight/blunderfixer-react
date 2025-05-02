// src/hooks/useStockfish.ts
import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { Chess, type Square } from 'chess.js';

type Promotion = 'n' | 'b' | 'r' | 'q';

const DEBUG = false;

class StockfishEngine {
  private worker: Worker;
  private send: (c: string) => void;
  private resolveReady!: () => void;
  private readyPromise: Promise<void>;
  private rawListeners = new Set<(msg: string) => void>();

  constructor(multiPV: number) {
    // ensure wasm loader knows where to fetch the .wasm
    (self as any).Module = {
      locateFile: (f: string) =>
        f.endsWith('.wasm') ? '/stockfish-nnue-16-single.wasm' : f,
    };

    this.worker = new Worker('/stockfish-nnue-16-single.js', {
      type: 'module',
    });

    // build a promise that resolves on each readyok
    this.readyPromise = new Promise((res) => (this.resolveReady = res));

    this.worker.addEventListener('message', (e) => {
      const msg = e.data as string;
      DEBUG && console.log('[SF RAW]', msg);
      // fire subscribers
      for (const cb of this.rawListeners) cb(msg);
      // resolve on readyok
      if (msg.trim() === 'readyok') {
        this.resolveReady();
        this.readyPromise = new Promise((res) => (this.resolveReady = res));
      }
    });

    this.send = (cmd: string) => {
      DEBUG && console.log('[SF SEND]', cmd);
      this.worker.postMessage(cmd);
    };

    // fire up UCI
    this.send('uci');
    // only once: set multipv
    this.send(`setoption name MultiPV value ${multiPV}`);
    // sync point
    this.send('isready');
  }

  onRaw(cb: (msg: string) => void) {
    this.rawListeners.add(cb);
  }

  offRaw(cb: (msg: string) => void) {
    this.rawListeners.delete(cb);
  }

  async analyze(fen: string, depth: number) {
    // if it's already calculating, stop it
    this.send('stop');
    // wait for readyok
    this.send('isready');
    await this.readyPromise;

    // new game resets book, internal caches
    this.send('ucinewgame');
    // set the position and start thinking
    this.send(`position fen ${fen}`);
    this.send(`go depth ${depth}`);
  }

  stop() {
    this.send('stop');
  }

  // never automatically quit on React unmount!
  quit() {
    this.send('quit');
  }
}

export type AnalysisLine = {
  rank: number;
  moves: string[];
  scoreCP?: number;
  mateIn?: number;
  searchDepth: number;
};

let _singleton: StockfishEngine | null = null;

export default function useStockfish(
  initialDepth = 12,
  linesCount = 3
): {
  lines: AnalysisLine[];
  bestMove?: string;
  currentDepth: number;
  runAnalysis: (fen: string, depth?: number) => void;
  stopAnalysis: () => void;
} {
  const engine = useMemo(() => {
    if (!_singleton) {
      DEBUG && console.log('[STOCKFISH] creating singleton engine');
      _singleton = new StockfishEngine(linesCount);
    }
    return _singleton;
  }, [linesCount]);

  const [lines, setLines] = useState<AnalysisLine[]>(() =>
    Array.from({ length: linesCount }, (_, i) => ({
      rank: i + 1,
      moves: [],
      scoreCP: undefined,
      mateIn: undefined,
      searchDepth: 0,
    }))
  );
  const [bestMove, setBestMove] = useState<string>();
  const [currentDepth, setCurrentDepth] = useState(initialDepth);
  const lastFENRef = useRef<string>('');

  // parse incoming “info …” lines
  useEffect(() => {
    const handler = (uciLine: string) => {
      // When debugging always print every raw line, so we can see the FEN it’s tied to:
      if (DEBUG) {
        console.log(
          '%c[SF RAW]',
          'color: purple; font-weight: bold;',
          'for FEN →',
          lastFENRef.current,
          '\n   msg →',
          uciLine
        );
      }

      if (!uciLine.startsWith('info ')) return;
      const dm = uciLine.match(/depth (\d+)/);
      const mm = uciLine.match(/multipv (\d+)/);
      const cp = uciLine.match(/score cp (-?\d+)/);
      const mt = uciLine.match(/score mate (-?\d+)/);
      const pv = uciLine.match(/ pv (.+)/);
      if (!dm || !mm || !pv) return;

      const d = +dm[1],
        mpv = +mm[1],
        movesUci = pv[1].split(' ');
      const fen = lastFENRef.current;
      if (!fen) return;

      const chess = new Chess(fen);
      const san: string[] = [];
      for (const u of movesUci) {
        const m = chess.move({
          from: u.slice(0, 2) as Square,
          to: u.slice(2, 4) as Square,
          promotion: (u[4] as Promotion) || undefined,
        });
        if (!m) break;
        san.push(m.san);
      }
      if (!san.length) return;

      setLines((old) => {
        const next = [...old];
        const idx = mpv - 1;
        if (d >= next[idx].searchDepth) {
          next[idx] = {
            rank: mpv,
            moves: san,
            scoreCP: cp ? +cp[1] : undefined,
            mateIn: mt ? +mt[1] : undefined,
            searchDepth: d,
          };
        }
        return next;
      });
      if (mpv === 1) setBestMove(san[0]);
    };
    engine.onRaw(handler);
    // cleanup on unmount / re-run
    return () => {
      engine.offRaw(handler);
      engine.stop(); // make extra sure no old analysis is running
    };
  }, [engine, linesCount]);

  const runAnalysis = useCallback(
    (fen: string, depth = initialDepth) => {
      lastFENRef.current = fen;
      setCurrentDepth(depth);
      setBestMove(undefined);
      setLines(
        Array.from({ length: linesCount }, (_, i) => ({
          rank: i + 1,
          moves: [],
          scoreCP: undefined,
          mateIn: undefined,
          searchDepth: 0,
        }))
      );
      engine.analyze(fen, depth);
    },
    [engine, initialDepth, linesCount]
  );

  const stopAnalysis = useCallback(() => engine.stop(), [engine]);

  return {
    lines,
    bestMove,
    currentDepth,
    runAnalysis,
    stopAnalysis,
  };
}
