# BlunderFixer TODO

## In Progress

- [ ] _BUG_: if stockfish analysis is ongoing (e.g. depth = 40) then move arrows don't update, so I guess stockfish evals are overlapping, we need to kill the previous analysis before starting a new one

- [ ] _FIX_: Show eval bar next to board on report "Stack" card
- [ ] _FIX_: Show players & clock next to board

- [ ] _CHORE_: BACKEND - Remove old coach_chat and explain_lines endpoints
- [ ] _CHORE_: View error boundary - clearly not working!
- [ ] _BUG_: Mate evaluation swings still occur
- [ ] _FIX_: Reset (board position and chat) not working

## Backlog

- [ ] **FEAT**: Hide lines / best move
- [ ] **FEAT**: When swiping best move show changing arrow on board
- [ ] **FEAT**: Coach or engine to play a move / reply
- [ ] **FEAT**: If coach mentions a move show on the board
- [ ] **UX**: Move graph and table summary to Analysis page (what's the UX)
- [ ] Clarify evaluation perspective (player vs engine) in coach insights

1. **Replay & Drills**

   _READ Pump up your rating and Woodpecker Method Axel Smith_

   - [ ] Scan games for difficult positions
   - [ ] Let user replay positions
   - [ ] Show WLWL stats
   - [ ] Allow manual pinning of positions

2. **Authentication** (optional)
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
- [x] **FEAT**: Scroll coach chat separately from board on desktop
- [x] _BUG_: Fix chart(s) - particularly burndown - right margin/padding on iPhone
- [x] **FEAT**: Time burndown chart for both players
- [x] **FEAT**: Find the critical positions based on the eval swings
- [x] Suggest positions for insight (i.e. the move before the 12=-076543567890-1§ qa~mistake) when loading PGN
- [x] _FIX_: Wire up hint button
- [x] _FIX_: When I click Discuss with Coach load in the position to the LLM flow
- [x] _FIX_: Fix issue where full analysis is needed to give good advice
- [x] _FIX_: when clicking Discuss with Coach go to the correct move on analysis board
- [x] _FIX_: Flip board when loading a game as Black

2. **Profile Page**
   - [x] Display basic profile info
   - [x] (PoC) Allow changing user
