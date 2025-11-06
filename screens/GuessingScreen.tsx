import React, { useState, useEffect, useRef } from 'react';
import { GameState, Player } from '../types';
import Button from '../components/Button';
import Card from '../components/Card';
import Icon from '../components/Icon';
import Avatar from '../components/Avatar';

interface GuessingScreenProps {
  gameState: GameState;
  currentUser: Player | null;
  onGuess: (guess: string) => void;
  onLeaveRoom: () => void;
}

const GuessingScreen: React.FC<GuessingScreenProps> = ({ gameState, currentUser, onGuess, onLeaveRoom }) => {
  const [guess, setGuess] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);
  
  const { room } = gameState;
  const roundData = room?.roundData;
  const writer = room?.players.find(p => p.id === roundData?.writerId);

  const [timeLeft, setTimeLeft] = useState(roundData?.timeLimit || 0);

  useEffect(() => {
    if (roundData?.startTime) {
      const updateTimer = () => {
        const elapsed = (Date.now() - roundData.startTime) / 1000;
        const remaining = Math.max(0, Math.round(roundData.timeLimit - elapsed));
        setTimeLeft(remaining);
      };
      updateTimer();
      const interval = setInterval(updateTimer, 1000);
      return () => clearInterval(interval);
    }
  }, [roundData?.startTime, roundData?.timeLimit]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [roundData?.guesses]);

  if (!room || !roundData || !currentUser || !writer) {
    return <div>Waiting for writer to choose a word...</div>;
  }
  
  const handleGuessSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (guess.trim()) {
      onGuess(guess.trim());
      setGuess('');
    }
  };
  
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const hasGuessedCorrectly = roundData.guesses.some(g => g.playerId === currentUser.id && g.isCorrect);

  return (
    <div className="w-full max-w-7xl mx-auto">
      <header className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2 text-gray-500 font-bold">
            <Icon name="logo" className="w-6 h-6 text-orange-400"/>
            <span>Room ID: {room.id}</span>
        </div>
        <Button onClick={onLeaveRoom} variant="danger" size="md" className="w-auto">Leave Game</Button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Game Area */}
        <main className="lg:col-span-2">
            <Card className="flex flex-col items-center justify-center text-center h-full min-h-[300px] md:min-h-[400px]">
                <h1 className="text-3xl font-bold text-gray-600 mb-4">Guess the Word!</h1>
                <div className="flex items-center gap-2 text-2xl font-bold text-red-500 mb-6">
                    <Icon name="clock" className="w-8 h-8"/>
                    <span>{minutes}:{seconds.toString().padStart(2, '0')}</span>
                </div>
                <div className="text-5xl md:text-6xl font-extrabold tracking-[0.2em] text-gray-800 mb-4 bg-orange-100 px-4 py-2 rounded-lg flex flex-wrap justify-center">
                  {(roundData.wordPattern || 'P___E').split('').map((char, index) => (
                      <span
                          key={index}
                          className="animate-letter-reveal"
                          style={{ animationDelay: `${index * 40}ms` }}
                      >
                          {char === ' ' ? '\u00A0' : char}
                      </span>
                  ))}
                </div>
                <div className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full">
                    Hint: {roundData.hint || "It's a type of fruit"}
                </div>
            </Card>
        </main>

        {/* Side Panel */}
        <aside className="flex flex-col gap-6">
          <Card>
            <h3 className="font-bold text-xl mb-3">Players ({room.players.length}/{room.maxPlayers})</h3>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {room.players.map(player => (
                <div key={player.id} className="flex items-center justify-between bg-orange-50/50 p-2 rounded-lg">
                    <div className="flex items-center gap-2">
                        <Icon name="user" className="w-5 h-5 text-gray-400"/>
                        <span>{player.name} {player.id === writer.id ? '(Writer)' : ''}</span>
                    </div>
                    <span className="font-bold text-orange-500">{player.score} pts</span>
                </div>
              ))}
            </div>
          </Card>
          <Card className="flex-grow flex flex-col">
             <h3 className="font-bold text-xl mb-3">Chat & Guesses</h3>
             <div className="flex-grow bg-gray-100 rounded-lg p-3 space-y-3 overflow-y-auto min-h-[200px]">
                <p className="text-center text-sm text-gray-400 italic">A new round is starting.</p>
                {roundData.guesses.map((g, i) => (
                   <div key={i} className={`flex items-start gap-2 ${g.playerId === currentUser.id ? 'flex-row-reverse' : ''}`}>
                      <Avatar name={g.playerName} className="w-8 h-8 text-sm shrink-0"/>
                      <div className={`p-2 rounded-lg max-w-xs ${g.isCorrect ? 'bg-green-200 text-green-800' : (g.playerId === currentUser.id ? 'bg-orange-400 text-white' : 'bg-white')}`}>
                          <p>{g.guess}</p>
                      </div>
                   </div>
                ))}
                {roundData.guesses.filter(g => g.isCorrect).map((g, i) => (
                    <p key={`correct-${i}`} className="text-center text-sm text-green-600 font-bold animate-pop-in">Player '{g.playerName}' guessed correctly!</p>
                ))}
                <div ref={chatEndRef} />
             </div>
             <form onSubmit={handleGuessSubmit} className="mt-3 flex gap-2">
                <input 
                    type="text"
                    value={guess}
                    onChange={e => setGuess(e.target.value)}
                    placeholder={hasGuessedCorrectly ? "You guessed it!" : "Type your guess here..."}
                    className="w-full px-4 py-2 bg-white border-2 border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
                    disabled={hasGuessedCorrectly}
                />
                <button type="submit" disabled={hasGuessedCorrectly} className="bg-orange-500 text-white rounded-full p-2.5 hover:bg-orange-600 transition disabled:opacity-50">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.428A1 1 0 009.894 15V4.106A1 1 0 0010.894 2.553z" />
                    </svg>
                </button>
             </form>
          </Card>
        </aside>
      </div>
    </div>
  );
};

export default GuessingScreen;