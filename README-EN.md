> 中文版：[README.md](./README.md)

# Tic Tac Toe Game

A modern Tic Tac Toe game built with React + Vite.

## Features

- **Two Player Mode (PvP)** - Local two players take turns
- **vs AI Mode** - Battle against an intelligent AI using Minimax algorithm with Alpha-Beta pruning
- **Scoreboard** - Real-time tracking of X, O, and draw wins
- **Win Highlighting** - Highlights the winning line
- **Game Status** - Shows current player and game result

## Tech Stack

- React 19
- Vite 8
- CSS Modules

## Quick Start

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview
```

## Project Structure

```
src/
├── App.jsx          # Main application component
├── App.module.css   # Application styles
├── gameLogic.js    # Game logic and AI algorithm
├── index.css        # Global styles
└── main.jsx         # Entry point
```

## Game Rules

1. Players take turns placing marks, X goes first
2. The first to get three in a row, column, or diagonal wins
3. A draw occurs when the board is full with no winner
