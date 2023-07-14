import './css/App.css';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
// import useClipboard from "react-use-clipboard";
import { useState, useEffect } from 'react';

function App({ xIsNext, squares, onPlay, reset, jumpTo }) {

  const startListening = () => SpeechRecognition.startListening({ continuous: true, language: 'en-IN' });
  const { interimTranscript, browserSupportsSpeechRecognition, resetTranscript } = useSpeechRecognition();

  const winner = calculateWinner(squares);

  function handleClick(i) {
    if (squares[i] || winner) {
      return;
    }

    const nextSquares = squares.slice();
    nextSquares[i] = xIsNext ? 'X' : 'O';
    onPlay(nextSquares);
  }

  const handleReset = () => {
    reset();
  };

  useEffect(() => {
    if (!browserSupportsSpeechRecognition) {
      return;
    }

    const command = interimTranscript.toLowerCase();
    if (command === "") resetTranscript();
    else if (["1", "one", "box 1", "box1", "box one"].includes(command)) handleClick(0);
    else if (["2", "two", "box 2", "box2", "box two", "box to"].includes(command)) handleClick(1);
    else if (["3", "three", "box 3", "box3", "box three", "box tree"].includes(command)) handleClick(2);
    else if (["4", "four", "box 4", "box4", "box four", "box for"].includes(command)) handleClick(3);
    else if (["5", "five", "box 5", "box5", "box five"].includes(command)) handleClick(4);
    else if (["6", "six", "box 6", "box6", "box six"].includes(command)) handleClick(5);
    else if (["7", "seven", "box 7", "box7", "box seven"].includes(command)) handleClick(6);
    else if (["8", "eight", "box 8", "box8", "box eight"].includes(command)) handleClick(7);
    else if (["9", "nine", "box 9", "box9", "box nine"].includes(command)) handleClick(8);
    else if (["reset"].includes(command)) handleReset();
    else if (["go to game start", "go to start", "go to gangster"].includes(command)) jumpTo(0);
    else if (["go to move 1", "move 1", "go to move one", "go to mobile", "go to move on", "go to mohan"].includes(command)) jumpTo(1);
    else if (["go to move 2", "move 2", "go to move two", "go to move to", "go to moto", "go to motu"].includes(command)) jumpTo(2);
    else if (["go to move 3", "move 3", "go to move three"].includes(command)) jumpTo(3);
    else if (["go to move 4", "move 4", "go to move four", "go to move for"].includes(command)) jumpTo(4);
    else if (["go to move 5", "move 5", "go to move five", "go to move file"].includes(command)) jumpTo(5);
    else if (["go to move 6", "move 6", "go to move six"].includes(command)) jumpTo(6);
    else if (["go to move 7", "move 7", "go to move seven"].includes(command)) jumpTo(7);
    else if (["go to move 8", "move 8", "go to move eight", "go to move at"].includes(command)) jumpTo(8);
    else if (["go to move 9", "move 9", "go to move nine"].includes(command)) jumpTo(9);
    else if (["stoplistening", "stop listening"].includes(command)) SpeechRecognition.stopListening();

  }, [interimTranscript, browserSupportsSpeechRecognition]);

  return (
    <>
      <span className="title">Tic-Tac-Toe</span>
      <div className="play-area">
        <div className="grid-layout">
          {squares.map((value, i) => (
            <Box
              num={i+1}
              key={i}
              value={value}
              onSquareClick={() => handleClick(i)}
              highlight={winner && winner.includes(i, 1)}
            />
          ))}
        </div>

        {Array.from([1, 2, 3, 4, 5, 6]).map((value) => (
          <Line id={value} key={value} show={winner && winner[0] === (value)} />
        ))}

        {Array.from([7, 8]).map((value) => (
          <div
            key={value}
            className={`crossfill ${winner && winner[0] === value ? 'zindex' : ''}`}
          >
            <Line id={value} key={value} show={winner && winner[0] === value} />
          </div>
        ))}
      </div>
      <div className="status">
        {winner ? 'Player ' : 'Turn: Player - '}&nbsp;
        <span className='player'>{winner ? (xIsNext ? 'O' : 'X') : (xIsNext ? 'X' : 'O')}&nbsp;</span>
        {winner ? 'Won the game' : ''}
      </div>
      <button onClick={handleReset} className="reset-btn">
        Reset
      </button>
      <button className="reset-btn" onClick={startListening}>Start Listening</button>
      <button className="reset-btn" onClick={SpeechRecognition.stopListening}>Stop Listening</button>
      {/* <span className="status">{interimTranscript}</span> */}
    </>
  );
}

function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((squares, move) => {
    const description = move > 0 ? `Go to move ${move}` : 'Go to game start';
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  const resetGame = () => {
    setCurrentMove(0);
    setHistory([Array(9).fill(null)]);
  };

  return (
    <div className="main">
      <div className="container">
        <App
          xIsNext={xIsNext}
          squares={currentSquares}
          onPlay={handlePlay}
          reset={resetGame}
          jumpTo={jumpTo}
        />
      </div>
      <div className="game-info">
        <span>History</span>
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

export default Game;

function Box({ num, value, onSquareClick, highlight }) {
  const boxStyle = {
    color: highlight ? 'red' : value ? 'black' : 'gray',
  };

  return (
    <div className="box box_hover" onClick={onSquareClick} style={boxStyle}>
      {value ? value : num}
    </div>
  );
}

function Line({ id, show }) {
  const lineStyle = {
    display: show ? 'block' : 'none',
  };

  return (
    <div className="line" id={`line-${id}`} style={lineStyle}></div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [1, 0, 1, 2],
    [2, 3, 4, 5],
    [3, 6, 7, 8],
    [4, 0, 3, 6],
    [5, 1, 4, 7],
    [6, 2, 5, 8],
    [7, 0, 4, 8],
    [8, 2, 4, 6]
  ];
  for (const line of lines) {
    const [l, a, b, c] = line;
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return [l, a, b, c];
    }
  }
  return null;
}
