import React from "react";
import { CharacterCard } from "../../atoms/CharacterCard";
import { Button } from "../../atoms/Button";
import { useMemoryGame } from "../../../hooks/useMemoryGame";
import { useRandomCharacters } from "../../../services/rickMortyService";

interface MemoryGameProps {
  onLogout: () => void;
  userName?: string;
}

export const MemoryGame: React.FC<MemoryGameProps> = ({
  onLogout,
  userName,
}) => {
  // Fetch 6 random characters for 6 pairs (12 cards total)
  const {
    data: characters,
    isLoading,
    error,
    refetch,
  } = useRandomCharacters(6);

  const {
    gameState,
    flipCard,
    startGame,
    getGameStats,
    isCheckingMatch,
    gameStarted,
  } = useMemoryGame(characters || []);

  // Function to handle game reset with new characters
  const handleResetGame = async () => {
    // Refetch new characters - the useEffect in useMemoryGame will handle resetting all game state
    await refetch();
    startGame();
  };
  const stats = getGameStats();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-rick-background flex justify-center items-center">
        <div className="text-center text-rick-text-secondary">
          <div className="text-4xl mb-4">🌌</div>
          <div className="text-xl text-white">Cargando personajes...</div>
        </div>
      </div>
    );
  }

  if (error || !characters) {
    return (
      <div className="min-h-screen bg-rick-background flex justify-center items-center">
        <div className="text-center text-rick-error">
          <div className="text-4xl mb-4">❌</div>
          <div className="text-xl">Error al cargar personajes</div>
          <Button
            onClick={() => window.location.reload()}
            variant="primary"
            extraClasses="mt-4"
          >
            Reintentar
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-rick-background px-4 md:px-52">
      {/* Header */}
      <header className="flex justify-between items-center mb-8 flex-wrap gap-4 w-full">
        <div className="flex flex-col justify-center items-center w-full">
          <img
            src="/Rick_and_Morty.svg"
            alt="Rick and Morty Logo"
            width={519.69}
            height={180}
          />
          <p className="text-black text-xl font-bold bg-[#D8E054] px-4 py-2 rounded-[25px]">
            Juego de memoria
          </p>
          <div className="w-full flex justify-between">
            <p className="text-white text-sm font-medium">
              Usuario: {userName}
            </p>
            <p
              onClick={onLogout}
              className="text-white text-sm font-medium cursor-pointer"
            >
              Cerrar sesión
            </p>
          </div>
        </div>
      </header>

      <div className="bg-rick-surface px-8 md:px-18 rounded-t-2xl pt-9 pb-[23px] min-h-[calc(100vh-100px)]">
        {gameState.isGameCompleted ? (
          <>
            {/* Game Completed Section */}
            <h2 className="text-[#233A59] mb-4 text-5xl font-bold">
              ¡Felicitaciones!
            </h2>
            <p className="text-black text-2xl mb-6">
              Terminaste el juego con {stats.moves} turnos
            </p>
            <div className="flex mt-18 gap-4 justify-center flex-wrap">
              <Button onClick={handleResetGame} variant="secondary">
                Repetir
              </Button>
              <Button
                onClick={() => window.location.reload()}
                variant="tertiary"
              >
                Inicio
              </Button>
            </div>
          </>
        ) : (
          <>
            {/* Game Stats */}
            <div className="flex justify-between mb-6 px-6">
              {gameStarted ? (
                <>
                  <p className="text-black text-xl font-bold">
                    Aciertos: {stats.matchedPairs}
                  </p>
                  <p className="text-black text-xl font-bold">
                    Turnos: {stats.moves}
                  </p>
                </>
              ) : (
                <p className="text-black text-xl font-bold">Personajes</p>
              )}
            </div>

            {/* Game Board */}
            <div
              className="grid grid-cols-2 sm:grid-cols-4 max-w-4xl mx-auto mb-8"
              style={{ gap: "1rem" }}
            >
              {gameState.cards.map((card) => (
                <CharacterCard
                  key={card.id}
                  character={card.character}
                  isFlipped={card.isFlipped}
                  isMatched={card.isMatched}
                  onClick={() => flipCard(card.id)}
                  disabled={isCheckingMatch || card.isFlipped || card.isMatched}
                />
              ))}
            </div>

            {/* Game Controls */}
            {!gameStarted && (
              <div className="flex justify-center gap-4 mb-8 flex-wrap">
                <Button
                  onClick={startGame}
                  variant="secondary"
                  disabled={gameStarted}
                >
                  Jugar
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
