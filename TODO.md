# TODO

- Prioritised

  [ ] FEAT: Detect which formats (Biltz, Rapid, Bullet, Daily) I care about when I log in (allow me to change in preferences) (consider using ToggleSwitch). Only show EloDisplay options for chosen preferences.
  [ ] FEAT: Wire up stats on home screen

- Backlog
  [ ] Load new games and drills when logging in
  [ ] Load games from DB
  [ ] Ask coach for hint on drill
  [ ] Move a drill to analysis mode (if I fail dig into why I failed, better understanding)
  [ ] Tag drills with theme (e.g. “fork tactic in middlegame”).

[x] FEAT: Show ELO on home screen and delta since last login (detect which Rapid/Blitz to show and allow to tap to change)
[x] FEAT: When showing next drills show three different games
[x] QA: Check order of drills
[x] FIX: Debug why click on Analyze in recent games does nothing
[x] Homepage of my stats, recent games, recommended drills
[x] BUG: Issue with status rapidly change and recording multiple histories
[x] Back to drill list
[x] recent drills remove from sidebar and find a better way to display Drill History
[x] Ability to see recently drilled
[x] check codex/propose-ux-for-recent-drills-feature to make sure only recent drills are shown (check api)
[x] tidy up formatting of RecentDrillRow
[x] Mark drill as 'don't show me this again'
[x] Once drill is completed, next drill
[x] Play variable moves (not always best move) when useBotPlayer in drills is used so that it's not about memorising the same sequence of moves
[x] When fetching drills, adjust API to hide 'mastered' drills (drills where the most recent 5 history is 5 passed in a row) or drills that I mark manually with "don't show me again" (archived/hidden flag in DB)

[x] Exclude completed drills
[x] Save Win / loss stats for the drill
[x] Show win/loss stats on drill page
[x] Show win/loss stats on drill list

[x] Drills (exclude wins toggle switch)
[x] Show back button on drills to list
[x] Filter drills on backend (win/loss, eval_swing, phase)
[x] Reset drill to start
[x] Make drill filters useSticky
[x] Remove the red / green bar on the drills
[x] Make range slider full width on mobile
[x] All / Opening / Middle / Endgame make easier to tap on mobile
[x] Ability to actually play the drill - /drills/{id} should load the FEN for the position into a board and use the hooks to capture gameplay against stockfish (need to consider from the /analyse page which hooks are needed, how do we make a play vs stockfish hook)

## Epic 2: Player-Profile Aggregation

**Goal:** Compute per-player metrics summarizing strengths, weaknesses, and play style.

**Backend User Stories:**

- [ ] **Win/Loss/Draw Counts:**  
       As a user, I want my overall win/loss/draw counts (by time control) so I can gauge where I perform best.
- [ ] **Average Centipawn Loss (ACPL):**  
       As a user, I want my ACPL by phase (opening/mid/end) so I can identify where I’m most imprecise.
- [ ] **Missed Tactics Count:**  
       As a user, I want counts of missed tactics (blunders ≥1.0 CP drop) so I can see my biggest tactical leaks.
- [ ] **Opening Performance:**  
       As a user, I want my most-played and worst-performing openings (by ECO code) so I know where to focus.

---

## Epic 3: Drill-Position Extraction

**Goal:** Surface the most instructive moments from a user’s games for targeted practice.

**Backend User Stories:**

- [x] **Flag Critical Positions:**  
       As a user, I want the system to flag “critical positions” where evaluation swung ≥1.0 pawn or where I lost a won position, classified by tactic vs positional vs time.
- [x] **Tag Position Metadata:**  
       As a user, I want each extracted position tagged with phase
- [x] **Prioritize Drills:**  
       As a user, I want a score for each drill indicating urgency (e.g. frequency of that mistake × CP drop).

---

## Epic 4: Player-Profile UI

**Goal:** Present aggregated stats in a clear, actionable dashboard.

**Frontend User Stories:**

- [ ] **Summary Cards:**  
       As a user, I want a summary card showing key metrics (win rate, ACPL, blunder rate).
- [ ] **Interactive Charts:**  
       As a user, I want interactive charts (bar chart for openings, pie for time controls).
- [ ] **Filter Controls:**  
       As a user, I want filter controls (by date range, time control) so I can slice my data.

---

## Epic 5: Drill-Training UI

**Goal:** Let users practice extracted positions in a coach-style drill.

**Frontend User Stories:**

- [x] **Drill Queue Navigation:**  
       As a user, I want a drill queue where I step through each critical position on a chessboard.
- [x] **Immediate Feedback:**  
       As a user, I want to submit my move and immediately see engine feedback.
- [x] **Drill Status Management:**  
       As a user, I want to mark drills as “mastered” or “retry later” to drive spaced repetition.

---

## Epic 6 (Bonus): Spaced-Repetition Engine

**Goal:** Schedule drills intelligently, à la Woodpecker / Pump Up Your Rating.

**Backend User Stories:**

- [ ] **Follow-Up Scheduling:**  
       As the system, I want to schedule follow-up drills for positions I’ve failed multiple times, with increasing intervals.
- [x] **Mastered Drill De-Prioritization:**  
       As the system, I want to lower priority on drills I’ve “mastered” to focus on weaknesses.
