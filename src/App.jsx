import { useState, useEffect } from 'react';
import heroImg from './assets/hero.png'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import './App.css';
import { useSwipeable } from 'react-swipeable';

function App() {
  const boardSize = 5;
  const [newTilePosition, setNewtTilePosition] = useState(null);
  const [board, setBoard] = useState(() => createBoard());
  const [score, setScore] = useState(0);
  const [resetFlag, setResetFlag] = useState(false);
  const [speed, setSpeed] = useState(0.2);
  const [isMoving, setIsMoving] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isGameClear, setIsGameClear] = useState(false);

  const [highScore, setHighScore] = useState(() => getLocalStorageData("2048"));

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => updateBoard('ArrowLeft'),
    onSwipedRight: () => updateBoard('ArrowRight'),
    onSwipedUp: () => updateBoard('ArrowUp'),
    onSwipedDown: () => updateBoard('ArrowDown'),
    delta: 5,  //スワイプが開始する前の最小距離(px)
    preventScrollOnSwipe: true, //スワイプ中のスクロールを防ぐ
    trackTouch: true,  //タッチ入力をトラックする
    trackMouse: true, //マウス入力をトラックする
  });

  // 第二引数を[]にすることで一回だけ実行
  useEffect(() => {    
    window.addEventListener('keyup', handleKeyUp);

    // クリーンアップ関数　ページの切り替わりやアプリの終了時に自動で実行
    return () => {
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [isGameClear, isGameOver, isMoving, resetFlag]);

  useEffect(() => {
    setScore(() => getScore())

    // クリア時の処理
    if(judgeGameClear(board, 2048))
    {
      setIsGameClear(true);
      setLocalStorageData("2048");
    }
    setIsGameOver(judgeGameOver(board));
    
    // 最初の2が二つだけの場面ならクールタイムを無くす
    if(board.reduce((sum, tile) => sum + tile.value, 0) === 4)
    {
      return;
    }
    setIsMoving(true);
    const timer = setTimeout(() =>
    {
      setIsMoving(false);
    }, speed * 1000);
    return () => clearTimeout(timer);
  }, [board]);

  function getLocalStorageData(key)
  {
    const localData = localStorage.getItem(key);
    return localData ? JSON.parse(localData) : 0;
  }

  function setLocalStorageData(key)
  {
    const newScore = getScore();
    const maxScore = highScore < newScore ? newScore : maxScore;
    localStorage.setItem(key, JSON.stringify(maxScore));
    setHighScore(maxScore);
    console.log(`${maxScore}がlocalStorageに保存されました。`);
  }

  function createBoard()
  {
    let board = fillTiles(boardSize);
    for(let i = 0; i < 2; i++)
    {
      board = spanNum(boardSize, board).board;
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
      return {
        board: board,
        newTilePosition: {row: row, col: col}
      }
    }
  }

  function handleKeyUp(e)
  {
    if(isGameClear || isGameOver || isMoving)
    {
      return;
    }
    if (!['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key))
    {
      return;
    }

    // 標準の動きをキャンセル
    e.preventDefault();

    updateBoard(e.key);
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
    const len = boardSize;
    for(let row = 0; row < len; row++)
    {
      for(let i = 0; i < len; i++)
      {
        for(let col = 0; col < len - 1; col++)
        {
          const currentTile = board.find(tile => tile.row === row && tile.col === col);
          const nextTile = board.find(tile => tile.row === row && tile.col === col + 1);

          // 両方0なら何もしない
          if(currentTile.value === 0 && nextTile.value === 0)
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
                currentTile.col++;
                nextTile.col--;
                currentTile.value *= 0;
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
    const len = boardSize;
    for(let col = 0; col < len; col++)
    {
      for(let i = 0; i < len; i++)
      {
        for(let row = 0; row < len - 1; row++)
        {
          const currentTile = board.find(tile => tile.row === row && tile.col === col);
          const nextTile = board.find(tile => tile.row === row + 1 && tile.col === col);

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

  function updateBoard(direction)
  {
    let newBoard = handleMove(board, direction);
    
    // 盤面の比較
    if(JSON.stringify(board) === JSON.stringify(newBoard))
    {
      return;
    }
    const tmp = spanNum(5, newBoard);
    newBoard = tmp.board
    setBoard(newBoard);
    setNewtTilePosition(tmp.newTilePosition);
  }

  function judgeGameClear(board, score)
  {
    return board.some(tile => tile.value === score);
  }

  function judgeGameOver(board)
  {
    const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
    const len = boardSize;
    for(let row = 0; row < len; row++)
    {
      for(let col = 0; col < len; col++)
      {
        for(const [rowOffset, colOffset] of directions)
        {
          const nextRow = row + rowOffset;
          const nextCol = col + colOffset;
          if(nextRow < 0 || len - 1 < nextRow || nextCol < 0 || len - 1 < nextCol)
          {
            continue;
          }

          const currentTile = board.find(tile => tile.row === row && tile.col === col);
          const nextTile = board.find(tile => tile.row === nextRow && tile.col === nextCol);
          if(currentTile.value === 0 || nextTile.value === 0)
          {
            return false;
          }
          if(currentTile.value === nextTile.value && currentTile.value !== 0)
          {
            return false;
          }
        }
      }
    }
    return true;
  }

  function getScore()
  {
    return board.filter(tile => tile.value !== 2).reduce((sum, tile) => sum + tile.value, 0);
  }

  return (
    <div>
      <h1>2048</h1>
      <div>
        <span className='textColor'>speed: </span>
        <input
          type="number"
          value={speed}
          onChange={(e) => setSpeed(Number(e.target.value))}
          onKeyUp={(e) => e.stopPropagation()}
        />
      </div>
      
      <div className='textColor'>
        <p>high score: {highScore}</p>
        <p>score: {score}</p>
      </div>
      <div className='board' {...swipeHandlers}>
        {Array(25).fill(null).map((_, index) =>(
          <p
            key={index}
            className="square"/>
        ))}

        {board.filter(tile => tile.value !== 0).map(tile =>
            <p
              key={tile.id}
              className='tile' style={{ backgroundColor: tile.row === newTilePosition?.row && tile.col === newTilePosition?.col ? '#0F0' : tile.value !== 0 ? '#FFF' : '#f4a225', transform: `translate(${tile.col * 50}px, ${tile.row * 50}px)`, transition: `transform ${speed}s ease`}}>
                {tile.value}</p>
          )
        }
      </div>

      <div>
        <button
          onClick={() => {
            setBoard(createBoard());
            setScore(0);
            setIsMoving(false);
            setNewtTilePosition(null);
            setResetFlag(!resetFlag);
          }}>
          リセット
        </button>
      </div>

      {isGameClear && (
        <div>
          <h1 style={{color: '#0F0'}}>GameClear</h1>
        </div>
      )}

      {isGameOver && (
        <div>
          <h1 style={{color: '#F00'}}>GAMEOVER</h1>
        </div>
      )}
    </div>
      )
}

export default App