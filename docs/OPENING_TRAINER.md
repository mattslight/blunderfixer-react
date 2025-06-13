# Feature Epic: Opening Trainer

## Overview

The Opening Trainer lets players drill specific opening lines.
Users choose a repertoire line and play from the starting position
while the computer follows the selected moves. Once the training
sequence ends, Stockfish takes over for normal play.

---

## User Stories

- **OT-US1**: As a user, I want to select an ECO code or search by opening
  name so I can focus on my repertoire.
- **OT-US2**: As a user, I want the engine to follow a predefined line for
  several moves so I can practice memorization.
- **OT-US3**: As a user, I want to play from either side and repeat the line
  until I feel confident.
- **OT-US4**: As a user, I want feedback after each attempt (success or
  deviation) so I know if I stayed on track.

## Flow

1. Navigate to **Training → Opening Trainer**.
2. Search or browse openings (ECO table with common names).
3. Choose a line and side (White/Black).
4. The board loads from the initial position and automatically plays the
   selected moves for the opponent.
5. If the player deviates, show the correct reply and offer to retry from
   that point.
6. After the scripted line ends, the engine switches to normal Stockfish
   play so the user can continue practicing.

## Tasks

### Front-End

1. Add a new route `/openings` and navigation entry.
2. Implement `OpeningSelector` component to filter by ECO code and name.
3. Implement `useOpeningTrainer` hook that feeds scripted moves to the board
   and falls back to Stockfish after the sequence.
4. Display success/failure feedback and a "Restart Line" button.

### Back-End

1. Expose an endpoint `GET /api/openings` returning lines by ECO code.
2. Allow uploading or editing custom repertoires (optional).
3. Record training results so we can track progress over time.

