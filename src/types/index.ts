// types.ts

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
  result: 'win' | 'loss' | 'draw';
}

/**
 * Represents one half-move (ply) in a game, with optional branching
 */
export interface MoveNode {
  moveNumber: number; // full-move count (1,2,3...)
  side: 'w' | 'b'; // which side made this move
  san: string; // move in Standard Algebraic Notation (e.g. "e4", "Nf3")
  secondsRemaining?: number; // clock after move, in seconds
  fen?: string; // resulting FEN after this move
  from?: string; // UCI source square (e.g. "e2")
  to?: string; // UCI destination square (e.g. "e4")
  promotion?: string; // promotion piece, if any ("q","r","b","n")
  children?: MoveNode[][]; // optional variations branching off this move
}

/**
 * Complete record of a game: metadata + move tree
 */
export interface GameRecord {
  id: string; // internal unique ID for this game
  source: 'CHESS_COM' | 'LICHESS' | 'PGN' | 'FEN';
  externalId?: string; // e.g. Chess.com URL or PGN hash

  meta: {
    initialFEN: string; // starting position FEN
    timeControl: number; // seconds per side
    timeClass?: string; // "rapid", "blitz", etc.
    rated: boolean; // was the game rated?
    rules?: string; // e.g. "chess"
    date?: string; // game date tag
    termination?: string; // how the game ended

    players: {
      white: GamePlayer; // white player's snapshot
      black: GamePlayer; // black player's snapshot
    };

    eco?: string; // ECO code
    ecoUrl?: string; // link to ECO opening
    pgnTags?: Record<string, string>; // any additional PGN tags
  };

  moves: MoveNode[]; // linear move list with optional subtrees
}

/**
 * Engine analysis for one half-move: evaluation, best move, PV lines
 */
export interface AnalysisNode {
  halfMoveIndex: number; // index in the ply array (0 = before White’s 1st move)
  fen: string; // FEN for this position
  evalCP: number; // centipawn evaluation (positive = White better)
  deltaCP: number; // evalCP - previous evalCP
  bestMove?: string; // UCI best move at this position
  pvLines?: PVLine[]; // top-N principal variation lines
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
  scoreCP?: number; // centipawn score of this line’s root
  mateIn?: number; // mate-in-N if applicable
  moves: string[]; // SAN moves in this PV
}
