// src/lib/chessComParser.ts
import { Chess, DEFAULT_POSITION } from 'chess.js';
import crypto from 'crypto';

import { GamePlayer, GameRecord, MoveNode, Player } from '@/types';

const DEBUG = false;

/**
 * Compute a SHA-256 hash of the normalized PGN string
 */
export function hashPGN(pgn: string): string {
  const normalized = pgn
    .replace(/\{(?!\[%clk)[^}]*\}/g, '') // strip comments EXCEPT clock-tags
    .replace(/\$\d+/g, '') // strip NAGs
    .replace(/\s+/g, ' ') // collapse whitespace
    .trim();
  return crypto.createHash('sha256').update(normalized).digest('hex');
}

/**
 * Parse a Chess.com JSON + PGN into our GameRecord shape
 */
export function parseChessComGame(json: any): GameRecord {
  // 1) immutable identity
  const whiteIdentity: Player = {
    username: json.white.username,
    uuid: json.white.uuid,
    url: json.white['@id'],
  };
  const blackIdentity: Player = {
    username: json.black.username,
    uuid: json.black.uuid,
    url: json.black['@id'],
  };

  // 2) snapshot for this game
  const white: GamePlayer = {
    player: whiteIdentity,
    rating: json.white.rating,
    result: json.white.result,
  };

  const black: GamePlayer = {
    player: blackIdentity,
    rating: json.black.rating,
    result: json.black.result,
  };

  // 2) Pull out all PGN tags
  const tagRegex = /^\[(\w+)\s+"([^"]*)"\]/gm;
  const pgnTags: Record<string, string> = {};
  let m: RegExpExecArray | null;
  while ((m = tagRegex.exec(json.pgn))) {
    pgnTags[m[1]] = m[2];
  }

  // 3) Known tags
  const {
    Event,
    Site,
    Date,
    UTCDate,
    UTCTime,
    TimeControl,
    ECO,
    ECOUrl,
    Link: _Link,
  } = pgnTags;

  // 4) Parse time-control + increment
  //    Chess.com gives "180+2"
  const [tcSec, incSec = 0] = (json.time_control || TimeControl || '')
    .split('+')
    .map((n: string) => parseInt(n, 10) || 0);

  // 5) HARVEST all clock‐tags up front
  const clockMatches = Array.from(
    json.pgn.matchAll(/\{\[%clk\s*([0-9:.]+)\]\}/g)
  ).map((m) => m[1].trim());

  // 6) STRIP everything *including* clock‐comments
  //    – remove [Tags]
  //    – remove clock comments
  //    – remove NAGs ($N)
  //    – remove move‐numbers
  const movesOnly = json.pgn
    .replace(tagRegex, '') // strip [Tag "..."]
    .replace(/\{\[%clk\s*[0-9:.]+\]\}/g, '') // strip {[%clk ...]}
    .replace(/\$\d+/g, '') // strip $N
    .replace(/(^|\s)\d+\.(\.\.)?/g, '$1') // strip "1." "2..." only at start
    .trim();

  // 7) SPLIT into SAN tokens
  const rawSans = movesOnly.split(/\s+/);

  // and drop any result tokens (1-0, 0-1, 1/2-1/2)
  const sans = rawSans.filter((tok) => !/^(1-0|0-1|1\/2-1\/2)$/.test(tok));

  // 8) ZIP SANs back to clocks by index
  const moveTokens = sans.map((san, idx) => ({
    san,
    rawClock: clockMatches[idx],
  }));

  // ── DEBUG CLOCK TOKENS ──
  if (DEBUG) {
    console.groupCollapsed(
      `⚙️ Debug moveTokens for ${json.white.username} vs ${json.black.username}`
    );
    moveTokens.forEach((tok, idx) => {
      const parts = tok.rawClock?.split(':').map(Number) || [];
      let secondsRemaining: number | undefined;
      if (parts.length === 2) {
        secondsRemaining = parts[0] * 60 + parts[1];
      } else if (parts.length === 3) {
        secondsRemaining = parts[0] * 3600 + parts[1] * 60 + parts[2];
      }
      if (DEBUG)
        console.log(
          `#${idx} SAN=${tok.san.padEnd(6)} rawClock="${tok.rawClock}" → parts=[${parts.join(',')}] → secondsRemaining=${secondsRemaining}`
        );
    });
    console.groupEnd();
  }
  // ── END DEBUG ──

  // 7) Replay moves to build MoveNode[]
  const chess = new Chess(json.initial_setup || DEFAULT_POSITION);
  const moves: MoveNode[] = moveTokens.map((tok, idx) => {
    const moveNumber = Math.floor(idx / 2) + 1;
    const side: 'w' | 'b' = idx % 2 === 0 ? 'w' : 'b';

    // apply the SAN
    const mObj = chess.move(tok.san, { strict: false });
    const fen = chess.fen();
    const from = mObj?.from;
    const to = mObj?.to;
    const promotion = mObj?.promotion;

    // parse clock string into secondsRemaining
    let secondsRemaining: number | undefined;
    if (tok.rawClock) {
      const parts = tok.rawClock.split(':').map(Number);
      if (parts.length === 2) {
        secondsRemaining = parts[0] * 60 + parts[1];
      } else if (parts.length === 3) {
        secondsRemaining = parts[0] * 3600 + parts[1] * 60 + parts[2];
      }
    }

    return {
      moveNumber,
      side,
      san: tok.san,
      secondsRemaining,
      // timeSpent to be filled below
      fen,
      from,
      to,
      promotion,
    } as MoveNode;
  });

  // 8) Compute timeSpent = lastRawClock + incSec - currentRawClock
  let lastRawClockW = tcSec, // before White’s 1st move
    lastRawClockB = tcSec; // before Black’s 1st move

  moves.forEach((node) => {
    if (typeof node.secondsRemaining === 'number') {
      // previous clock for whoever just moved
      const prev = node.side === 'w' ? lastRawClockW : lastRawClockB;

      // spent = prev + inc - current
      let spent = prev + incSec - node.secondsRemaining;
      if (spent < 0) spent = 0;

      // round to 1 decimal place (or whatever you prefer)
      node.timeSpent = parseFloat(spent.toFixed(1));

      // now slide the window: this raw clock becomes the "previous" for next time
      if (node.side === 'w') {
        lastRawClockW = node.secondsRemaining;
      } else {
        lastRawClockB = node.secondsRemaining;
      }
    }
  });

  // 9) Assemble full GameRecord
  return {
    id: json.uuid,
    source: 'CHESS_COM',
    externalId: json.uuid,
    pgn: json.pgn,
    meta: {
      gameUrl: json.url,
      event: Event,
      site: Site,
      date: Date,
      utcDate: UTCDate,
      utcTime: UTCTime,
      timeControl: tcSec,
      increment: incSec,
      timeClass: json.time_class,
      rated: json.rated,
      rules: json.rules,
      initialFEN: json.initial_setup,
      endTime: json.end_time,
      players: { white, black },
      eco: ECO,
      ecoUrl: ECOUrl,
      pgnTags, // catch-all
    },
    moves,
  };
}
