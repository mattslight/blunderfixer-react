# BlunderFixer TODO

## In Progress

- [ ] _BUG_: View error boundary - clearly not working!
- [ ] _BUG_: if stockfish analysis is ongoing (e.g. depth = 40) then move arrows don't update, so I guess stockfish evals are overlapping, we need to kill the previous analysis before starting a new one
- [ ] _BUG_: Mate evaluation swings still occur
- [ ] _FIX_: Load in recent game position into board
- [ ] _FIX_: Fix issue where full analysis is needed to give good advice
- [ ] _FIX_: Wire up hint button
- [ ] _FIX_: Reset (board position and chat) not working
- [ ] **FEAT**: Hide lines / best move
- [ ] **FEAT**: When stepping best move show button on board
- [ ] **FEAT**: Scroll coach chat separately from board on desktop
- [ ] **FEAT**: Find the critical positions based on the eval swings
- [ ] **FEAT**: Coach or engine to play a move / reply
- [ ] **FEAT**: If coach mentions a move show on the board
- [ ] **UX**: Move graph and table summary to Analysis page (what's the UX)
- [ ] Wire up `ExamplePositions`
- [ ] Flip board when loading a game as Black
- [ ] Suggest positions for insight (i.e. the move before the 12=-076543567890-1§ qa~mistake) when loading PGN
- [ ] Clarify evaluation perspective (player vs engine) in coach insights

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
- [x] Sort out GameStoreDebug (what's the UX)
- [x] Save 'shallow' game analysis so they don't re-run
- [x] Remember user's handle (option to change)
- [x] Show which games are synced
- [x] Wire up feature extraction
- [x] Pass `extraction` and `legalMoves` to `CoachChat` and wire up `getExplanation`
- [x] Add loading spinner when fetching Chess.com games
- [x] Better way to set username on first load
- [x] Go back on setting (useNavigate)
- [x] On game list when clicking analyse show progress spinner
- [x] On prod fix 500 error loading /analyse-pgn (check Render.com deploy etc.)
- [x] Link Chess.com
- [x] QA: Verify coach analysis accuracy
- [x] QA: Verify coach chat behavior
- [x] **FEAT**: Chat, press enter to ask!
- [x] **FEAT**: Empty state for coach chat?
