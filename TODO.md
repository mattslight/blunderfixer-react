# BlunderFixer TODO

## In Progress

- [x] Sort out GameStoreDebug (what's the UX)

- [ ] Save 'shallow' game analysis so they don't re-run
- [ ] Move graph and table summary to Analysis page (what's the UX)
- [ ] Remember user's handle (option to change)
- [ ] Show which games are synced
      = [ ] Find the critical positions based on the eval swings
- [ ] Wire up `ExamplePositions`
- [ ] Flip board when loading a game as Black
- [ ] Wire up feature extraction
- [ ] Pass `extraction` and `legalMoves` to `CoachChat` and wire up `getExplanation`
- [ ] Suggest positions for insight (i.e. the move before the 12=-076543567890-1§ qa~mistake) when loading PGN
- [ ] Add loading spinner when fetching Chess.com games
- [ ] Clarify evaluation perspective (player vs engine) in coach insights
- [ ] Trigger coach insights on “Analyse” (with skeleton loader)

## Bugs & QA

- [ ] **BUG**: Mate evaluation swings still occur
- [ ] QA: Verify coach analysis accuracy
- [ ] QA: Verify coach chat behavior

## MVP Priorities

1. **Replay & Drills**
   - [ ] Scan games for difficult positions
   - [ ] Let user replay positions
   - [ ] Show WLWL stats
   - [ ] Allow manual pinning of positions
2. **Profile Page**
   - [ ] Display basic profile info
   - [ ] (PoC) Allow changing user
3. **Authentication** (optional)
   - [ ] Email/password (Gmail sign-up)
   - [ ] Link Chess.com via OAuth
   - [ ] Link Lichess via OAuth

## Future Ideas

- [ ] Support complex branching nodes in `useGameHistory` (display in MoveStepper)
- [ ] Custom coaches with graphics (e.g. “Russian Schoolboy, Danya,” “Hikaru,”, "Gotham", “Alien Gambit”)
- [ ] Custom instruction presets for coaches
- [ ] Curated content links by ELO/theme (YouTube: Dr. Can, Danya; Chessable)
- [ ] Credits page (Playtesters, Stockfish devs, etc.)

## Completed

- [x] Favicon
- [x] Install & configure React Router
- [x] Basic route structure
- [x] Wire up APIs
  - [x] Analyse Position (FEN)
  - [x] Analyse Game (PGN)
- [x] Fix “Failed to fetch games” on mobile
- [x] Handle 422 “No explanation returned”
- [x] Play moves on board and re-evaluate
- [x] Eval bar component (Stockfish integration)
- [x] Desktop view: side-by-side (board left, coach right)
- [x] Deploy frontend to Vercel
- [x] Link domain `blunderfixer.com`
- [x] Finish wiring up `useAnalysisEngine`
- [x] Wire up `useGameAnalysis` and verify
- [x] Fix promotion logic
- [x] Add missing hook for legal moves
- [x] Fix best-move arrow suggestion
- [x] Drop “orchestration” in favor of smaller components
- [x] Modify `useGameAnalysis` to initialize with SAN history
- [x] Support simple linear branching in `useGameAnalysis` (flag-controlled)
- [x] Overhaul PGN/FEN paste (`usePGNparser`)
- [x] Fix loading a recent game
- [x] **BUG**: Wild eval swings (normalization issue)
