# Feature Epic: Two-Pronged Game Analysis

## Overview

BlunderFixer will provide an **instant “Quick Scan”** in the browser for shallow blunder detection, and a **“Deep Dive”** on the server for full-depth analysis, feature extraction, and robust classification.

---

## Front-End: Quick Scan (Depth 12)

- **Trigger**: User loads/pastes a game.
- **Engine**: `StockfishEngine.js` at depth 12, multiPV 3.
- **Output**:
  - Per-move eval curve.
  - Blunders (Δ ≥ 1.0).
  - PV lines for immediate review.
- **UI**:
  - Eval graph with highlighted blunders.
  - “Review” buttons for each obvious blunder.
  - Replay flow for user to test the best move.

### User Stories

- **FE-US1**: As a user, I want to see an evaluation graph immediately so I can spot where my advantage shifted.
- **FE-US2**: As a user, I want obvious blunders highlighted so I can jump straight to the critical mistakes.
- **FE-US3**: As a user, I want to try my own move and then see the engine’s best line, so I actively learn from each error.

### Tasks

1. Wire `StockfishEngine.js` call on game load.
2. Render eval sparkline and mark Δ ≥ 1.0 points.
3. Implement “Review” modal that sets board to pre-blunder FEN.
4. Hook existing deep-dive replay flow into these quick-scan markers.

## Back-End: Deep Dive (Depth 20–25 + Feature Extraction)

- **Endpoint**: `POST /api/analyze-game`

  ```json
  { "pgn": "...", "timeControl": 600 }
  ```

- **Pipeline**:

  1. Enqueue analysis task (Celery/RQ).
  2. Python-Stockfish at depth 20+, multiPV 5.
  3. Use `python-chess` to:
     - Replay game, extract `{ timeRemaining, timeControl }`.
     - Classify each blunder with `type/subType` (Tactical, Positional, LowClock, Instinctive).
  4. Call feature-extraction API for each blunder.
  5. Persist enriched blunder list to database.

- **Client Sync**:
  - FE fires job, receives `jobId`.
  - Poll `GET /api/jobs/{jobId}` until `status: done`.
  - Fetch `GET /api/games/{gameId}/blunders` for full data.

### User Stories

- **BE-US1**: As a user, I want my entire game to be analyzed at high depth so I get precise, fine-grained feedback.
- **BE-US2**: As a premium user, I want to batch-analyze multiple games overnight so I can review them later.
- **BE-US3**: As a user, I want to filter my mistakes by type (e.g. forks, pawn-structure) so I can focus my training.

### Tasks

1. Create FastAPI route `POST /api/analyze-game`.
2. Set up task queue (Celery or RQ) to run Stockfish + python-chess.
3. Write `classifyBlunder` in Python:
   - Detect `Tactical` vs `Positional` vs `TimePressure` subtypes.
4. Integrate feature-extraction API calls within the task.
5. Design DB schema for enriched blunder records.
6. Implement job polling endpoints and FE hook `useDeepAnalysis`.
7. Enforce rate limits (free vs premium quotas).
