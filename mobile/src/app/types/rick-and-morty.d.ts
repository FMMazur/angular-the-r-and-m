export namespace TheRickAndMorty {
  export interface Resources {
    characters: string;
    locations: string;
    episodes: string;
  }

  export type CharacterStatus = 'Alive' | 'Dead' | 'unknown';
  export type CharacterGender = 'Female' | 'Male' | 'Genderless' | 'unknown';

  export interface Character {
    id: number;
    name: string;
    status: CharacterStatus;
    species: string;
    type: string;
    gender: CharacterGender;
    origin: Origin;
    location: { name: string; url: string };
    image: string;
    episode: string[];
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

  export interface Location {
    id: number;
    name: string;
    type: string;
    dimension: string;
    residents: [];
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

  export type TypeString = 'character' | 'episode' | 'location';

  export type Type = Character | Episode | Location;
  export type TypeArray = (Character | Episode | Location)[];

  export type Response = Type;
  export interface ResponseWithInfo {
    info: ResponseInfo | null;
    results: TypeArray;
  }
}
