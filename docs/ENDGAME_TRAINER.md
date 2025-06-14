# Feature Epic: Endgame Trainer

## Overview

The **Endgame Trainer** lets players practice critical theoretical endings.
Users pick a scenario and play it out against the computer, repeating lines
until the technique feels automatic.

---

## User Stories

- **ET-US1**: As a user, I want to browse a list of common endgames so I can focus on specific patterns.
- **ET-US2**: As a user, I want the engine to defend correctly so I learn proper conversion or drawing methods.
- **ET-US3**: As a user, I want to reset the position after each attempt to drill it multiple times.
- **ET-US4**: As a user, I want quick tips on the key motifs so I can recall them during practice.

## Flow

1. Navigate to **Training → Endgame Trainer**.
2. Choose an ending from the list (e.g. Lucena, Philidor, basic mates).
3. The board loads with the selected position and Stockfish plays the defensive side.
4. The player tries to convert or hold the draw following best practice.
5. After completion, show success/failure and offer to retry.

## Tasks

### Front-End

1. Add a new route `/endgames` and menu entries in the sidebar and mobile navigation.
2. Implement an `EndgameTrainer` page listing the available positions.
3. Provide reset functionality and short instructional notes for each ending.

### Back-End

1. No server changes required initially; positions can be stored client side.
2. Optionally record results for progress tracking in the future.
