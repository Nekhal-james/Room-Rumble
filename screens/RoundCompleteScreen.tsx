import React, { useState, useEffect } from 'react';
import { Room, Player } from '../types';
import Card from '../components/Card';
import Avatar from '../components/Avatar';
import { ROUND_END_DELAY_MS } from '../constants';
import AnimatedNumber from '../components/AnimatedNumber';

interface RoundCompleteScreenProps {
  room: Room | undefined;
  onNextRound: () => void;
  currentUser: Player | null;
}

const RoundCompleteScreen: React.FC<RoundCompleteScreenProps> = ({ room, onNextRound, currentUser }) => {
  const [countdown, setCountdown] = useState(Math.round(ROUND_END_DELAY_MS / 1000));
  
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  if (!room || !room.roundData) {
    return <div>Loading results...</div>;
  }

  const { roundData } = room;
  const winner = room.players.find(p => p.id === roundData.winnerId);
  
  const sortedResults = [...roundData.results].sort((a, b) => b.scoreGained - a.scoreGained);

  return (
    <div className="w-full max-w-lg mx-auto text-center">
      <Card>
        <h2 className="text-4xl font-extrabold text-gray-800">Round Complete!</h2>
        <p className="text-gray-500 mt-2 mb-6">The word was:</p>
        <p className="text-6xl font-extrabold text-orange-500 tracking-widest mb-8">{roundData.word.toUpperCase()}</p>
        
        {winner && (
          <div className="bg-yellow-100 border border-yellow-200 rounded-xl p-4 mb-8">
            <p className="text-yellow-800 font-bold">WINNER!</p>
            <div className="flex items-center justify-center gap-3 mt-2">
              <Avatar name={winner.name} />
              <p className="text-xl font-bold">{winner.name}</p>
            </div>
            <p className="text-sm text-yellow-700 mt-1">Guessed it first!</p>
          </div>
        )}

        <h3 className="font-bold text-xl mb-3 text-left">Round Scores</h3>
        <div className="space-y-2">
          {sortedResults.map(result => {
            const player = room.players.find(p => p.id === result.playerId);
            if (!player) return null;
            const oldTotal = player.score - result.scoreGained;
            return (
              <div key={player.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                <div className="flex items-center gap-3">
                  <Avatar name={player.name} />
                  <span className="font-bold">{player.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-bold text-green-500">
                    +<AnimatedNumber value={result.scoreGained} /> pts
                  </span>
                  <span className="text-gray-500 w-24 text-right">
                    <AnimatedNumber value={player.score} startValue={oldTotal} /> pts
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
      <div className="mt-6 text-center">
          <button
              onClick={onNextRound}
              className="px-6 py-3 bg-orange-500 text-white font-bold rounded-xl shadow-lg hover:bg-orange-600 transition-all transform active:scale-95"
          >
              Start Next Round
          </button>
          <p className="mt-2 text-sm text-gray-500">
              Next round starts automatically in {countdown}s...
          </p>
      </div>
    </div>
  );
};

export default RoundCompleteScreen;
