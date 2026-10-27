import { useState } from 'react';

export default function Game() {
  // 保存每一步棋,用于回溯历史.
  // 其中每个元素均为一个数组，数组索引表示位置，值表示棋子'X', 'O'
  const [history, setHistory] = useState([Array(9).fill('')]);

  const [xNext, setXNext] = useState(true);
  const [currentMove, setCurrentMove] = useState(0);

  const currentSquares = history[history.length - 1];

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = 'Go to move #' + move;
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

  function handlePlay(nextSquares) {
    setHistory([...history, nextSquares]);
    setXNext(!xNext);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
    setXNext(nextMove % 2 == 0);
  }
}

function Board({ squares, xNext, onPlay }) {
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
