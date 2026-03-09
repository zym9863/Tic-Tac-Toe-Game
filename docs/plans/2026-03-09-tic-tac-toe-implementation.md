# Tic-Tac-Toe Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a Tic-Tac-Toe game with two-player and AI modes using React + Vite.

**Architecture:** Single-component approach with App as root, containing ModeSelector, Board (9 squares), StatusBar, and ScoreBoard. State managed via useState. AI uses Minimax with Alpha-Beta pruning.

**Tech Stack:** React 19, Vite, CSS Modules

---

### Task 1: Project Scaffolding

**Files:**
- Create: Vite project structure via CLI
- Modify: `package.json` (cleanup)
- Delete: default boilerplate files

**Step 1: Create Vite React project**

Run:
```bash
cd "d:/github/Tic Tac Toe Game"
npm create vite@latest . -- --template react
```

If prompted about non-empty directory, proceed (only has docs/ and .git/).

**Step 2: Install dependencies**

Run:
```bash
npm install
```

**Step 3: Clean boilerplate**

- Delete `src/App.css`, `src/index.css` contents (will rewrite)
- Replace `src/App.jsx` with empty component shell
- Clean up `index.html` title to "Tic Tac Toe"

**Step 4: Verify dev server starts**

Run:
```bash
npm run dev
```
Expected: Dev server starts, blank page loads without errors.

**Step 5: Commit**

```bash
git add -A
git commit -m "chore: scaffold Vite React project"
```

---

### Task 2: Game Logic Utilities

**Files:**
- Create: `src/gameLogic.js`

**Step 1: Write game logic module**

```js
// src/gameLogic.js

// All 8 winning line combinations
const WINNING_LINES = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
  [0, 4, 8], [2, 4, 6],             // diagonals
];

// Returns { winner: 'X'|'O'|null, line: number[]|null, isDraw: boolean }
export function checkResult(board) {
  for (const line of WINNING_LINES) {
    const [a, b, c] = line;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { winner: board[a], line, isDraw: false };
    }
  }
  const isDraw = board.every((cell) => cell !== null);
  return { winner: null, line: null, isDraw };
}

// Minimax with Alpha-Beta pruning, returns best move index
export function findBestMove(board, aiPlayer = 'O') {
  const humanPlayer = aiPlayer === 'O' ? 'X' : 'O';

  function minimax(currentBoard, depth, isMaximizing, alpha, beta) {
    const result = checkResult(currentBoard);
    if (result.winner === aiPlayer) return 10 - depth;
    if (result.winner === humanPlayer) return depth - 10;
    if (result.isDraw) return 0;

    if (isMaximizing) {
      let maxEval = -Infinity;
      for (let i = 0; i < 9; i++) {
        if (currentBoard[i] === null) {
          currentBoard[i] = aiPlayer;
          const eval_ = minimax(currentBoard, depth + 1, false, alpha, beta);
          currentBoard[i] = null;
          maxEval = Math.max(maxEval, eval_);
          alpha = Math.max(alpha, eval_);
          if (beta <= alpha) break;
        }
      }
      return maxEval;
    } else {
      let minEval = Infinity;
      for (let i = 0; i < 9; i++) {
        if (currentBoard[i] === null) {
          currentBoard[i] = humanPlayer;
          const eval_ = minimax(currentBoard, depth + 1, true, alpha, beta);
          currentBoard[i] = null;
          minEval = Math.min(minEval, eval_);
          beta = Math.min(beta, eval_);
          if (beta <= alpha) break;
        }
      }
      return minEval;
    }
  }

  let bestScore = -Infinity;
  let bestMove = -1;
  const boardCopy = [...board];

  for (let i = 0; i < 9; i++) {
    if (boardCopy[i] === null) {
      boardCopy[i] = aiPlayer;
      const score = minimax(boardCopy, 0, false, -Infinity, Infinity);
      boardCopy[i] = null;
      if (score > bestScore) {
        bestScore = score;
        bestMove = i;
      }
    }
  }
  return bestMove;
}
```

**Step 2: Commit**

```bash
git add src/gameLogic.js
git commit -m "feat: add game logic with win detection and minimax AI"
```

---

### Task 3: App Component — Core Game State

**Files:**
- Modify: `src/App.jsx`

**Step 1: Write App component with full game state and logic**

```jsx
import { useState, useEffect, useCallback } from 'react';
import { checkResult, findBestMove } from './gameLogic';
import styles from './App.module.css';

const INITIAL_BOARD = Array(9).fill(null);

export default function App() {
  const [board, setBoard] = useState(INITIAL_BOARD);
  const [isXNext, setIsXNext] = useState(true);
  const [mode, setMode] = useState('pvp'); // 'pvp' | 'ai'
  const [score, setScore] = useState({ X: 0, O: 0, draw: 0 });
  const [result, setResult] = useState({ winner: null, line: null, isDraw: false });

  const gameOver = result.winner || result.isDraw;

  // Check result after each move
  useEffect(() => {
    setResult(checkResult(board));
  }, [board]);

  // Update score when game ends
  useEffect(() => {
    if (result.winner) {
      setScore((s) => ({ ...s, [result.winner]: s[result.winner] + 1 }));
    } else if (result.isDraw) {
      setScore((s) => ({ ...s, draw: s.draw + 1 }));
    }
  }, [result.winner, result.isDraw]);

  // AI move
  useEffect(() => {
    if (mode === 'ai' && !isXNext && !gameOver) {
      const timer = setTimeout(() => {
        const move = findBestMove(board);
        if (move !== -1) {
          const newBoard = [...board];
          newBoard[move] = 'O';
          setBoard(newBoard);
          setIsXNext(true);
        }
      }, 300); // slight delay for UX
      return () => clearTimeout(timer);
    }
  }, [mode, isXNext, board, gameOver]);

  const handleClick = useCallback((index) => {
    if (board[index] || gameOver) return;
    if (mode === 'ai' && !isXNext) return; // block clicks during AI turn
    const newBoard = [...board];
    newBoard[index] = isXNext ? 'X' : 'O';
    setBoard(newBoard);
    setIsXNext(!isXNext);
  }, [board, isXNext, mode, gameOver]);

  const handleRestart = () => {
    setBoard(INITIAL_BOARD);
    setIsXNext(true);
    setResult({ winner: null, line: null, isDraw: false });
  };

  const handleModeChange = (newMode) => {
    setMode(newMode);
    setBoard(INITIAL_BOARD);
    setIsXNext(true);
    setResult({ winner: null, line: null, isDraw: false });
    setScore({ X: 0, O: 0, draw: 0 });
  };

  const statusText = result.winner
    ? `${result.winner} wins!`
    : result.isDraw
      ? `It's a draw!`
      : `Next: ${isXNext ? 'X' : 'O'}`;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Tic Tac Toe</h1>

      {/* Mode Selector */}
      <div className={styles.modeSelector}>
        <button
          className={`${styles.modeBtn} ${mode === 'pvp' ? styles.active : ''}`}
          onClick={() => handleModeChange('pvp')}
        >
          Two Players
        </button>
        <button
          className={`${styles.modeBtn} ${mode === 'ai' ? styles.active : ''}`}
          onClick={() => handleModeChange('ai')}
        >
          vs AI
        </button>
      </div>

      {/* Status */}
      <div className={`${styles.status} ${gameOver ? styles.gameOver : ''}`}>
        {statusText}
      </div>

      {/* Board */}
      <div className={styles.board}>
        {board.map((cell, i) => (
          <button
            key={i}
            className={`${styles.cell} ${cell ? styles.filled : ''} ${
              result.line?.includes(i) ? styles.winCell : ''
            } ${cell === 'X' ? styles.x : cell === 'O' ? styles.o : ''}`}
            onClick={() => handleClick(i)}
            disabled={!!cell || gameOver}
          >
            {cell}
          </button>
        ))}
      </div>

      {/* Score Board */}
      <div className={styles.scoreBoard}>
        <div className={`${styles.scoreItem} ${styles.x}`}>
          <span className={styles.scoreLabel}>X</span>
          <span className={styles.scoreValue}>{score.X}</span>
        </div>
        <div className={styles.scoreItem}>
          <span className={styles.scoreLabel}>Draw</span>
          <span className={styles.scoreValue}>{score.draw}</span>
        </div>
        <div className={`${styles.scoreItem} ${styles.o}`}>
          <span className={styles.scoreLabel}>O</span>
          <span className={styles.scoreValue}>{score.O}</span>
        </div>
      </div>

      {/* Restart Button */}
      <button className={styles.restartBtn} onClick={handleRestart}>
        New Game
      </button>
    </div>
  );
}
```

**Step 2: Commit**

```bash
git add src/App.jsx
git commit -m "feat: add App component with game state, AI integration, and UI"
```

---

### Task 4: Styling — Modern Polished UI

**Files:**
- Create: `src/App.module.css`
- Modify: `src/index.css`

**Step 1: Write global styles (index.css)**

Reset + gradient background + font.

**Step 2: Write App.module.css**

Full styling covering:
- `.container` — centered card layout with glass-morphism
- `.title` — gradient text
- `.modeSelector` / `.modeBtn` — pill-shaped toggle buttons
- `.status` — current turn / winner display with animation
- `.board` — 3x3 CSS grid
- `.cell` — square buttons with hover effects, placement animation (`@keyframes popIn`)
- `.winCell` — highlight winning cells with glow
- `.x` / `.o` — distinct colors for X (blue) and O (rose)
- `.scoreBoard` — horizontal score display
- `.restartBtn` — gradient restart button
- Responsive: media query for smaller screens

**Step 3: Verify visually**

Run: `npm run dev`
Expected: Polished game renders, all interactions work, animations play.

**Step 4: Commit**

```bash
git add src/App.module.css src/index.css
git commit -m "feat: add modern polished UI styling with animations"
```

---

### Task 5: Polish and Cleanup

**Files:**
- Modify: `index.html` (title)
- Delete: unused boilerplate (`src/assets/`, etc.)

**Step 1: Set page title to "Tic Tac Toe"**

**Step 2: Remove unused files**

Delete `src/assets/react.svg`, `public/vite.svg` if present.

**Step 3: Verify build**

Run:
```bash
npm run build
```
Expected: Build succeeds, no warnings.

**Step 4: Final commit**

```bash
git add -A
git commit -m "chore: cleanup boilerplate and finalize project"
```

---

### Task 6: Manual Testing & Visual Verification

**Step 1: Start dev server and verify all features**

Run: `npm run dev`, open in browser.

Checklist:
- [ ] Two-player mode: X and O alternate correctly
- [ ] Win detection works for all 8 lines
- [ ] Draw detection works
- [ ] Winning cells highlight
- [ ] Score increments correctly
- [ ] New Game resets board but keeps score
- [ ] Mode switch resets everything
- [ ] AI mode: AI plays as O, makes smart moves
- [ ] AI cannot be beaten
- [ ] Responsive layout on narrow viewport
- [ ] Animations play smoothly

**Step 2: Fix any issues found, commit**
