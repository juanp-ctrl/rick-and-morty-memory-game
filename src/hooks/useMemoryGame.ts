import { useState, useCallback, useEffect } from "react";
import type { Character, GameCard, GameState } from "../types";

const FLIP_DELAY = 1000; // Time to show mismatched cards before flipping back
const MATCH_DELAY = 1000; // Time to show matched cards before marking as matched
const INITIAL_REVEAL_TIME = 3000; // Time to show all cards at the start

export const useMemoryGame = (characters: Character[]) => {
  const [gameState, setGameState] = useState<GameState>(() => {
    return {
      cards: [],
      flippedCards: [],
      matchedPairs: 0,
      moves: 0,
      isGameCompleted: false,
      isGameStarted: false,
      gameStartTime: null,
      gameEndTime: null,
    };
  });

  // Update cards when characters are loaded or changed
  useEffect(() => {
    if (characters.length > 0) {
      const cards = createGameCards(characters);
      setGameState({
        cards: cards,
        flippedCards: [],
        matchedPairs: 0,
        moves: 0,
        isGameCompleted: false,
        isGameStarted: false,
        gameStartTime: null,
        gameEndTime: null,
      });
      // Also reset the game flags
      setIsCheckingMatch(false);
      setGameStarted(false);
      setIsInitialReveal(false);
    }
  }, [characters]);

  const [isCheckingMatch, setIsCheckingMatch] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [isInitialReveal, setIsInitialReveal] = useState(false);

  // Game start reveal: shuffle, show for 3 seconds, then hide
  useEffect(() => {
    if (gameStarted && isInitialReveal) {
      // Shuffle and show all cards
      setGameState((prev) => {
        const shuffledCards = shuffleArray([...prev.cards]);
        return {
          ...prev,
          cards: shuffledCards.map((card) => ({ ...card, isFlipped: true })),
        };
      });

      // Hide cards after 3 seconds
      const timer = setTimeout(() => {
        setGameState((prev) => ({
          ...prev,
          cards: prev.cards.map((card) => ({ ...card, isFlipped: false })),
        }));
        setIsInitialReveal(false);
      }, INITIAL_REVEAL_TIME);

      return () => clearTimeout(timer);
    }
  }, [gameStarted, isInitialReveal]);

  // Start the game timer on first card flip (after initial reveal)
  useEffect(() => {
    if (
      gameState.moves === 1 &&
      !gameState.gameStartTime &&
      gameStarted &&
      !isInitialReveal
    ) {
      setGameState((prev) => ({
        ...prev,
        gameStartTime: new Date(),
      }));
    }
  }, [gameState.moves, gameState.gameStartTime, gameStarted, isInitialReveal]);

  // Check for game completion
  useEffect(() => {
    const totalPairs = characters.length;
    if (
      totalPairs > 0 &&
      gameState.matchedPairs === totalPairs &&
      !gameState.isGameCompleted
    ) {
      setGameState((prev) => ({
        ...prev,
        isGameCompleted: true,
        gameEndTime: new Date(),
      }));
    }
  }, [gameState.matchedPairs, characters.length, gameState.isGameCompleted]);

  const startGame = useCallback(() => {
    if (!gameStarted) {
      setGameStarted(true);
      setIsInitialReveal(true);
    }
  }, [gameStarted]);

  const flipCard = useCallback(
    (cardId: string) => {
      // Prevent flipping if game not started, during initial reveal, checking for matches, or if card is already flipped/matched
      if (!gameStarted || isInitialReveal || isCheckingMatch) return;

      setGameState((prev) => {
        const card = prev.cards.find((c) => c.id === cardId);
        if (!card || card.isFlipped || card.isMatched) return prev;

        // If two cards are already flipped, don't allow more flips
        if (prev.flippedCards.length >= 2) return prev;

        const newFlippedCards = [...prev.flippedCards, cardId];
        const newCards = prev.cards.map((c) =>
          c.id === cardId ? { ...c, isFlipped: true } : c
        );

        return {
          ...prev,
          cards: newCards,
          flippedCards: newFlippedCards,
        };
      });
    },
    [gameStarted, isCheckingMatch, isInitialReveal]
  );

  // Check for matches when two cards are flipped
  useEffect(() => {
    if (gameState.flippedCards.length === 2) {
      setIsCheckingMatch(true);

      const [firstCardId, secondCardId] = gameState.flippedCards;
      const firstCard = gameState.cards.find((c) => c.id === firstCardId);
      const secondCard = gameState.cards.find((c) => c.id === secondCardId);

      if (firstCard && secondCard) {
        const isMatch = firstCard.characterId === secondCard.characterId;

        if (isMatch) {
          // Match found - mark cards as matched after a short delay
          setTimeout(() => {
            setGameState((prev) => ({
              ...prev,
              cards: prev.cards.map((c) =>
                c.id === firstCardId || c.id === secondCardId
                  ? { ...c, isMatched: true }
                  : c
              ),
              flippedCards: [],
              matchedPairs: prev.matchedPairs + 1,
            }));
            setIsCheckingMatch(false);
          }, MATCH_DELAY);
        } else {
          // No match - flip cards back after delay
          setTimeout(() => {
            setGameState((prev) => ({
              ...prev,
              cards: prev.cards.map((c) =>
                c.id === firstCardId || c.id === secondCardId
                  ? { ...c, isFlipped: false }
                  : c
              ),
              flippedCards: [],
              moves: prev.moves + 1,
            }));
            setIsCheckingMatch(false);
          }, FLIP_DELAY);
        }
      }
    }
  }, [gameState.flippedCards, gameState.cards]);

  const resetGame = useCallback(() => {
    const cards = createGameCards(characters);
    setGameState({
      cards: cards,
      flippedCards: [],
      matchedPairs: 0,
      moves: 0,
      isGameCompleted: false,
      isGameStarted: false,
      gameStartTime: null,
      gameEndTime: null,
    });
    setIsCheckingMatch(false);
    setGameStarted(false);
    setIsInitialReveal(false);
  }, [characters]);

  const getGameStats = useCallback(() => {
    const { gameStartTime, gameEndTime, moves, matchedPairs } = gameState;
    let elapsedTime = 0;

    if (gameStartTime) {
      const endTime = gameEndTime || new Date();
      elapsedTime = Math.floor(
        (endTime.getTime() - gameStartTime.getTime()) / 1000
      );
    }

    const accuracy =
      moves > 0 ? Math.round(((matchedPairs * 2) / moves) * 100) : 0;

    return {
      moves,
      matchedPairs,
      totalPairs: characters.length,
      elapsedTime,
      accuracy,
    };
  }, [gameState, characters.length]);

  return {
    gameState,
    flipCard,
    resetGame,
    startGame,
    getGameStats,
    isCheckingMatch: isCheckingMatch || isInitialReveal,
    gameStarted,
  };
};

// Helper function to create game cards with pairs side by side
function createGameCards(characters: Character[]): GameCard[] {
  const pairs: GameCard[] = [];

  characters.forEach((character) => {
    // Add both cards of the pair together (side by side)
    pairs.push(
      {
        id: `${character.id}-1`,
        characterId: character.id,
        character,
        isFlipped: true, // Show initially
        isMatched: false,
      },
      {
        id: `${character.id}-2`,
        characterId: character.id,
        character,
        isFlipped: true, // Show initially
        isMatched: false,
      }
    );
  });

  return pairs;
}

// Helper function to shuffle array
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}
