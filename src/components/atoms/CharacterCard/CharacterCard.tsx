import React from "react";
import type { CardProps } from "../../../types";

export const CharacterCard: React.FC<CardProps> = ({
  character,
  isFlipped,
  isMatched,
  onClick,
  disabled = false,
}) => {
  const handleClick = () => {
    if (!disabled && !isMatched) {
      onClick();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.key === "Enter" || e.key === " ") && !disabled && !isMatched) {
      e.preventDefault();
      onClick();
    }
  };

  const cardClasses = `
    relative w-full aspect-card cursor-pointer card-flip card-hover-effect rounded-lg
    ${disabled ? "cursor-not-allowed disabled" : "cursor-pointer"}
    ${isMatched ? "opacity-70 scale-95" : ""}
  `.trim();

  const cardInnerClasses = `
    relative w-full h-full text-center transition-transform duration-500 preserve-3d shadow-rick-md rounded-lg
    ${isFlipped ? "card-inner flipped" : "card-inner"}
  `.trim();

  return (
    <div
      className={cardClasses}
      onClick={handleClick}
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-label={`Character card: ${character.name}`}
      onKeyDown={handleKeyDown}
    >
      <div className={cardInnerClasses}>
        {/* Card Back */}
        <div
          className="absolute w-full h-full card-back overflow-hidden flex items-center justify-center"
          style={{ borderRadius: "8px", backgroundColor: "#A2F2F9" }}
        >
          <img
            src="/rick-and-morty-logo.png"
            alt="Rick and Morty Logo"
            className="max-w-full max-h-full object-contain p-4"
          />
        </div>

        {/* Card Front */}
        <div
          className="w-full h-full card-front bg-white flex flex-col"
          style={{ borderRadius: "8px", padding: "1rem" }}
        >
          <div>
            <img
              src={character.image}
              alt={character.name}
              loading="lazy"
              className="object-cover bg-rick-background lg:w-[180px] lg:h-[180px] w-[70px] h-[70px] rounded-lg"
              onError={(e) => {
                e.currentTarget.src = "/placeholder-character.png";
              }}
            />
          </div>

          <div style={{ marginTop: "8px" }}>
            <h3
              className="font-bold leading-tight text-left overflow-hidden text-ellipsis whitespace-nowrap"
              style={{
                fontSize: "1rem",
                color: "#233A59",
                marginBottom: "6px",
              }}
              title={character.name}
            >
              {character.name}
            </h3>
            <div className="text-left text-black" style={{ fontSize: "10px" }}>
              <span>
                {character.status} - {character.species}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Matched Overlay */}
      {isMatched && (
        <div
          className="absolute inset-0 gradient-success flex items-center justify-center z-10"
          style={{ borderRadius: "8px" }}
        >
          <div className="text-5xl text-rick-text-secondary font-bold drop-shadow-lg">
            ✓
          </div>
        </div>
      )}
    </div>
  );
};
