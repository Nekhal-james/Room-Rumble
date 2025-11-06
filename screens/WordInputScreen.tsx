
import React, { useState } from 'react';
import Button from '../components/Button';
import Card from '../components/Card';

interface WordInputScreenProps {
  onSetWord: (word: string) => void;
}

const WordInputScreen: React.FC<WordInputScreenProps> = ({ onSetWord }) => {
  const [word, setWord] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (word.trim().length > 1) {
      onSetWord(word.trim());
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto text-center flex flex-col items-center justify-center min-h-[400px]">
      <Card className="w-full">
        <h2 className="text-3xl font-extrabold text-gray-800 mb-2">You are the Writer!</h2>
        <p className="text-gray-600 mb-6">Enter a secret word for others to guess.</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={word}
            onChange={(e) => setWord(e.target.value)}
            placeholder="Type your word here..."
            className="w-full px-4 py-3 text-2xl text-center bg-white/80 border-2 border-orange-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
            autoFocus
          />
          <Button type="submit" disabled={word.trim().length < 2}>
            Confirm Word
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default WordInputScreen;
