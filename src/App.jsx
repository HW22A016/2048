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

      switch (e.key) {
        case 'ArrowUp':
          console.log('上キーが押されました');
          break;
        case 'ArrowDown':
          console.log('下キーが押されました');
          break;
        case 'ArrowLeft':
          console.log('左キーが押されました');
          break;
        case 'ArrowRight':
          console.log('右キーが押された');
          break;
        default:
          break;
      }
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
