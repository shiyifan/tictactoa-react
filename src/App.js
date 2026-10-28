import { useState } from 'react';

export default function Game() {
  // 棋盘的历史状态. 可用于回溯
  // 其中每个元素均为一个数组，数组索引表示位置，值表示棋子'X', 'O'
  const [history, setHistory] = useState([Array(9).fill('')]);

  /* 当前棋盘的步骤，初始步骤(0)或者下完一步棋子后的棋盘步骤(1, 2, 3...) */
  const [currentMove, setCurrentMove] = useState(0);

  const xNext = currentMove % 2 === 0; // 偶数步骤时，下'X'棋子，奇数时下'O'

  const currentSquares = history[currentMove];

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = `#${move} move(${move % 2 !== 0 ? 'X' : 'O'})`;
    } else {
      description = 'Go to start';
    }

    return (
      <li key={move}>
        {description}
        <button onClick={() => jumpTo(move)}>Jump</button>
      </li>
    );
  });

  return (
    <>
      <div className="game">
        <div className="game-board">
          <Board xNext={xNext} squares={currentSquares} onPlay={handlePlay} />
        </div>
        <div className="game-info">
          <ol>{moves}</ol>
        </div>
      </div>
    </>
  );

  /* nextSquares: 新棋子下了之后的棋盘 */
  function handlePlay(nextSquares) {
    /* 每次调用该函数时，已下了一个棋子 */

    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }
}

function Board({ squares, xNext, onPlay }) {
  const winner = calculateWinner(squares);
  const rows = [];

  for (let i = 0; i < 3; i++) {
    rows.push(<Row squares={squares} indexStart={i * 3} onRowClick={handleClick} key={i} />);
  }

  return (
    <>
      {rows}
      <Status winner={winner} nextTurn={xNext ? 'X' : 'O'} />
    </>
  );

  function handleClick(i) {
    if (squares[i] !== '') {
      /* 点击位置上已经存在棋子 */
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

    onPlay(nextSquares);
  }
}

function Row({ squares, indexStart, onRowClick }) {
  let rowSquares = [];
  for (let i = 0; i < 3; i++) {
    const sqIndex = indexStart + i;
    rowSquares.push(<Square value={squares[sqIndex]} onSquareClick={() => onRowClick(sqIndex)} key={i} />);
  }

  return <div className="board-row">{rowSquares}</div>;
}

/* 棋盘上的一个格子 */
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
