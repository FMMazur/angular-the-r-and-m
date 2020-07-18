export namespace TheRickAndMorty {
  export interface Resources {
    characters: string;
    locations: string;
    episodes: string;
  }

  export type ResourceType = "characters" | "locations" | "episodes";

  export interface Character {
    id: number;
    name: string;
    status: string;
    species: string;
    type: string;
    gender: string;
    origin: Origin;
    location: Origin;
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

  export type Result = Character | Character[] | Episode | Episode[] | Location | Location[];

  export interface Response {
    info: ResponseInfo | null;
    result: Result;
  }
}
