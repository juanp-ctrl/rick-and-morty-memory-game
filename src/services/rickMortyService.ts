import { useQuery, useQueries, QueryClient } from "@tanstack/react-query";
import { rickMortyAdapter } from "../adapters/rickMortyAdapter";
import type { GetCharactersParams } from "../types";

// Query keys for React Query
export const queryKeys = {
  characters: ["characters"] as const,
  character: (id: number) => ["character", id] as const,
  multipleCharacters: (ids: number[]) =>
    ["characters", "multiple", ids] as const,
  randomCharacters: (count: number) => ["characters", "random", count] as const,
} as const;

// Custom hooks for data fetching
export const useCharacters = (params: GetCharactersParams = {}) => {
  return useQuery({
    queryKey: [...queryKeys.characters, params],
    queryFn: () => rickMortyAdapter.getCharacters(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};

export const useCharacter = (id: number) => {
  return useQuery({
    queryKey: queryKeys.character(id),
    queryFn: () => rickMortyAdapter.getCharacterById(id),
    enabled: id > 0,
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
    retry: 3,
  });
};

export const useMultipleCharacters = (ids: number[]) => {
  return useQuery({
    queryKey: queryKeys.multipleCharacters(ids),
    queryFn: () => rickMortyAdapter.getMultipleCharacters(ids),
    enabled: ids.length > 0,
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
    retry: 3,
  });
};

export const useRandomCharacters = (count: number = 20) => {
  return useQuery({
    queryKey: queryKeys.randomCharacters(count),
    queryFn: () => rickMortyAdapter.getRandomCharacters(count),
    staleTime: 2 * 60 * 1000, // 2 minutes (shorter since we want fresh random characters)
    gcTime: 5 * 60 * 1000, // 5 minutes
    retry: 3,
    refetchOnWindowFocus: false, // Don't refetch when window gets focus
  });
};

// Utility function to prefetch character data
export const prefetchCharacter = (queryClient: QueryClient, id: number) => {
  return queryClient.prefetchQuery({
    queryKey: queryKeys.character(id),
    queryFn: () => rickMortyAdapter.getCharacterById(id),
    staleTime: 10 * 60 * 1000,
  });
};

// Utility function to prefetch multiple characters
export const prefetchMultipleCharacters = (
  queryClient: QueryClient,
  ids: number[]
) => {
  return queryClient.prefetchQuery({
    queryKey: queryKeys.multipleCharacters(ids),
    queryFn: () => rickMortyAdapter.getMultipleCharacters(ids),
    staleTime: 10 * 60 * 1000,
  });
};

// Hook for fetching individual characters in parallel
export const useCharactersParallel = (ids: number[]) => {
  return useQueries({
    queries: ids.map((id) => ({
      queryKey: queryKeys.character(id),
      queryFn: () => rickMortyAdapter.getCharacterById(id),
      enabled: id > 0,
      staleTime: 10 * 60 * 1000,
      retry: 3,
    })),
  });
};

// Service functions for direct use (without hooks)
export const rickMortyService = {
  getCharacters: (params?: GetCharactersParams) =>
    rickMortyAdapter.getCharacters(params),
  getCharacterById: (id: number) => rickMortyAdapter.getCharacterById(id),
  getMultipleCharacters: (ids: number[]) =>
    rickMortyAdapter.getMultipleCharacters(ids),
  getRandomCharacters: (count?: number) =>
    rickMortyAdapter.getRandomCharacters(count),
};
