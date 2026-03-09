# Tic-Tac-Toe Game Design

## Tech Stack

- React 19 + Vite
- CSS Modules for styling
- No external dependencies

## Architecture

Single-component approach: `App` → `ModeSelector` + `Board` (9 squares) + `StatusBar` + `ScoreBoard`

State managed with `useState`.

## Core Features

1. **Two-player mode**: X and O take turns
2. **AI mode**: Minimax with Alpha-Beta pruning, player is X, AI is O
3. **Win detection**: rows, columns, diagonals, draw detection
4. **Score tracking**: X wins / O wins / draws
5. **Restart**: reset current game, keep scores
6. **Mode switch**: toggle between two-player and AI mode, resets board and scores

## UI Design

- Modern style: gradient background, rounded cards, smooth animations
- Piece placement animation (scale + fade in)
- Winning line highlight
- Responsive layout, mobile friendly
- Hover feedback

## Data Flow

```
User clicks square → update board → check winner →
  if AI mode and AI's turn → Minimax computes best move → update board → check winner
```
