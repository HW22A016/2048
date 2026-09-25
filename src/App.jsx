import { useState, useEffect } from 'react';
import heroImg from './assets/hero.png'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import './App.css';

function App() {
  const [board, setBoard] = useState(() => createBoard());

  // 第二引数を[]にすることで一回だけ実行
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key))
      {
        return; 
      }

      // 標準の動きをキャンセル
      e.preventDefault();

      setBoard((currentBoard) => {
        let newBoard = handleMove(currentBoard, e.key);

        if(JSON.stringify(currentBoard) !== JSON.stringify(newBoard))
        {
          newBoard = spanNum(newBoard);
          return newBoard;
        }

        return currentBoard;
      });
    };
    window.addEventListener('keydown', handleKeyDown);

    // クリーンアップ関数　ページの切り替わりやアプリの終了時に自動で実行
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  function createBoard()
  {
    let board = Array(5).fill(null).map(() => Array(5).fill(0));
    for(let i = 0; i < 2; i++)
    {
      board = spanNum(board);
    }
    return board;
  }

  function spanNum(board)
  {
    while(true)
    {
      const row = Math.floor(Math.random() * board.length);
      const col = Math.floor(Math.random() * board[0].length);

      if(board[row][col] !== 0)
      {
        continue;
      }

      board[row][col] = 2;
      break;
    }

    return board
  }

  function handleMove(currentBoard, direction)
  {
    // boardのコピー作成
    let newBoard = currentBoard.map(row => [...row]);

    switch (direction) {
      case 'ArrowUp':
        console.log('上キーが押されました');
        break;
      case 'ArrowDown':
        console.log('下キーが押されました');
        break;
      case 'ArrowLeft':
        newBoard = moveLeft(newBoard);
        break;
      case 'ArrowRight':
        console.log('右キーが押された');
        break;
      default:
        break;
    }
    return newBoard;
  }

  function moveLeft(board)
  {
    return board.map(row => slideLeftRow(row));
  }

  function slideLeftRow(row)
  {
    // 0以外が配列に格納される
    let numbers = row.filter(cell => cell !== 0);

    // ここで数字が同じなら合体
    for(let i = 0; i < numbers.length - 1; i++)
    {
      if(numbers[i] === numbers[i + 1])
      {
        numbers[i] *= 2;
        numbers[i + 1] = 0;
        i++;
      }
    }

    // 合体させた分の0を詰める
    numbers = numbers.filter(cell => cell !== 0);

    // 足りない長さを埋める
    while(numbers.length < row.length)
    {
      numbers.push(0);
    }

    return numbers;
  }

  function rotateBoard(currentBoard)
  {
    const size = currentBoard.length;
    let newBoard = Array(size).fill(null).map(() => Array(size).fill(0));
    for(let r = 0; r < size; r++)
    {
      for(let c = 0; c < size; c++)
      {
        newBoard[c][size - 1 - r] = currentBoard[r][c];
      }
    }
    return newBoard;
  }


  return (
    <div>
      <h1>2048</h1>
      
      <div className='board'>
        {board.map((row, rowIndex) =>
          row.map((cell, colIndex) =>
            <p
              key={`${rowIndex}-${colIndex}`}
              className='square'>
                {cell !== 0  && cell}</p>
          )
        )}
      </div>
    </div>
      )
}

export default App
