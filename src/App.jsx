import { useState, useEffect } from 'react';
import io from 'socket.io-client';

// Connect to the backend server
const socket = io('https://rock-paper-scissors-production-8316.up.railway.app/');

function App() {
  const [room, setRoom] = useState('');
  const [inRoom, setInRoom] = useState(false);
  const [result, setResult] = useState('');

  const joinRoom = () => {
    if (room) {
      socket.emit('join', room);
      setInRoom(true);
    }
  };

  const playMove = (move) => {
    socket.emit('move', { room, move });
  };

  useEffect(() => {
    socket.on('result', (data) => {
      console.log(data);
      setResult(
        `P1: ${data.move1}, P2: ${data.move2} → ${data.result}`
      );
    });

    return () => {
      socket.off('result');
    };
  }, []);

  return (
    <div style={{ textAlign: 'center' }}>
      <h1>Rock Paper Scissors</h1>

      {!inRoom ? (
        <div>
          <input
            value={room}
            onChange={(e) => setRoom(e.target.value)}
            placeholder="Room ID"
          />
          <button onClick={joinRoom}>Join</button>
        </div>
      ) : (
        <div>
          <h2>Room: {room}</h2>
          <button onClick={() => playMove('rock')}>Rock</button>
          <button onClick={() => playMove('paper')}>Paper</button>
          <button onClick={() => playMove('scissors')}>Scissors</button>
        </div>
      )}

      <h3>{result}</h3>
    </div>
  );
}

export default App;
