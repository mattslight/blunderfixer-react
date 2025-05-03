// src/lib/StockfishEngine.ts
import { Subject } from 'rxjs';

const DEBUG = true;

export class StockfishEngine {
  private worker: Worker;
  public lines$ = new Subject<string>();

  // UCI ready handshake
  private resolveReady!: () => void;
  private readyPromise: Promise<void>;

  constructor(private multiPV: number) {
    // make sure the .wasm loader can find its file
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
      DEBUG && console.log('[StockfishEngine] [RAW]', msg);
      if (msg.trim() === 'readyok') {
        // resolve handshake, then re-arm
        DEBUG && console.log('[StockfishEngine] ⬅ readyok');
        this.resolveReady();
        this.readyPromise = new Promise((res) => (this.resolveReady = res));
      }
      // always publish all lines
      this.lines$.next(msg);
    });

    // UCI handshake: init + set multipv + ensure ready
    this.send('uci');
    this.send(`setoption name MultiPV value ${this.multiPV}`);
    this.send('isready');
  }

  private send(cmd: string) {
    DEBUG && console.log('[StockfishEngine] →', cmd);
    this.worker.postMessage(cmd);
  }

  async analyze(fen: string, depth: number) {
    console.log('[StockfishEngine] ▶ ANALYZE start', { fen, depth });

    this.send('stop');
    this.send('isready');
    console.log('[StockfishEngine] → isready sent, waiting…');

    const t0 = performance.now();
    await this.readyPromise;
    const t1 = performance.now();
    console.log(
      `[StockfishEngine] ⬅ got readyok after ${(t1 - t0).toFixed(0)}ms`
    );

    this.send('ucinewgame');
    this.send(`position fen ${fen}`);
    this.send(`go depth ${depth}`);
    console.log('[StockfishEngine] → go sent');
  }

  stop() {
    DEBUG && console.log('[StockfishEngine] stop');
    this.send('stop');
  }

  quit() {
    DEBUG && console.log('[StockfishEngine] quit');
    this.send('quit');
  }
}
