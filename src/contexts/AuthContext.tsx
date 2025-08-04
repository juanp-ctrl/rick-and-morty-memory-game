import React, { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import type { User, AuthContextType } from "../types";
import {
  authenticateUser,
  saveAuthData,
  getStoredAuthData,
  clearAuthData,
} from "../utils/auth";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for stored auth data on mount
  useEffect(() => {
    const initializeAuth = async () => {
      setIsLoading(true);
      try {
        const storedAuth = getStoredAuthData();
        if (storedAuth) {
          setUser(storedAuth.user);
          setToken(storedAuth.token);
        }
      } catch (error) {
        console.error("Failed to initialize auth:", error);
        // Clear potentially corrupted data
        clearAuthData();
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (
    username: string,
    password: string
  ): Promise<boolean> => {
    // Validate input
    if (!username.trim() || !password.trim()) {
      return false;
    }

    setIsLoading(true);
    try {
      const authResult = await authenticateUser(username, password);
      if (authResult) {
        setUser(authResult.user);
        setToken(authResult.token);
        saveAuthData(authResult.user, authResult.token);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = (): void => {
    setUser(null);
    setToken(null);
    clearAuthData();
  };

  const isAuthenticated = Boolean(user && token);

  const value: AuthContextType = {
    user,
    token,
    login,
    logout,
    isAuthenticated,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
