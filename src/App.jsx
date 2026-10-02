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

      // some()はいずれかの要素が条件に合致しているか判定
      if(board.some((tile) => tile.row === row && tile.col === col && tile.value !== 0))
      {
        continue;
      }

      board = board.map(tile =>
        tile.row === row && tile.col === col
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
        newBoard = moveUD(newBoard, "up");
        break;
      case 'ArrowDown':
        newBoard = moveUD(newBoard, "down");
        break;
      case 'ArrowLeft':
        newBoard = moveLR(newBoard, "left");
        break;
      case 'ArrowRight':
        newBoard = moveLR(newBoard, "right");
        break;
      default:
        break;
    }
    return newBoard;
  }

  function moveLR(board, str)
  {
    const len = Math.sqrt(board.length);
    for(let row = 0; row < len; row++)
    {
      for(let i = 0; i < len; i++)
      {
        for(let col = 0; col < len - 1; col++)
        {
          const currentTile = board.find(tile => tile.row === row && tile.col === col);
          const nextTile = board.find(tile => tile.row === row && tile.col === col + 1);

          if(!currentTile || !nextTile)
          {
            console.log(`undifindが発生:${currentTile}, ${nextTile}`)
          }
          // 両方0なら何もしない
          if(currentTile === 0 && nextTile === 0)
          {
            continue;
          }

          switch(str)
          {
            case "left":
              // 左が0で右が数字なら左に詰める
              if(currentTile.value === 0 && nextTile.value !== 0)
              {
                currentTile.col++;
                nextTile.col--;
              }
              // 左と右が同じ値なら左に詰めて足す
              else if(currentTile.value === nextTile.value && currentTile.value !== 0)
              {
                currentTile.value *= 0;
                currentTile.col++;

                nextTile.col--;
                nextTile.value *= 2;
              }
              break;
              
            case "right":
              // 左が数字で右が0なら右に詰める
              if(currentTile.value !== 0 && nextTile.value === 0)
              {
                currentTile.col++;
                nextTile.col--;
              }
              // 左と右が同じ値なら右に詰めて足す
              else if(currentTile.value === nextTile.value && currentTile.value !== 0)
              {
                currentTile.col++;
                nextTile.col--;
                currentTile.value *= 2;
                nextTile.value *= 0;
              }
              break;
          }
        }
      }
    }
    return board;
  }

  function moveUD(board, str)
  {
    const len = Math.sqrt(board.length);
    for(let col = 0; col < len; col++)
    {
      for(let i = 0; i < len; i++)
      {
        for(let row = 0; row < len - 1; row++)
        {
          const currentTile = board.find(tile => tile.row === row && tile.col === col);
          const nextTile = board.find(tile => tile.row === row + 1 && tile.col === col);

          if(!currentTile || !nextTile)
          {
            console.log(currentTile, nextTile);
            continue;
          }
          else
          { 
            console.log(currentTile, nextTile);
          }
          // 両方0なら何もしない
          if(currentTile.value === 0 && nextTile.value === 0)
          {
            continue;
          }

          switch(str)
          {
            case "up":
              // 上が0で下が数字なら上に詰める
              if(currentTile.value === 0 && nextTile.value !== 0)
              {
                currentTile.row++;
                nextTile.row--;
              }
              // 両方同じ数字なら上に詰めて足す
              else if(currentTile.value === nextTile.value)
              {
                currentTile.row++;
                nextTile.row--;
                currentTile.value *= 0;
                nextTile.value *= 2;
              }          
              break;
            case "down":
              // 上が数字で下が0なら下に詰める
              if(currentTile.value !== 0 && nextTile.value === 0)
              {
                currentTile.row++;
                nextTile.row--;
              }
              else if(currentTile.value === nextTile.value)
              {
                currentTile.row++;
                nextTile.row--;
                currentTile.value *= 2;
                nextTile.value *= 0;
              }
              break;
          }
        }
      }
    }
    return board;
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
