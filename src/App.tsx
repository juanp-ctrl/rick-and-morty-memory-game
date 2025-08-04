import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { LoginForm } from "./components/molecules/LoginForm";
import { MemoryGame } from "./components/organisms/MemoryGame";

// Create a client for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
      refetchOnWindowFocus: false,
    },
  },
});

const AppContent: React.FC = () => {
  const { user, isAuthenticated, isLoading, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  // Show loading screen while checking authentication
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-rick-background text-rick-text-secondary text-xl">
        <div className="text-center">
          <div className="text-4xl mb-4">🌌</div>
          <div className="text-white">Cargando cartas...</div>
        </div>
      </div>
    );
  }

  // Show login if not authenticated
  if (!isAuthenticated) {
    return <LoginForm />;
  }

  // Show memory game directly
  return <MemoryGame onLogout={handleLogout} userName={user?.username} />;
};

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
