// types.ts

export type InputType = 'FEN' | 'PARTIAL_FEN' | 'PGN' | 'CHESS_COM' | 'UNKNOWN';

/**
 * Immutable identity for a chess player
 */
export interface Player {
  uuid: string; // persistent unique ID for this player
  username: string; // player's username
  url: string; // link to player's profile
}

/**
 * Snapshot of a player's rating and result in a specific game
 */
export interface GamePlayer {
  player: Player; // reference to the immutable Player identity
  rating: number; // player's rating at game time
  result: string; // raw result string from the source (e.g. 'win', 'resigned', 'timeout', etc.)
}

/** One half-move (ply) with clock info */
export interface MoveNode {
  moveNumber: number; // full-move count (1,2,3…)
  side: 'w' | 'b';
  san: string; // e.g. "e4", "Nf3"
  secondsRemaining?: number; // raw from “[%clk …]”
  timeSpent?: number; // computed delta
  fen?: string;
  from?: string;
  to?: string;
  promotion?: string;
  children?: MoveNode[][];
  mateIn?: number; // if applicable, mate-in-N
}

/** Everything you need to rehydrate and re-analyze a game */
export interface GameRecord {
  id: string; // internal UUID
  source: InputType; // e.g. 'CHESS_COM'
  externalId?: string; // e.g. chess.com’s UUID or PGN hash
  updatedAt?: string; // for localStorage sync
  moves: MoveNode[];
  pgn: string;

  meta: {
    gameUrl: string; // chess.com URL
    initialFEN: string; // starting position
    timeControl: number; // base seconds (e.g. 180)
    increment: number; // increment seconds (e.g. 2)
    timeClass?: string; // 'blitz'|'rapid'…
    rated: boolean;
    rules?: string; // e.g. 'chess'
    event?: string; // from [Event “…”]
    site?: string; // from [Site “…”]
    date?: string; // from [Date “…”]
    utcDate?: string; // from [UTCDate “…”]
    utcTime?: string; // from [UTCTime “…”]
    endTime?: number; // unix timestamp
    termination?: string; // how it ended (e.g. “won by resignation”)

    players: {
      white: GamePlayer;
      black: GamePlayer;
    };

    eco?: string;
    ecoUrl?: string;
    pgnTags?: Record<string, string>;
  };
}

/**
 * Engine analysis for one half-move: evaluation, best move, PV lines
 */
export interface AnalysisNode {
  halfMoveIndex: number; // index in the ply array (0 = before White’s 1st move)
  fen: string; // FEN for this position
  evalCP: number; // centipawn evaluation (positive = White better)
  evalBefore: number; // eval before the move
  deltaCP: number; // evalCP - previous evalCP
  bestMoveUCI?: string; // UCI best move at this position
  pvLines?: PVLine[]; // top-N principal variation lines
  depth: number; // stockfish depth for analysis (int)
  mateIn?: number; // if applicable, mate-in-N
  playedMove?: string; // UCI move string (e.g. e2e4)
  san?: string; // SAN move string (e.g. e4)
  side: 'w' | 'b'; // side to move
  moveNumber: number; // full-move count (1,2,3…)
  fenBefore?: string; // FEN before the move
}

/**
 * Consolidated analysis for a complete game at a chosen depth (e.g. 12)
 */
export interface GameAnalysis {
  gameId: string; // matches GameRecord.id
  analysis: AnalysisNode[]; // one AnalysisNode per half-move
  features?: any[]; // optional feature-extraction outputs per node
}

/**
 * One principal variation (PV) line from the engine
 */
export interface PVLine {
  rank: number; // multipv index (1 = best line)
  depth: number; // search depth
  scoreCP?: number; // centipawn score of this line’s root - white +ve, black -ve
  mateIn?: number; // mate-in-N if applicable - white +ve, black -ve
  moves: string[]; // SAN moves in this PV
}

/**
 * A drill position, used for training and practice
 * Contains the FEN, evaluation swing, and other metadata
 */
export interface DrillPosition {
  id: string;
  game_id: string;
  username: string;
  fen: string;
  ply: number;
  initial_eval: number;
  eval_swing: number;
  created_at: string;
  hero_result: 'win' | 'loss' | 'draw';
  result_reason: string;
  time_control: string;
  time_class: string;
  hero_rating: number;
  opponent_username: string;
  opponent_rating: number;
  game_played_at: string;
  phase: 'opening' | 'middle' | 'late' | 'endgame';
  archived: boolean;
  has_one_winning_move: boolean;
  winning_moves: string[];
  losing_move: string;
  history: DrillHistory[];
}

export type DrillHistory = {
  id: number;
  drill_position_id: number;
  result: 'pass' | 'fail';
  reason?: string | null;
  timestamp: string; // ISO date string
};
