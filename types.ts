// Defines the phase of the game
export type GamePhase =
  | 'landing'
  | 'lobby'
  | 'word-input'
  | 'guessing'
  | 'round-complete'
  | 'game-over'
  | 'loading';

// Represents a single player
export interface Player {
  id: string; // Firebase Auth UID
  name: string;
  score: number;
  isHost: boolean;
}

// Represents a guess made by a player
export interface Guess {
  id: string; // player id
  name: string; // player name
  text: string;
  isCorrect: boolean;
  timestamp: number;
}

// Represents a single round of the game
export interface Round {
  roundNumber: number;
  writerId: string; // Player ID of the person who wrote the word
  word: string; // The secret word (encrypted or hidden from clients)
  wordHint: string; // The hint (e.g., "B____")
  guesses: Guess[];
  startTime: number; // Timestamp when guessing starts
  firstCorrectPlayerId: string | null;
}

// Represents the entire game room state in Firestore
export interface Room {
  id: string; // The 4-digit room code
  players: Player[];
  currentRound: number;
  totalRounds: number;
  phase: GamePhase;
  currentRoundData: Round | null;
  hostId: string; // Firebase Auth UID of the host
}

// This is the top-level client-side state object
export interface GameState {
  room: Room | null;
  phase: GamePhase;
}