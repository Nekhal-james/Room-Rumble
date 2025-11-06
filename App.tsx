import React from 'react';
import useGameEngine from './hooks/useGameEngine';
import LandingScreen from './screens/LandingScreen';
import LobbyScreen from './screens/LobbyScreen';
import GameScreen from './screens/GameScreen';
import RoundCompleteScreen from './screens/RoundCompleteScreen';
import GameOverScreen from './screens/GameOverScreen';

export default function App(): React.ReactElement {
  const {
    gameState,
    actions,
    currentUser
  } = useGameEngine();

  const renderScreen = () => {
    switch (gameState.phase) {
      case 'landing':
        return <LandingScreen onCreateRoom={actions.createRoom} onJoinRoom={actions.joinRoom} />;
      case 'lobby':
        return <LobbyScreen room={gameState.room} onStartGame={actions.startGame} onLeaveRoom={actions.leaveRoom} currentUser={currentUser} />;
      case 'word-input':
      case 'guessing':
        return <GameScreen gameState={gameState} currentUser={currentUser} onSetWord={actions.setWord} onGuess={actions.makeGuess} onLeaveRoom={actions.leaveRoom} />;
      case 'round-complete':
        return <RoundCompleteScreen room={gameState.room} onNextRound={actions.startNextRound} currentUser={currentUser} />;
      case 'game-over':
        return <GameOverScreen room={gameState.room} onPlayAgain={actions.playAgain} onReturnHome={actions.leaveRoom} currentUser={currentUser} />;
      default:
        return <div>Loading...</div>;
    }
  };

  return (
    <div className="bg-[#FFFBF5] text-[#4A4A4A] min-h-screen flex items-center justify-center p-4 overflow-hidden relative font-sans">
      <div className="absolute top-0 left-0 w-64 h-64 bg-yellow-200 rounded-full mix-blend-multiply filter blur-2xl opacity-50 animate-blob"></div>
      <div className="absolute top-0 right-0 w-64 h-64 bg-orange-200 rounded-full mix-blend-multiply filter blur-2xl opacity-50 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-rose-200 rounded-full mix-blend-multiply filter blur-2xl opacity-50 animate-blob animation-delay-4000"></div>
      
      <main key={gameState.phase} className="z-10 w-full transition-all duration-500 ease-in-out animate-fade-in">
        {renderScreen()}
      </main>
    </div>
  );
}