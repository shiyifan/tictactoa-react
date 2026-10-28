import { useState } from 'react';
import cn from 'classnames';

export default function Game() {
  // 棋盘的历史状态. 可用于回溯
  // 其中每个元素均为一个数组，数组索引表示位置，值表示棋子'X', 'O'
  const [history, setHistory] = useState([Array(9).fill(null)]);

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
          <Board xNext={xNext} squares={currentSquares} onPlay={handlePlay} currentMove={currentMove} />
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

function Board({ squares, xNext, onPlay, currentMove }) {
  const winner = calculateWinner(squares);
  const rows = [];
  const isDraw = !winner && currentMove === 9;

  for (let i = 0; i < 3; i++) {
    rows.push(<Row squares={squares} indexStart={i * 3} onRowClick={handleClick} key={i} />);
  }

  return (
    <>
      {rows}
      <Status winner={winner} nextTurn={xNext ? 'X' : 'O'} isDraw={isDraw} />
    </>
  );

  function handleClick(i) {
    if (squares[i] != null) {
      /* 点击位置上已经存在棋子 */
      return;
    }

    const winner = calculateWinner(squares);
    if (winner) {
      /* 如果已经有棋子胜出，那么不再继续游戏 */
      return;
    }

    const nextSquares = squares.map(s => s?.copy());
    if (xNext) {
      nextSquares[i] = new Piece('X');
    } else {
      nextSquares[i] = new Piece('O');
    }

    onPlay(nextSquares);
  }
}

function Row({ squares, indexStart, onRowClick }) {
  let rowSquares = [];
  for (let i = 0; i < 3; i++) {
    const sqIndex = indexStart + i;
    rowSquares.push(<Square piece={squares[sqIndex]} onSquareClick={() => onRowClick(sqIndex)} key={i} />);
  }

  return <div className="board-row">{rowSquares}</div>;
}

/* 棋盘上的一个格子 */
function Square({ piece, onSquareClick }) {
  return (
    <button className={cn('square', piece?.highlighted && 'highlight')} onClick={onSquareClick}>
      {piece?.value}
    </button>
  );
}

function Status({ winner, nextTurn, isDraw }) {
  const hasWinner = winner === 'X' || winner === 'O';

  const winnerMarkup = <span>Winner is: {winner} !!</span>;
  const nextTurnMarkup = <span>Next turn: {nextTurn}</span>;
  const drawMarkup = <span>Draw, ^.^</span>;

  return (hasWinner && winnerMarkup) || (isDraw && drawMarkup) || nextTurnMarkup;
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
    const allSet = squares[a] && squares[b] && squares[c];
    if (allSet) {
      const allSame = squares[a].value === squares[b].value && squares[a].value === squares[c].value;
      if (allSet && allSame) {
        /* 返回胜利的棋子以及棋子的位置 */
        squares[a].highlighted = true;
        squares[b].highlighted = true;
        squares[c].highlighted = true;
        return squares[a].value;
      }
    }
  }

  /* 当前没有胜出的棋子 */
  return null;
}

/* 棋子 */
class Piece {
  value = '';
  hightlighted = false;

  constructor(value, highlighted) {
    this.value = value;
    this.hightlighted = highlighted ?? false;
  }

  copy() {
    return new Piece(this.value, this.hightlighted);
  }
}
