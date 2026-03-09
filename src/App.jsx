import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';
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
      }, 400);
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
    ? `WINNER: ${result.winner}`
    : result.isDraw
      ? `TIE GAME`
      : `TURN: ${isXNext ? 'X' : 'O'}`;

  return (
    <motion.div 
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      className={styles.container}
    >
      <div className={styles.header}>
        <h1 className={styles.title}>
          Tic<br/>Tac<br/>Toe
        </h1>
        <div className={styles.versionBadge}>v2.0</div>
      </div>

      <div className={styles.modeSelector}>
        <button
          className={clsx(styles.modeBtn, mode === 'pvp' && styles.active)}
          onClick={() => handleModeChange('pvp')}
        >
          PVP
        </button>
        <button
          className={clsx(styles.modeBtn, mode === 'ai' && styles.active)}
          onClick={() => handleModeChange('ai')}
        >
          VS AI
        </button>
      </div>

      <div className={clsx(styles.statusPanel, gameOver && styles.gameOver)}>
        {statusText}
      </div>

      <div className={styles.board}>
        {board.map((cell, i) => (
          <button
            key={i}
            className={clsx(
              styles.cell,
              cell === 'X' && styles.x,
              cell === 'O' && styles.o,
              result.line?.includes(i) && styles.winCell
            )}
            onClick={() => handleClick(i)}
            disabled={!!cell || gameOver}
          >
            <AnimatePresence>
              {cell && (
                <motion.span
                  initial={{ scale: 0, rotate: -45 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                >
                  {cell}
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        ))}
      </div>

      <div className={styles.scoreBoard}>
        <div className={clsx(styles.scoreItem, styles.x)}>
          <span className={styles.scoreLabel}>P1 (X)</span>
          <span className={styles.scoreValue}>{score.X}</span>
        </div>
        <div className={styles.scoreItem}>
          <span className={styles.scoreLabel}>DRAWS</span>
          <span className={styles.scoreValue}>{score.draw}</span>
        </div>
        <div className={clsx(styles.scoreItem, styles.o)}>
          <span className={styles.scoreLabel}>{mode === 'ai' ? 'AI (O)' : 'P2 (O)'}</span>
          <span className={styles.scoreValue}>{score.O}</span>
        </div>
      </div>

      <button className={styles.restartBtn} onClick={handleRestart}>
        REBOOT SYSTEM
      </button>
    </motion.div>
  );
}