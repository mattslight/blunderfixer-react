# TODO

[ ] Ability to actually play the drill
[ ] Load new games and drills when logging in
[ ] Load games from DB
[ ] Win / loss stats for the drill
[ ] Mark drill as 'don't show me this again'
[x] Remove the red / green bar on the drills
[x] Make range slider full width on mobile
[x] All / Opening / Middle / Endgame make easier to tap on mobile

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
- [ ] **Tag Position Metadata:**  
       As a user, I want each extracted position tagged with phase and theme (e.g. “fork tactic in middlegame”).
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
- [ ] **Immediate Feedback:**  
       As a user, I want to submit my move and immediately see engine feedback.
- [ ] **Drill Status Management:**  
       As a user, I want to mark drills as “mastered” or “retry later” to drive spaced repetition.

---

## Epic 6 (Bonus): Spaced-Repetition Engine

**Goal:** Schedule drills intelligently, à la Woodpecker / Pump Up Your Rating.

**Backend User Stories:**

- [ ] **Follow-Up Scheduling:**  
       As the system, I want to schedule follow-up drills for positions I’ve failed multiple times, with increasing intervals.
- [ ] **Mastered Drill De-Prioritization:**  
       As the system, I want to lower priority on drills I’ve “mastered” to focus on weaknesses.
