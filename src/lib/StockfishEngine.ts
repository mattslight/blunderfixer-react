// src/lib/StockfishEngine.ts
import { Subject, Subscription } from 'rxjs';

const DEBUG = true;

/**
 * A lightweight wrapper around a Stockfish WebAssembly worker.
 *
 * Usage:
 *   1) const engine = new StockfishEngine(1);
 *   2) await engine.init();                  // <— wait for UCI handshake
 *   3) const best = await engine.bestMove(fen, depth);
 *   4) engine.stop(); // if you need to cancel mid‐search
 *   5) engine.quit(); // when you’re done forever
 */
export class StockfishEngine {
  private worker: Worker;
  public lines$ = new Subject<string>();

  /** Tracks the latest request; any earlier run should bail out */
  private latestRequestId = 0;

  /** A “readyok” promise that is re-armed each time we send isready */
  private resolveReady!: () => void;
  private readyPromise: Promise<void>;

  constructor(private multiPV: number) {
    // Configure locateFile so that the .wasm is found under /engines/…
    (self as any).Module = {
      locateFile: (f: string) =>
        f.endsWith('.wasm')
          ? '/engines/stockfish-17-lite/stockfish-17-lite.wasm'
          : f,
    };

    // Spawn the Stockfish worker (the “lite” build in this case)
    this.worker = new Worker(
      '/engines/stockfish-17-lite/stockfish-17-lite.js',
      { type: 'module' }
    );

    // Create our initial “readyPromise” and its resolver
    this.readyPromise = new Promise((res) => (this.resolveReady = res));

    // Listen for messages from the worker
    this.worker.addEventListener('message', (e) => {
      const msg = e.data as string;
      if (DEBUG) console.log('[StockfishEngine] [RAW]', msg);

      // Whenever Stockfish sends “readyok”, resolve our current readyPromise
      if (msg.trim() === 'readyok') {
        if (DEBUG) console.log('[StockfishEngine] ⬅ readyok');
        this.resolveReady();

        // Re-arm the next readyPromise so that subsequent waitReady() calls will work
        this.readyPromise = new Promise((res) => (this.resolveReady = res));
      }

      // Publish all lines (info, bestmove, etc.) on our RxJS subject
      this.lines$.next(msg);
    });

    // Kick off the initial UCI handshake:
    //  1) “uci” → Stockfish prints available options
    //  2) set MultiPV + set Hash
    //  3) “isready” → Stockfish will eventually reply “readyok”
    this.send('uci');
    this.send(`setoption name MultiPV value ${this.multiPV}`);
    this.send(`setoption name Hash value 4`); // small hash to avoid OOM in‐browser
    this.send('isready');
  }

  /**
   * PUBLIC: Wait for the very first “readyok” before using this engine.
   * Call this exactly once (immediately after `new StockfishEngine(...)`).
   */
  public async init(): Promise<void> {
    if (DEBUG) console.log('[StockfishEngine] awaiting initial readyok…');
    await this.readyPromise;
    if (DEBUG) console.log('[StockfishEngine] initial handshake complete');
  }

  /** Low-level helper to post() a UCI command into the worker. */
  private send(cmd: string) {
    if (DEBUG) console.log('[StockfishEngine] →', cmd);
    this.worker.postMessage(cmd);
  }

  /**
   * INTERNAL: Send “isready” and await the next “readyok”.
   * Always re-arms the readyPromise after it resolves.
   */
  private async waitReady() {
    this.send('isready');
    await this.readyPromise;
  }

  /**
   * Drop-stale analysis: if a newer search arrives, older ones bail out.
   *
   * 1) Stop any previous search, wait for readyok
   * 2) Send new position, wait for readyok
   * 3) Send “go depth N”
   */
  public async analyze(fen: string, depth: number) {
    const myId = ++this.latestRequestId;

    // 1) Tell any existing search to stop, then await its “readyok”
    this.send('stop');
    await this.waitReady();
    if (myId !== this.latestRequestId) {
      // A newer search replaced us in the meantime; bail out.
      return;
    }

    // 2) Send “ucinewgame” + “position fen …”, then await “readyok” again
    this.send('ucinewgame');
    this.send(`position fen ${fen}`);
    await this.waitReady();
    if (myId !== this.latestRequestId) {
      return;
    }

    // 3) Finally, start the search
    this.send(`go depth ${depth}`);
    if (DEBUG) console.log('[StockfishEngine] ➡ go depth', depth);
  }

  /**
   * PUBLIC: Run a single‐shot search for the best move.
   * Returns the UCI string for the best move (e.g. “e2e4” or “e7e8q”).
   *
   * Internally this does:
   *   send “ucinewgame” + “position fen …”
   *   await waitReady()
   *   send “go depth N”
   *   wait until we see “bestmove …” on lines$
   */
  public async bestMove(fen: string, depth: number): Promise<string> {
    const myId = ++this.latestRequestId;

    // 1) Immediately send “ucinewgame” + “position” so the engine knows the new position
    this.send('ucinewgame');
    this.send(`position fen ${fen}`);

    // 2) Wait for the engine’s “readyok” after setting the position
    await this.waitReady();
    if (myId !== this.latestRequestId) {
      throw new Error('stale request'); // a newer bestMove() call replaced this one
    }

    // 3) Now send “go depth …”
    this.send(`go depth ${depth}`);
    if (DEBUG) console.log('[StockfishEngine] ➡ go depth', depth);

    // 4) Listen until we see “bestmove …”
    return new Promise<string>((resolve, reject) => {
      let sub: Subscription;
      sub = this.lines$.subscribe((msg) => {
        // If a newer request came in, bail out
        if (myId !== this.latestRequestId) {
          sub.unsubscribe();
          reject(new Error('stale bestmove'));
          return;
        }

        // Look for “bestmove X” in the UCI output
        if (msg.startsWith('bestmove')) {
          const parts = msg.split(' ');
          const best = parts[1];
          if (best) {
            resolve(best);
          } else {
            reject(new Error('no bestmove token found'));
          }
          sub.unsubscribe();
        }
      });
    });
  }

  /** PUBLIC: Cancel any ongoing search. */
  public stop() {
    if (DEBUG) console.log('[StockfishEngine] stop');
    this.send('stop');
  }

  /** PUBLIC: Quit & terminate the worker. */
  public quit() {
    if (DEBUG) console.log('[StockfishEngine] quit');
    this.send('quit');
  }
}
