
import React, { useState } from 'react';
import Button from '../components/Button';
import Card from '../components/Card';
import Icon from '../components/Icon';

interface LandingScreenProps {
  onCreateRoom: (playerName: string) => void;
  onJoinRoom: (roomId: string, playerName: string) => void;
}

const LandingScreen: React.FC<LandingScreenProps> = ({ onCreateRoom, onJoinRoom }) => {
  const [roomId, setRoomId] = useState('');
  const [playerName, setPlayerName] = useState('');

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (roomId.trim()) {
      onJoinRoom(roomId.trim(), playerName.trim());
    }
  };
  
  const handleCreate = () => {
    onCreateRoom(playerName.trim());
  };

  return (
    <div className="w-full max-w-md mx-auto text-center">
      <div className="flex justify-center items-center gap-3 mb-4">
        <Icon name="logo" className="w-12 h-12 text-orange-500" />
        <h1 className="text-5xl font-extrabold text-gray-800">Room Rumble</h1>
      </div>
      <p className="text-gray-500 mb-12 text-lg">The 10-Player Party Game. No Account Needed.</p>

      <div className="space-y-4">
        <input
          type="text"
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
          placeholder="Enter your nickname (optional)"
          className="w-full px-4 py-3 text-lg text-center bg-white/80 border-2 border-orange-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
        />
        <Button onClick={handleCreate}>
          Create New Game
        </Button>
      </div>

      <div className="my-6 flex items-center">
        <div className="flex-grow border-t border-gray-300"></div>
        <span className="flex-shrink mx-4 text-gray-500">or join an existing room</span>
        <div className="flex-grow border-t border-gray-300"></div>
      </div>

      <form onSubmit={handleJoin} className="space-y-4">
        <input
          type="text"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value.toUpperCase())}
          placeholder="ROOM ID"
          maxLength={6}
          className="w-full px-4 py-3 text-lg tracking-[0.5em] text-center bg-white border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
        />
        <Button type="submit" variant="secondary">
          Join Game
        </Button>
      </form>
      
      <div className="mt-16 text-gray-500 text-sm">
        <a href="#" className="hover:text-orange-500">About</a>
        <span className="mx-2">&middot;</span>
        <a href="#" className="hover:text-orange-500">How to Play</a>
      </div>
    </div>
  );
};

export default LandingScreen;
