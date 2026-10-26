import { useState } from 'react';

export default function Board() {
  const [xNext, setXNext] = useState(true);
  const [squares, setSquares] = useState(Array(9).fill(''));

  const winner = calculateWinner(squares);

  return (
    <>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div>

      <Status winner={winner} nextTurn={xNext ? 'X' : 'O'} />
    </>
  );

  function handleClick(i) {
    if (squares[i] !== '') {
      return;
    }

    if (calculateWinner(squares)) {
      /* 如果已经有棋子胜出，那么不再继续游戏 */
      return;
    }

    const nextSquares = squares.slice();
    if (xNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }

    setSquares(nextSquares);
    setXNext(!xNext);
  }
}

function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Status({ winner, nextTurn }) {
  const hasWinner = winner === 'X' || winner === 'O';

  const winnerMarkup = <span>Winner is: {winner} !!</span>;
  const nextTurnMarkup = <span>Next turn: {nextTurn}</span>;

  return <>{hasWinner ? winnerMarkup : nextTurnMarkup}</>;
}

function calculateWinner(squares) {
  /* 所有满足胜利的八种情况，以数组索引表示 */
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  /* 检查是否满足条件 */
  for (const [a, b, c] of lines) {
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      /* 返回胜利的棋子 */
      return squares[a];
    }
  }

  /* 当前没有胜出的棋子 */
  return null;
}
