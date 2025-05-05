# Todo

[✔] Finish wiring up at useAnalysisEngine
[✔] Wire up useGameAnalysis and check working as expected
[✔] Fix promotion logic
[✔] Add missing hook for legal moves
[✔] Fix best move arrow suggestion logic

[✔] Fix 'orchestration' useGameAnalysis seems to be fubar - do we completely drop this in favour of smaller managable components?
[✔] Modify useGameAnalysis to load up a SAN moveHistory to initalise
[✔] Support simple linear branching (rewrite current history from earlier move) on useGameAnalysis (enable / disable with a flag)
[✔] Fix PGN / FEN Paste (usePGNparser needs an overhaul, what are we going to do?)
[✔] Fix loading a recent game
[ ] Flip board, especially when loading in a game where I am black
[ ] Wire back up feature extraction
[ ] Pass extraction, legalMoves to CoachChat and wire back up get explanation

QA
[✔] Debug wild eval swings (normalisation doesn't appear to be working)
[ ] Debug mate Eval swings (swings still occur when it's mate)
[ ] Check coach analysis
[ ] Check coach chat

# Next

[ ] Support complex branching nodes in useGameHistory (how to display in MoveStepper)

## Phase 1 (MVP Setup)

- [✔] Fav icon
- [✔] Install and configure React Router
- [✔] Set up basic route structure
- [✔] Wire up APIs:

  - [✔] Analyse Position (FEN)
  - [✔] Analyse Game (PGN)

    - [✔] BUG Failed to fetch games on mobile
    - [✔] Get Coach Explanation -> 422 -> No explanation returned
    - [✔] Play moves on the board and re-eval
    - [✔] Eval bar component, so need to eval game with stockfish
    - [~] Desktop view can be side by side, board left, coach right

    - [ ] When loading PGN Suggest which positions to give insight on (before a mistake)
    - [ ] Loading spinner when fetching chess.com games
    - [ ] When sending move analysis to coach insights make it clear from which perspective the evals are from when considering best move
    - [ ] when hitting analyse also get coach insights (show skeleton loader?)

- [ ] FEAT - Replay positions, scan my games, find difficult positions and let me replay them, show WLWL stats, for a title LLM can choose, manually select / pin a position
- [ ] Wire up Profile Page
  - [ ] Display basic profile info
  - [ ] (Optional for PoC) Allow changing user
- [✔] Deploy frontend to Vercel
- [✔] Link domain name `blunderfixer.com`

## Phase 2 (Enhancements)

- [ ] Implement Authentication (optional)

  - [ ] Gmail Sign-up Simple email/password?
  - [ ] Link Chess.com account via OAuth?
  - [ ] Link Lichess account via OAuth?

## Future Ideas

[ ] Custom coaches, with custom coach graphic (Danya gives Russian Schoolboy, Hikaru, Alien Gabmit, Gotham)
[ ] Custom instructions
[ ] Links to curated content by ELO, theme etc. (YouTube – Dr Can, Danya, Chessable)
[ ] Credits page (Playtesters, Stockfish devs...)
