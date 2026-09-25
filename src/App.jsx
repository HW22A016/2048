// 次やること
// spanNumとmoveLeftをidでvalueを見てるがアニメーションをさせたかったらrowとcolを変更しないとだめなのでvalueでは無くrowとcolを変更するようにしろ


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
          newBoard = spanNum(5, newBoard);
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
    const len = 5;
    let board = fillTiles(len);
    for(let i = 0; i < 2; i++)
    {
      board = spanNum(len, board);
    }
    return board;
  }

  function fillTiles(len)
  {
    let id = 1;
    let tiles = [];
    for(let i = 0; i < len; i++)
    {
      for(let j = 0; j < len; j++)
      {
        tiles.push({id: id, value: 0, row: i, col: j});
        id++;
      }
    }
    return tiles;
  }

  function spanNum(len, board)
  {
    while(true)
    {
      const row = Math.floor(Math.random() * len);
      const col = Math.floor(Math.random() * len);

      const id = row * len + col + 1;

      // some()はいずれかの要素が条件に合致しているか判定
      if(board.some((tile) => tile.id === id && tile.value !== 0))
      {
        continue;
      }

      board = board.map(tile =>
        tile.id === id
          ? {...tile, value: 2}
          : tile
      )

      return board;
    }
  }

  function handleMove(currentBoard, direction)
  {
    // boardのコピー作成 ()がreturnと同じ意味
    let newBoard = currentBoard.map(tile => ({...tile}));

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
    const len = Math.sqrt(board.length);
    for(let row = 0; row < len; row++)
    {
      for(let col = 0; col < len - 1; col++)
      {
        const id = row * len + col + 1;
        const currentTile = board.find(tile => tile.id === id);
        const nextTile = board.find(tile => tile.id === id + 1);

        // 左が0で右が数字なら左に詰める
        if(currentTile.value === 0 && nextTile.value !== 0)
        {
          board.map(tile => {
            if(tile.id === currentTile.id)
            {
              tile.value = nextTile.value;
            }
            else if(tile.id === nextTile.id)
            {
              tile.value = 0;
            }
          })
        }
        // 左と右が同じ値なら左に詰めて足す
        else if(currentTile.value === nextTile.value)
        {
          board.map(tile => {
            if(tile.id === currentTile.id)
            {
              tile.value *= 2;
            }
            else if(tile.id === nextTile.id)
            {
              tile.value = 0;
            }
          })
        }
      }
    }

    return board;
    // return board.map(tile => slideLeftRow(tile));
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
        {Array(25).fill(null).map((_, index) =>(
          <p
            key={index}
            className="square"/>
        ))}

        {board.filter(tile => tile.value !== 0).map(tile =>
            <p
              key={tile.id}
              className='tile' style={{ backgroundColor: tile.value !== 0 ? '#FFF' : '#f4a225', transform: `translate(${tile.col * 50}px, ${tile.row * 50}px)`}}>
                {tile.value}</p>
          )
        }
      </div>
    </div>
      )
}

export default App
