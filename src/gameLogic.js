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
