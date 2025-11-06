import React from 'react';
import { Room, Player } from '../types';
import Button from '../components/Button';
import Card from '../components/Card';
import Icon from '../components/Icon';
import AnimatedNumber from '../components/AnimatedNumber';

interface GameOverScreenProps {
  room: Room | undefined;
  onPlayAgain: () => void;
  onReturnHome: () => void;
  currentUser: Player | null;
}

const podiumClasses = [
    { rank: 1, height: 'h-40', color: 'bg-yellow-400', textColor: 'text-yellow-800', medal: 'trophy', iconClass: 'w-16 h-16 text-yellow-600' },
    { rank: 2, height: 'h-32', color: 'bg-gray-300', textColor: 'text-gray-700', medal: 'medal-silver', iconClass: 'w-12 h-12 text-gray-500' },
    { rank: 3, height: 'h-24', color: 'bg-orange-300', textColor: 'text-orange-800', medal: 'medal-bronze', iconClass: 'w-12 h-12 text-orange-600' },
];

const GameOverScreen: React.FC<GameOverScreenProps> = ({ room, onPlayAgain, onReturnHome, currentUser }) => {
  if (!room) {
    return <div>Loading results...</div>;
  }

  const sortedPlayers = [...room.players].sort((a, b) => b.score - a.score);
  const topThree = sortedPlayers.slice(0, 3);
  const restOfPlayers = sortedPlayers.slice(3);
  
  const podiumOrder = [topThree[1], topThree[0], topThree[2]].filter(Boolean);

  return (
    <div className="w-full max-w-4xl mx-auto text-center">
      <h1 className="text-6xl font-extrabold text-gray-800">Game Over!</h1>
      <p className="text-gray-500 mt-2 mb-10 text-lg">Here are the final results. Well played everyone!</p>

      {/* Podium */}
      <div className="flex justify-center items-end gap-2 md:gap-4 mb-10">
        {podiumOrder.map((player, index) => {
            const podiumInfo = podiumClasses.find(p => p.rank === sortedPlayers.indexOf(player) + 1);
            if (!player || !podiumInfo) return null;
            return (
                <div key={player.id} className="flex flex-col items-center w-1/4 max-w-xs animate-fade-in-down" style={{animationDelay: `${index * 150 + 200}ms`}}>
                    <Icon name={podiumInfo.medal as any} className={`${podiumInfo.iconClass} animate-pop-in`} style={{animationDelay: `${index * 150 + 400}ms`}}/>
                    <p className="font-bold text-lg mt-2">{player.name}</p>
                    <div className={`w-full ${podiumInfo.height} ${podiumInfo.color} rounded-t-lg flex items-center justify-center font-extrabold text-4xl ${podiumInfo.textColor}`}>
                        {podiumInfo.rank === 1 ? '1st' : podiumInfo.rank === 2 ? '2nd' : '3rd'}
                    </div>
                </div>
            )
        })}
      </div>

      <Card className="max-w-2xl mx-auto">
        <div className="grid grid-cols-3 gap-4 font-bold text-gray-500 px-4 pb-2 border-b">
          <span>Rank</span>
          <span>Player</span>
          <span className="text-right">Score</span>
        </div>
        <div className="space-y-1 mt-2">
            {sortedPlayers.map((player, index) => {
                const rank = index + 1;
                const isCurrentUser = player.id === currentUser?.id;
                if (rank <= 3) return null; // Already on podium
                return (
                    <div key={player.id} className={`grid grid-cols-3 gap-4 items-center p-3 rounded-lg transition ${isCurrentUser ? 'bg-orange-100' : 'hover:bg-gray-50'}`}>
                        <span className="font-bold text-lg">{rank}</span>
                        <span className={`font-bold ${isCurrentUser ? 'text-orange-600' : ''}`}>{player.name} {isCurrentUser ? '(You)' : ''}</span>
                        <span className={`text-right font-bold ${isCurrentUser ? 'text-orange-600' : 'text-gray-700'}`}>
                          <AnimatedNumber value={player.score} />
                        </span>
                    </div>
                )
            })}
        </div>
      </Card>
      
      <div className="mt-10 flex flex-col md:flex-row gap-4 justify-center max-w-md mx-auto">
        <Button onClick={onPlayAgain}>
            Play Again
        </Button>
        <Button onClick={onReturnHome} variant="secondary">
            Return to Home
        </Button>
      </div>

    </div>
  );
};

export default GameOverScreen;
