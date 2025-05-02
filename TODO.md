# Todo

## Phase 1 (MVP Setup)

- [✔] Fav icon
- [✔] Install and configure React Router
- [✔] Set up basic route structure
- [✔] Wire up APIs:
  - [✔] Analyse Position (FEN)
  - [✔] Analyse Game (PGN)
    - [✔] BUG Failed to fetch games on mobile
    - [✔] Get Coach Explanation -> 422 -> No explanation returned
    - [ ] Desktop view can be side by side, board left, coach right
    - [ ] Play moves on the board and re-eval
    - [ ] Eval bar component, so need to eval game with stockfish
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
