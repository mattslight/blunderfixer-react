// src/lib/StockfishEngine.ts
import { Subject, Subscription } from 'rxjs';

const DEBUG = false;

export class StockfishEngine {
  private worker: Worker;
  public lines$ = new Subject<string>();

  /** Tracks the latest request; any earlier run should bail out */
  private latestRequestId = 0;

  /** UCI “readyok” handshake; re-armed each time we send isready */
  private resolveReady!: () => void;
  private readyPromise: Promise<void>;

  constructor(private multiPV: number) {
    (self as any).Module = {
      locateFile: (f: string) =>
        f.endsWith('.wasm')
          ? '/engines/stockfish-17-lite/stockfish-17-lite-single.wasm'
          : f,
    };

    this.worker = new Worker(
      '/engines/stockfish-17-lite/stockfish-17-lite-single.js',
      { type: 'module' }
    );

    this.readyPromise = new Promise((res) => (this.resolveReady = res));

    this.worker.addEventListener('message', (e) => {
      const msg = e.data as string;
      if (DEBUG) console.log('[StockfishEngine] [RAW]', msg);
      if (msg.trim() === 'readyok') {
        if (DEBUG) console.log('[StockfishEngine] ⬅ readyok');
        this.resolveReady();
        this.readyPromise = new Promise((res) => (this.resolveReady = res));
      }
      this.lines$.next(msg);
    });

    // Initial UCI handshake
    this.send('uci');
    this.send(`setoption name MultiPV value ${this.multiPV}`);
    this.send(`setoption name Hash value 4`); // keep hash low to avoid OOM
    this.send('isready');
  }

  private send(cmd: string) {
    if (DEBUG) console.log('[StockfishEngine] →', cmd);
    this.worker.postMessage(cmd);
  }

  /** Wait until engine replies “readyok” to our last isready */
  private async waitReady() {
    this.send('isready');
    await this.readyPromise;
  }

  /**
   * Drop-stale: every call gets a new requestId. As soon as a newer call arrives,
   * any pending work in the old one bails out at the next check.
   */
  async analyze(fen: string, depth: number) {
    const myId = ++this.latestRequestId;

    // First, interrupt any existing search if it’s running
    // Sending “go” by itself will implicitly stop the previous search.
    // We do NOT fire “stop” + “isready” here, because that can trigger races in Lite builds.
    // Instead, immediately send new position/go and let the engine drop old work.

    // 1) New “ucinewgame” & “position”
    this.send('ucinewgame');
    this.send(`position fen ${fen}`);

    // 2) Wait for engine to acknowledge the new position
    await this.waitReady();
    if (myId !== this.latestRequestId) return;

    // 3) Now send “go depth”
    this.send(`go depth ${depth}`);
    if (DEBUG) console.log('[StockfishEngine] ➡ go depth', depth);
    // Once we’ve started this search, the only bail-out point is before “go” above.
  }

  /**
   * Returns the bestmove string once Stockfish emits “bestmove …”.
   * Relies on the same requestId pattern so that if a newer run began,
   * we never resolve with an outdated bestmove.
   */
  async bestMove(fen: string, depth: number): Promise<string> {
    const myId = ++this.latestRequestId;

    // Immediately send “ucinewgame” + “position” + “go depth”
    this.send('ucinewgame');
    this.send(`position fen ${fen}`);
    await this.waitReady();
    if (myId !== this.latestRequestId) throw new Error('stale request');

    this.send(`go depth ${depth}`);
    if (DEBUG) console.log('[StockfishEngine] ➡ go depth', depth);

    return new Promise<string>((resolve, reject) => {
      let sub: Subscription;
      sub = this.lines$.subscribe((msg) => {
        if (myId !== this.latestRequestId) {
          sub.unsubscribe();
          reject(new Error('stale bestmove'));
          return;
        }
        if (msg.startsWith('bestmove')) {
          const parts = msg.split(' ');
          const best = parts[1];
          if (best) {
            resolve(best);
          } else {
            reject(new Error('no bestmove token'));
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
