import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';

// Replace with your Railway backend URL:
const socket = io('rock-paper-scissors-production-8316.up.railway.app');

export default function App() {
  const [room, setRoom] = useState('');
  const [username, setUsername] = useState('');
  const [inRoom, setInRoom] = useState(false);
  const [result, setResult] = useState('');

  const joinRoom = () => {
    if (room.trim() && username.trim()) {
      socket.emit('join', { room, username });
      setInRoom(true);
    } else {
      alert('Please enter your name and a room ID');
    }
  };

  const playMove = (move) => {
    socket.emit('move', { room, move, username });
  };

  useEffect(() => {
    socket.on('result', (data) => {
      setResult(
        `${data.player1Name} (${data.move1}) vs ${data.player2Name} (${data.move2}) → ${data.result}`
      );
    });

    // Clean up the listener on unmount
    return () => {
      socket.off('result');
    };
  }, []);

  return (
    <div style={{ textAlign: 'center', marginTop: '3rem', fontFamily: 'Arial, sans-serif' }}>
      <h1>Rock Paper Scissors</h1>

      {!inRoom ? (
        <div style={{ marginBottom: '1rem' }}>
          <input
            type="text"
            placeholder="Your Name"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{ marginRight: '0.5rem', padding: '0.5rem' }}
          />
          <input
            type="text"
            placeholder="Room ID"
            value={room}
            onChange={(e) => setRoom(e.target.value)}
            style={{ marginRight: '0.5rem', padding: '0.5rem' }}
          />
          <button onClick={joinRoom} style={{ padding: '0.5rem 1rem' }}>
            Join
          </button>
        </div>
      ) : (
        <>
          <h2>Room: {room}</h2>
          <div>
            <button onClick={() => playMove('rock')} style={{ marginRight: '1rem', padding: '1rem' }}>
              Rock
            </button>
            <button onClick={() => playMove('paper')} style={{ marginRight: '1rem', padding: '1rem' }}>
              Paper
            </button>
            <button onClick={() => playMove('scissors')} style={{ padding: '1rem' }}>
              Scissors
            </button>
          </div>
          <h3 style={{ marginTop: '2rem' }}>{result}</h3>
        </>
      )}
    </div>
  );
}
