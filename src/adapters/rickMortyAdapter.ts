import type { Character, ApiResponse, GetCharactersParams } from "../types";

const API_BASE_URL = "https://rickandmortyapi.com/api";

class RickMortyAdapter {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  async getCharacters(params: GetCharactersParams = {}): Promise<ApiResponse> {
    try {
      const url = this.buildCharactersUrl(params);
      const response = await fetch(url);

      if (!response.ok) {
        throw new ApiError(
          `HTTP error! status: ${response.status}`,
          response.status
        );
      }

      const data = await response.json();
      return this.validateApiResponse(data);
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError("Failed to fetch characters");
    }
  }

  async getCharacterById(id: number): Promise<Character> {
    try {
      const response = await fetch(`${this.baseUrl}/character/${id}`);

      if (!response.ok) {
        throw new ApiError(
          `HTTP error! status: ${response.status}`,
          response.status
        );
      }

      const data = await response.json();
      return this.validateCharacter(data);
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(`Failed to fetch character with id: ${id}`);
    }
  }

  async getMultipleCharacters(ids: number[]): Promise<Character[]> {
    try {
      if (ids.length === 0) {
        return [];
      }

      const idsString = ids.join(",");
      const response = await fetch(`${this.baseUrl}/character/${idsString}`);

      if (!response.ok) {
        throw new ApiError(
          `HTTP error! status: ${response.status}`,
          response.status
        );
      }

      const data = await response.json();

      // API returns single character object if only one ID, array if multiple
      const characters = Array.isArray(data) ? data : [data];
      return characters.map((char) => this.validateCharacter(char));
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError("Failed to fetch multiple characters");
    }
  }

  async getRandomCharacters(count: number = 20): Promise<Character[]> {
    try {
      // Get total character count first
      const response = await fetch(`${this.baseUrl}/character`);
      if (!response.ok) {
        throw new ApiError(
          `HTTP error! status: ${response.status}`,
          response.status
        );
      }

      const data = await response.json();
      const totalCharacters = data.info.count;

      // Generate random character IDs
      const randomIds = this.generateRandomIds(count, totalCharacters);

      return this.getMultipleCharacters(randomIds);
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError("Failed to fetch random characters");
    }
  }

  private buildCharactersUrl(params: GetCharactersParams): string {
    const url = new URL(`${this.baseUrl}/character`);

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, value.toString());
      }
    });

    return url.toString();
  }

  private generateRandomIds(count: number, max: number): number[] {
    const ids = new Set<number>();

    while (ids.size < count && ids.size < max) {
      const randomId = Math.floor(Math.random() * max) + 1;
      ids.add(randomId);
    }

    return Array.from(ids);
  }

  private validateCharacter(data: any): Character {
    if (!data || typeof data !== "object") {
      throw new ApiError("Invalid character data format");
    }

    const requiredFields = [
      "id",
      "name",
      "status",
      "species",
      "gender",
      "image",
    ];
    for (const field of requiredFields) {
      if (data[field] === undefined || data[field] === null) {
        throw new ApiError(`Missing required field: ${field}`);
      }
    }

    return data as Character;
  }

  private validateApiResponse(data: any): ApiResponse {
    if (!data || typeof data !== "object") {
      throw new ApiError("Invalid API response format");
    }

    if (!data.info || !Array.isArray(data.results)) {
      throw new ApiError("Invalid API response structure");
    }

    return data as ApiResponse;
  }
}

// Create a singleton instance
export const rickMortyAdapter = new RickMortyAdapter();

// Custom error class
class ApiError extends Error {
  public status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export { ApiError };
