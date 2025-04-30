// src/hooks/useStockfish.ts
import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { Chess, type Square } from 'chess.js';

type Promotion = 'n' | 'b' | 'r' | 'q';

class StockfishEngine {
  private worker: Worker;
  private send: (c: string) => void;
  onRaw: (cb: (msg: string) => void) => void;

  constructor() {
    this.worker = new Worker('/stockfish.js');
    this.send = (c) => {
      console.log('[SF SEND]', c);
      this.worker.postMessage(c);
    };
    this.onRaw = (cb) =>
      this.worker.addEventListener('message', (e) => {
        console.log('[SF RAW]', e.data);
        cb(e.data as string);
      });
    this.send('uci');
    this.send('isready');
  }
  setMultiPV(n: number) {
    this.send(`setoption name MultiPV value ${n}`);
    this.send('isready');
  }
  analyze(fen: string, depth: number) {
    this.send(`position fen ${fen}`);
    this.send(`go depth ${depth}`);
  }
  stop() {
    this.send('stop');
  }
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

export function useStockfish(
  initialDepth = 12,
  linesCount = 3
): {
  lines: AnalysisLine[];
  bestMove?: string;
  currentDepth: number;
  runAnalysis: (fen: string, depth?: number) => void;
  stopAnalysis: () => void;
} {
  const engine = useMemo(() => new StockfishEngine(), []);
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
  const [currentDepth, setDepth] = useState(initialDepth);
  const lastFENRef = useRef<string>('');

  // subscribe once
  useEffect(() => {
    engine.onRaw((uciLine) => {
      if (!uciLine.startsWith('info ')) return;
      const mpv = Number(uciLine.match(/multipv (\d+)/)?.[1] ?? 0);
      const d = Number(uciLine.match(/depth (\d+)/)?.[1] ?? 0);
      const sc = uciLine.match(/score cp (-?\d+)/);
      const sm = uciLine.match(/score mate (-?\d+)/);
      const pv = uciLine.match(/ pv (.+)/)?.[1].split(' ') ?? [];
      if (mpv < 1 || mpv > linesCount || pv.length === 0) return;

      const fen = lastFENRef.current;
      if (!fen) return;

      // convert UCI→SAN
      const chess = new Chess(fen);
      const sanMoves: string[] = [];
      for (const uci of pv) {
        try {
          const mv = chess.move({
            from: uci.slice(0, 2) as Square,
            to: uci.slice(2, 4) as Square,
            promotion: uci[4] as Promotion,
          });
          if (!mv) break;
          sanMoves.push(mv.san);
        } catch {
          break;
        }
      }
      if (sanMoves.length === 0) return;

      setLines((old) => {
        const next = [...old];
        const slot = mpv - 1;
        if (d >= next[slot].searchDepth) {
          next[slot] = {
            rank: mpv,
            moves: sanMoves,
            scoreCP: sc ? Number(sc[1]) : undefined,
            mateIn: sm ? Number(sm[1]) : undefined,
            searchDepth: d,
          };
        }
        return next;
      });

      if (mpv === 1) setBestMove(sanMoves[0]);
    });

    return () => {
      engine.quit();
    };
  }, [engine, linesCount]);

  // stable runAnalysis
  const runAnalysis = useCallback(
    (fen: string, depth = initialDepth) => {
      // validate without throwing
      const v = (Chess as any).validate_fen
        ? (Chess as any).validate_fen(fen)
        : { valid: true };
      if (!v.valid) {
        console.warn('Invalid FEN, skipping:', fen);
        return;
      }

      lastFENRef.current = fen;
      setDepth(depth);
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

      engine.setMultiPV(linesCount);
      engine.analyze(fen, depth);
    },
    [engine, initialDepth, linesCount]
  );

  return {
    lines,
    bestMove,
    currentDepth,
    runAnalysis,
    stopAnalysis: () => engine.stop(),
  };
}
