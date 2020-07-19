export namespace TheRickAndMorty {
  export interface Resources {
    characters: string;
    locations: string;
    episodes: string;
  }

  export type CharacterStatus = 'alive' | 'dead' | 'unknown';
  export type CharacterGender = 'female' | 'male' | 'genderless' | 'unknown';

  export interface Character {
    id: number;
    name: string;
    status: string;
    species: CharacterStatus;
    type: string;
    gender: CharacterGender;
    origin: Origin;
    location: Location;
    image: string;
    episode: string[];
    url: string;
    created: string;
  }

  export interface Location {
    id: number;
    name: string;
    type: string;
    dimension: string;
    residents: [];
    url: string;
    created: string;
  }

  export interface Episode {
    id: number;
    name: string;
    air_date: string;
    episode: string;
    characters: string[];
    url: string;
    created: string;
  }

  export interface Origin {
    name: string;
    url: string;
  }

  export interface ResponseInfo {
    count: number;
    pages: number;
    next: string;
    prev?: any;
  }

  export type searchType = "character" | "episode" | "location";

  export type Type = Character | Episode | Location;
  export type TypeArray = Character[] | Episode[] | Location[];

  export type Response = Type;
  export interface ResponseWithInfo {
    info: ResponseInfo | null;
    results: TypeArray;
  }
}
