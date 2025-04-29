# Todo

## Phase 1 (MVP Setup)

- [ ] Fav icon
- [✔] Install and configure React Router
- [✔] Set up basic route structure
- [✔] Wire up APIs:
  - [✔] Analyse Position (FEN)
  - [✔] Analyse Game (PGN)
    - [ ] BUG Failed to fetch games on mobile
    - [ ] Eval bar component, so need to eval game with stockfish
    - [ ] Identify which positions to give insight (before a mistake)
    - [ ] Loading spinner when fetching chess.com games
    - [ ] When sending move analysis to coach insights make it clear from which perspective the evals are from when considering best move
    - [ ] when hitting analyse also get coach insights (show skeleton loader?)
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
