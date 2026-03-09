import { useState, useEffect, useCallback } from 'react';
import { checkResult, findBestMove } from './gameLogic';
import styles from './App.module.css';

const INITIAL_BOARD = Array(9).fill(null);

export default function App() {
  const [board, setBoard] = useState(INITIAL_BOARD);
  const [isXNext, setIsXNext] = useState(true);
  const [mode, setMode] = useState('pvp');
  const [score, setScore] = useState({ X: 0, O: 0, draw: 0 });
  const [result, setResult] = useState({ winner: null, line: null, isDraw: false });

  const gameOver = result.winner || result.isDraw;

  useEffect(() => {
    setResult(checkResult(board));
  }, [board]);

  useEffect(() => {
    if (result.winner) {
      setScore((s) => ({ ...s, [result.winner]: s[result.winner] + 1 }));
    } else if (result.isDraw) {
      setScore((s) => ({ ...s, draw: s.draw + 1 }));
    }
  }, [result.winner, result.isDraw]);

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
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [mode, isXNext, board, gameOver]);

  const handleClick = useCallback((index) => {
    if (board[index] || gameOver) return;
    if (mode === 'ai' && !isXNext) return;
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

      <div className={`${styles.status} ${gameOver ? styles.gameOver : ''}`}>
        {statusText}
      </div>

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

      <button className={styles.restartBtn} onClick={handleRestart}>
        New Game
      </button>
    </div>
  );
}
