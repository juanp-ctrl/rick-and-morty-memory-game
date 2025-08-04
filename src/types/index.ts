// Authentication types
export interface User {
  id: string;
  username: string;
  email: string;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// Rick and Morty API types
export interface Character {
  id: number;
  name: string;
  status: "Alive" | "Dead" | "unknown";
  species: string;
  type: string;
  gender: "Female" | "Male" | "Genderless" | "unknown";
  origin: {
    name: string;
    url: string;
  };
  location: {
    name: string;
    url: string;
  };
  image: string;
  episode: string[];
  url: string;
  created: string;
}

export interface ApiResponse {
  info: {
    count: number;
    pages: number;
    next: string | null;
    prev: string | null;
  };
  results: Character[];
}

// Game types
export interface GameCard {
  id: string;
  characterId: number;
  character: Character;
  isFlipped: boolean;
  isMatched: boolean;
}

export interface GameState {
  cards: GameCard[];
  flippedCards: string[];
  matchedPairs: number;
  moves: number;
  isGameCompleted: boolean;
  isGameStarted: boolean;
  gameStartTime: Date | null;
  gameEndTime: Date | null;
}

// UI Component types
export interface ButtonProps {
  variant?: "primary" | "secondary" | "tertiary";
  size?: "small" | "medium" | "large";
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
  type?: "button" | "submit" | "reset";
  extraClasses?: string;
}

export interface InputProps {
  type?: "text" | "password" | "email";
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  error?: string;
  label?: string;
}

export interface CardProps {
  character: Character;
  isFlipped: boolean;
  isMatched: boolean;
  onClick: () => void;
  disabled?: boolean;
}

// API Service types
export interface ApiError {
  message: string;
  status?: number;
}

export interface GetCharactersParams {
  page?: number;
  name?: string;
  status?: Character["status"];
  species?: string;
  type?: string;
  gender?: Character["gender"];
}
