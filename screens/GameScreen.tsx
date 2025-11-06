
import React from 'react';
import { GameState, Player } from '../types';
import WordInputScreen from './WordInputScreen';
import GuessingScreen from './GuessingScreen';

interface GameScreenProps {
  gameState: GameState;
  currentUser: Player | null;
  onSetWord: (word: string) => void;
  onGuess: (guess: string) => void;
  onLeaveRoom: () => void;
}

const GameScreen: React.FC<GameScreenProps> = ({ gameState, currentUser, onSetWord, onGuess, onLeaveRoom }) => {
  if (!gameState.room || !gameState.room.roundData || !currentUser) {
    return <div>Loading game...</div>;
  }
  
  const isWriter = gameState.room.roundData.writerId === currentUser.id;

  if (gameState.phase === 'word-input' && isWriter) {
    return <WordInputScreen onSetWord={onSetWord} />;
  }

  return <GuessingScreen gameState={gameState} currentUser={currentUser} onGuess={onGuess} onLeaveRoom={onLeaveRoom} />;
};

export default GameScreen;
