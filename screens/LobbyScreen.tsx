import React, { useState } from 'react';
import { Room, Player } from '../types';
import Button from '../components/Button';
import Card from '../components/Card';
import Icon from '../components/Icon';
import Avatar from '../components/Avatar';

interface LobbyScreenProps {
  room: Room | undefined;
  onStartGame: () => void;
  onLeaveRoom: () => void;
  currentUser: Player | null;
}

const LobbyScreen: React.FC<LobbyScreenProps> = ({ room, onStartGame, onLeaveRoom, currentUser }) => {
  const [copied, setCopied] = useState(false);

  if (!room) {
    return <div>Loading room...</div>;
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(room.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isHost = currentUser?.id === room.hostId;

  return (
    <div className="w-full max-w-4xl mx-auto text-center">
      <div className="flex justify-between items-center mb-6">
         <div className="flex items-center gap-2 text-orange-500 font-bold">
            <Icon name="logo" className="w-6 h-6"/>
            <span>Game Lobby</span>
        </div>
        <Button onClick={onLeaveRoom} variant="danger" size="md" className="w-auto">Leave Room</Button>
      </div>

      <div className="mb-6">
        <p className="text-gray-500 mb-2">ROOM ID</p>
        <div 
            className="inline-flex items-center gap-4 bg-white border-2 border-orange-200 rounded-full px-6 py-3 cursor-pointer group"
            onClick={handleCopy}
        >
          <span className="text-3xl font-extrabold tracking-[0.2em] text-gray-700">{room.id}</span>
          <div className="relative">
            <Icon name="copy" className="w-7 h-7 text-orange-400 group-hover:text-orange-600 transition" />
            {copied && <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs rounded px-2 py-1">Copied!</span>}
          </div>
        </div>
      </div>

      <p className="text-gray-600 mb-4 font-bold text-lg">Players ({room.players.length}/{room.maxPlayers})</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {room.players.map((player, index) => (
          <Card key={player.id} className={`p-4 !shadow-md transition-all animate-fade-in-down ${player.id === currentUser?.id ? 'border-2 border-orange-400' : ''}`} style={{ animationDelay: `${index * 50}ms` }}>
            <div className="flex items-center gap-4">
              <Avatar name={player.name} />
              <div className="text-left">
                <p className="font-bold text-lg">{player.name} {player.id === currentUser?.id ? '(You)' : ''}</p>
                <p className="text-sm text-gray-500">{player.isHost ? 'Host' : 'Joined'}</p>
              </div>
            </div>
          </Card>
        ))}
        {Array.from({ length: room.maxPlayers - room.players.length }).map((_, i) => (
           <Card key={`empty-${i}`} className="p-4 !shadow-sm bg-gray-50">
             <div className="flex items-center gap-4 opacity-50">
               <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                 <Icon name="user" className="w-6 h-6 text-gray-400" />
               </div>
               <p className="text-gray-500">Waiting for player...</p>
             </div>
           </Card>
        ))}
      </div>
      
      {isHost ? (
        <>
          <Button onClick={onStartGame} disabled={room.players.length < 2} className="max-w-sm mx-auto disabled:opacity-50 disabled:cursor-not-allowed">
            Start Game
          </Button>
          <p className="mt-2 text-sm text-gray-500">{room.players.length < 2 ? 'Need at least 2 players to start.' : 'The game will begin when the host clicks \'Start Game\'.'}</p>
        </>
      ) : (
        <p className="text-gray-600">Waiting for the host to start the game...</p>
      )}

    </div>
  );
};

export default LobbyScreen;