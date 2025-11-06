import { useState, useEffect } from 'react';
import { db, auth, authenticateUser, getAppId } from '../firebaseConfig';
import {
  doc,
  setDoc,
  onSnapshot,
  getDoc,
  updateDoc,
  deleteDoc,
  runTransaction,
  serverTimestamp,
} from 'firebase/firestore';
import { onAuthStateChanged, User } from 'firebase/auth';
import type { GameState, Room, Player, GamePhase, Round, Guess } from '../types';
import {
  MAX_PLAYERS,
  TOTAL_ROUNDS,
  CORRECT_GUESS_SCORE_FIRST,
  CORRECT_GUESS_SCORE_OTHER,
  WRITER_SCORE_BONUS,
} from '../constants';

// --- Helper Functions ---

/**
 * Generates a random 4-digit room code.
 */
const generateRoomCode = (): string => {
  return Math.floor(1000 + Math.random() * 9000).toString();
};

/**
 * Creates a "hint" from the secret word (e.g., "Banana" -> "B_____").
 */
const createWordHint = (word: string): string => {
  if (!word) return '';
  return word[0].toUpperCase() + '_'.repeat(word.length - 1);
};

/**
 * Gets the path for a room document in Firestore.
 * Uses the public path so all users can access it.
 */
const getRoomDocPath = (roomId: string) => {
  const appId = getAppId();
  // This path MUST match the firestore.rules
  return `artifacts/${appId}/public/data/rooms/${roomId}`;
};

/**
 * Picks the next player in the list to be the writer.
 */
const getNextWriterId = (players: Player[], currentWriterId: string | null): string => {
  if (players.length === 0) return '';
  if (!currentWriterId) return players[0].id;

  const currentIndex = players.findIndex((p) => p.id === currentWriterId);
  const nextIndex = (currentIndex + 1) % players.length;
  return players[nextIndex].id;
};

// --- The Main Hook ---

export default function useGameEngine() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [roomId, setRoomId] = useState<string | null>(null);
  const [gameState, setGameState] = useState<GameState>({
    room: null,
    phase: 'loading',
  });

  // 1. Handle User Authentication
  useEffect(() => {
    authenticateUser(); // Sign in the user
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
        // If not in a room, set phase to landing
        if (!roomId) {
          setGameState((prev) => ({ ...prev, phase: 'landing' }));
        }
      } else {
        setCurrentUser(null);
        setGameState({ room: null, phase: 'landing' });
      }
    });
    return () => unsubscribe();
  }, [roomId]);

  // 2. Listen to Game State Changes in Firestore (Real-time sync)
  useEffect(() => {
    if (!roomId || !currentUser) return;

    const roomDocRef = doc(db, getRoomDocPath(roomId));
    const unsubscribe = onSnapshot(
      roomDocRef,
      (docSnap) => {
        if (docSnap.exists()) {
          const roomData = docSnap.data() as Room;
          setGameState({
            room: roomData,
            phase: roomData.phase,
          });
        } else {
          // Room was deleted or doesn't exist
          setRoomId(null);
          setGameState({ room: null, phase: 'landing' });
          console.log('Room not found or deleted.');
        }
      },
      (error) => {
        console.error('Error listening to room snapshot:', error);
      }
    );

    // Clean up listener when component unmounts or roomId changes
    return () => unsubscribe();
  }, [roomId, currentUser]);

  // --- Game Actions (These are called from App.tsx) ---

  const createRoom = async (playerName: string) => {
    if (!currentUser) return;
    setGameState((prev) => ({ ...prev, phase: 'loading' }));

    const newRoomId = generateRoomCode();
    const hostPlayer: Player = {
      id: currentUser.uid,
      name: playerName,
      score: 0,
      isHost: true,
    };

    const newRoom: Room = {
      id: newRoomId,
      players: [hostPlayer],
      currentRound: 0,
      totalRounds: TOTAL_ROUNDS,
      phase: 'lobby',
      currentRoundData: null,
      hostId: currentUser.uid,
    };

    try {
      const roomDocRef = doc(db, getRoomDocPath(newRoomId));
      await setDoc(roomDocRef, newRoom);
      setRoomId(newRoomId);
    } catch (error) {
      console.error('Error creating room:', error);
      setGameState((prev) => ({ ...prev, phase: 'landing' }));
    }
  };

  const joinRoom = async (roomIdToJoin: string, playerName: string) => {
    if (!currentUser) return;
    setGameState((prev) => ({ ...prev, phase: 'loading' }));

    const roomDocRef = doc(db, getRoomDocPath(roomIdToJoin));

    try {
      await runTransaction(db, async (transaction) => {
        const roomDoc = await transaction.get(roomDocRef);
        if (!roomDoc.exists()) {
          throw new Error('Room does not exist!');
        }

        const roomData = roomDoc.data() as Room;

        if (roomData.players.length >= MAX_PLAYERS) {
          throw new Error('Room is full!');
        }

        // Check if player is already in the room
        if (!roomData.players.find((p) => p.id === currentUser.uid)) {
          const newPlayer: Player = {
            id: currentUser.uid,
            name: playerName,
            score: 0,
            isHost: false,
          };
          transaction.update(roomDocRef, {
            players: [...roomData.players, newPlayer],
          });
        }
        // If player is already in, we just join them to the room
      });
      setRoomId(roomIdToJoin);
    } catch (error) {
      console.error('Error joining room:', error);
      setGameState((prev) => ({ ...prev, phase: 'landing' }));
      // You should show an error to the user here
    }
  };

  const leaveRoom = async () => {
    if (!currentUser || !roomId) return;

    const currentRoomId = roomId;
    // Immediately clear local state
    setRoomId(null);
    setGameState({ room: null, phase: 'landing' });

    const roomDocRef = doc(db, getRoomDocPath(currentRoomId));

    try {
      await runTransaction(db, async (transaction) => {
        const roomDoc = await transaction.get(roomDocRef);
        if (!roomDoc.exists()) return; // Room already gone

        const roomData = roomDoc.data() as Room;
        const remainingPlayers = roomData.players.filter((p) => p.id !== currentUser.uid);

        if (remainingPlayers.length === 0) {
          // Last player left, delete the room
          transaction.delete(roomDocRef);
        } else {
          // Check if host left
          let newHostId = roomData.hostId;
          if (roomData.hostId === currentUser.uid) {
            // Host left, make the next player the host
            remainingPlayers[0].isHost = true;
            newHostId = remainingPlayers[0].id;
          }
          transaction.update(roomDocRef, {
            players: remainingPlayers,
            hostId: newHostId,
          });
        }
      });
    } catch (error) {
      console.error('Error leaving room:', error);
    }
  };

  const startGame = async () => {
    if (!currentUser || !roomId || gameState.room?.hostId !== currentUser.uid) return;

    const room = gameState.room;
    if (!room) return;
    
    const firstWriterId = room.players[0].id;

    const firstRound: Round = {
      roundNumber: 1,
      writerId: firstWriterId,
      word: '',
      wordHint: '',
      guesses: [],
      startTime: 0,
      firstCorrectPlayerId: null,
    };

    try {
      const roomDocRef = doc(db, getRoomDocPath(roomId));
      await updateDoc(roomDocRef, {
        phase: 'word-input',
        currentRound: 1,
        currentRoundData: firstRound,
      });
    } catch (error) {
      console.error('Error starting game:', error);
    }
  };

  const setWord = async (word: string) => {
    if (!currentUser || !roomId || !gameState.room?.currentRoundData) return;
    if (gameState.room.currentRoundData.writerId !== currentUser.uid) return;

    const wordHint = createWordHint(word);

    try {
      const roomDocRef = doc(db, getRoomDocPath(roomId));
      await updateDoc(roomDocRef, {
        'currentRoundData.word': word.toLowerCase(), // Store word in lowercase for easy checking
        'currentRoundData.wordHint': wordHint,
        'currentRoundData.startTime': serverTimestamp(), // Starts the timer!
        phase: 'guessing',
      });
    } catch (error) {
      console.error('Error setting word:', error);
    }
  };

  const makeGuess = async (guessText: string) => {
    if (!currentUser || !roomId || !gameState.room?.currentRoundData) return;

    const room = gameState.room;
    if (!room?.currentRoundData) return;  // Extra safety check
    const player = room.players.find((p) => p.id === currentUser.uid);
    if (!player || room.currentRoundData.writerId === currentUser.uid) return; // Writer can't guess

    try {
      const roomDocRef = doc(db, getRoomDocPath(roomId));

      await runTransaction(db, async (transaction) => {
        const roomDoc = await transaction.get(roomDocRef);
        if (!roomDoc.exists()) throw new Error('Room not found');

        const roomData = roomDoc.data() as Room;
        const roundData = roomData.currentRoundData;
        if (!roundData || roomData.phase !== 'guessing') throw new Error('Round not active');

        // Check if player already guessed correctly
        if (roundData.guesses.find((g) => g.id === currentUser.uid && g.isCorrect)) {
          return; // Already guessed right
        }

        const isCorrect = guessText.toLowerCase() === roundData.word;
        const newGuess: Guess = {
          id: currentUser.uid,
          name: player.name,
          text: guessText,
          isCorrect: isCorrect,
          timestamp: Date.now(),
        };

        const updatedGuesses = [...roundData.guesses, newGuess];
        const updatedPlayers = [...roomData.players];
        let firstCorrectId = roundData.firstCorrectPlayerId;

        if (isCorrect) {
          let scoreToAdd = CORRECT_GUESS_SCORE_OTHER;
          if (!firstCorrectId) {
            // First correct guess!
            scoreToAdd = CORRECT_GUESS_SCORE_FIRST;
            firstCorrectId = currentUser.uid;
          }

          // Update player's score
          const playerIndex = updatedPlayers.findIndex((p) => p.id === currentUser.uid);
          if (playerIndex !== -1) {
            updatedPlayers[playerIndex].score += scoreToAdd;
          }
        }

        // Check if all players (except writer) have guessed correctly
        const guessers = updatedPlayers.filter((p) => p.id !== roundData.writerId);
        const correctGuessers = updatedGuesses.filter((g) => g.isCorrect).map((g) => g.id);
        const allGuessed = guessers.every((p) => correctGuessers.includes(p.id));

        if (allGuessed) {
          // --- ROUND COMPLETE ---
          // Add bonus to writer
          const writerIndex = updatedPlayers.findIndex((p) => p.id === roundData.writerId);
          if (writerIndex !== -1) {
            updatedPlayers[writerIndex].score += WRITER_SCORE_BONUS;
          }
          transaction.update(roomDocRef, {
            phase: 'round-complete',
            players: updatedPlayers,
            'currentRoundData.guesses': updatedGuesses,
            'currentRoundData.firstCorrectPlayerId': firstCorrectId,
          });
        } else {
          // --- GUESSING CONTINUES ---
          transaction.update(roomDocRef, {
            players: updatedPlayers,
            'currentRoundData.guesses': updatedGuesses,
            'currentRoundData.firstCorrectPlayerId': firstCorrectId,
          });
        }
      });
    } catch (error) {
      console.error('Error making guess:', error);
    }
  };

  const startNextRound = async () => {
    if (!currentUser || !roomId || gameState.room?.hostId !== currentUser.uid) return;

    try {
      const roomDocRef = doc(db, getRoomDocPath(roomId));
      
      await runTransaction(db, async (transaction) => {
        const roomDoc = await transaction.get(roomDocRef);
        if (!roomDoc.exists()) throw new Error("Room not found");
        
        const roomData = roomDoc.data() as Room;

        if (roomData.currentRound >= roomData.totalRounds) {
          // --- GAME OVER ---
          transaction.update(roomDocRef, {
            phase: 'game-over',
          });
        } else {
          // --- NEXT ROUND ---
          const nextRoundNumber = roomData.currentRound + 1;
          const nextWriterId = getNextWriterId(
            roomData.players,
            roomData.currentRoundData?.writerId || null
          );

          const nextRound: Round = {
            roundNumber: nextRoundNumber,
            writerId: nextWriterId,
            word: '',
            wordHint: '',
            guesses: [],
            startTime: 0,
            firstCorrectPlayerId: null,
          };

          transaction.update(roomDocRef, {
            phase: 'word-input',
            currentRound: nextRoundNumber,
            currentRoundData: nextRound,
          });
        }
      });
    } catch (error) {
      console.error('Error starting next round:', error);
    }
  };

  const playAgain = async () => {
    if (!currentUser || !roomId || gameState.room?.hostId !== currentUser.uid) return;

    const roomDocRef = doc(db, getRoomDocPath(roomId));
    
    // Reset scores, keep players
    const updatedPlayers = gameState.room?.players.map(p => ({ ...p, score: 0 })) || [];

    try {
      await updateDoc(roomDocRef, {
        phase: 'lobby',
        currentRound: 0,
        currentRoundData: null,
        players: updatedPlayers,
      });
    } catch (error) {
      console.error('Error playing again:', error);
    }
  };

  // This object is passed to App.tsx
  const actions = {
    createRoom,
    joinRoom,
    leaveRoom,
    startGame,
    setWord,
    makeGuess,
    startNextRound,
    playAgain,
  };

  return { gameState, actions, currentUser };
}