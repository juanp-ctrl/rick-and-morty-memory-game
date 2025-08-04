import type { User } from "../types";

const TOKEN_KEY = "rick_morty_token";
const USER_KEY = "rick_morty_user";

// Mock authentication - simulating a real API
export const authenticateUser = async (
  username: string,
  password: string
): Promise<{ user: User; token: string } | null> => {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Mock validation - accept any non-empty credentials
  if (username.trim() && password.trim()) {
    const mockUser: User = {
      id: generateUserId(),
      username: username.trim(),
      email: `${username.trim().toLowerCase()}@rickandmorty.com`,
    };

    const mockToken = generateToken();

    return { user: mockUser, token: mockToken };
  }

  return null;
};

export const saveAuthData = (user: User, token: string): void => {
  try {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  } catch (error) {
    console.error("Failed to save auth data:", error);
  }
};

export const getStoredAuthData = (): { user: User; token: string } | null => {
  try {
    const token = localStorage.getItem(TOKEN_KEY);
    const userStr = localStorage.getItem(USER_KEY);

    if (token && userStr) {
      const user = JSON.parse(userStr);

      // Validate token format and user structure
      if (isValidToken(token) && isValidUser(user)) {
        return { user, token };
      }
    }
  } catch (error) {
    console.error("Failed to retrieve auth data:", error);
  }

  return null;
};

export const clearAuthData = (): void => {
  try {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  } catch (error) {
    console.error("Failed to clear auth data:", error);
  }
};

// Helper functions
const generateUserId = (): string => {
  return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

const generateToken = (): string => {
  return `token_${Date.now()}_${Math.random().toString(36).substr(2, 16)}`;
};

const isValidToken = (token: string): boolean => {
  return (
    typeof token === "string" && token.startsWith("token_") && token.length > 20
  );
};

const isValidUser = (user: any): user is User => {
  return (
    user &&
    typeof user === "object" &&
    typeof user.id === "string" &&
    typeof user.username === "string" &&
    typeof user.email === "string" &&
    user.id.length > 0 &&
    user.username.length > 0 &&
    user.email.includes("@")
  );
};
