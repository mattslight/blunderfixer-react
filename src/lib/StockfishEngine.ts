// src/lib/StockfishEngine.ts
import { Subject, Subscription } from 'rxjs';

const DEBUG = true;

export class StockfishEngine {
  private worker: Worker;
  public lines$ = new Subject<string>();

  // UCI ready handshake
  private resolveReady!: () => void;
  private readyPromise: Promise<void>;

  constructor(private multiPV: number) {
    // make sure the .wasm loader can find its file
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (self as any).Module = {
      locateFile: (f: string) =>
        f.endsWith('.wasm') ? '/stockfish-nnue-16-single.wasm' : f,
    };

    this.worker = new Worker('/stockfish-nnue-16-single.js', {
      type: 'module',
    });

    // build initial readyPromise
    this.readyPromise = new Promise((res) => (this.resolveReady = res));

    // forward readyok into handshake and all messages into lines$
    this.worker.addEventListener('message', (e) => {
      const msg = e.data as string;
      if (DEBUG) console.log('[StockfishEngine] [RAW]', msg);
      if (msg.trim() === 'readyok') {
        if (DEBUG) console.log('[StockfishEngine] ⬅ readyok');
        this.resolveReady();
        // re-arm for next isready
        this.readyPromise = new Promise((res) => (this.resolveReady = res));
      }
      this.lines$.next(msg);
    });

    // UCI handshake: init + set multipv + ensure ready
    this.send('uci');
    this.send(`setoption name MultiPV value ${this.multiPV}`);
    this.send('isready');
  }

  private send(cmd: string) {
    if (DEBUG) console.log('[StockfishEngine] →', cmd);
    this.worker.postMessage(cmd);
  }

  /**
   * Start a depth-limited analysis (streams info through lines$)
   */
  async analyze(fen: string, depth: number) {
    if (DEBUG)
      console.log('[StockfishEngine] ▶ ANALYZE start', { fen, depth });

    // 1) Kill any prior search and wait for engine idle
    this.send('stop');
    this.send('isready');
    if (DEBUG)
      console.log('[StockfishEngine] → isready sent (stop phase), waiting…');
    await this.readyPromise;
    if (DEBUG) console.log('[StockfishEngine] ⬅ got readyok (stop phase)');

    // 2) Initialize new game and set position
    this.send('ucinewgame');
    this.send(`position fen ${fen}`);
    if (DEBUG) console.log('[StockfishEngine] → position fen sent');

    // 3) Wait again so engine is truly on new FEN
    this.send('isready');
    if (DEBUG)
      console.log(
        '[StockfishEngine] → isready sent (position phase), waiting…'
      );
    await this.readyPromise;
    if (DEBUG) console.log('[StockfishEngine] ⬅ got readyok (position phase)');

    // 4) Finally begin search
    this.send(`go depth ${depth}`);
    if (DEBUG) console.log('[StockfishEngine] ➡ go depth sent');
  }

  /**
   * Compute the best move for the given position and depth.
   * Returns a Promise resolving to the UCI string of the best move.
   */
  async bestMove(fen: string, depth: number): Promise<string> {
    // stop any existing search and wait ready
    this.send('stop');
    this.send('isready');
    await this.readyPromise;

    // set up new game and position
    this.send('ucinewgame');
    this.send(`position fen ${fen}`);
    this.send(`go depth ${depth}`);

    return new Promise<string>((resolve, reject) => {
      let sub: Subscription;
      sub = this.lines$.subscribe((msg) => {
        if (msg.startsWith('bestmove')) {
          const parts = msg.split(' ');
          const best = parts[1];
          if (best) {
            resolve(best);
          } else {
            reject(new Error('StockfishEngine.bestMove: no bestmove token'));
          }
          sub.unsubscribe();
        }
      });
    });
  }

  /**
   * Cancel any ongoing search
   */
  stop() {
    if (DEBUG) console.log('[StockfishEngine] stop');
    this.send('stop');
  }

  /**
   * Quit the engine (terminate worker)
   */
  quit() {
    if (DEBUG) console.log('[StockfishEngine] quit');
    this.send('quit');
  }
}
