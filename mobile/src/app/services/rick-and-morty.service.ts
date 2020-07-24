import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs';
import {
  shareReplay,
  map,
  mergeAll,
  distinctUntilChanged,
} from 'rxjs/operators';

import { TheRickAndMorty } from '../../../../src/app/types/rick-and-morty';

@Injectable({
  providedIn: 'root',
})
export class RickAndMortyService {
  static readonly API_URL = 'https://rickandmortyapi.com/api/';
  resources: Observable<TheRickAndMorty.Resources>;
  headers = new HttpHeaders()
    .append('Content-Type', 'application/json')
    .append('Set-Cookie', 'SameSite=None;Secure')
    .append('Cache-Control', 'max-age=31536000');

  constructor(private http: HttpClient) {
    this.resources = this.getResources();
  }

  getResources(): Observable<TheRickAndMorty.Resources> {
    return this.http
      .get<TheRickAndMorty.Resources>(RickAndMortyService.API_URL)
      .pipe(shareReplay());
  }

  getAll(
    type: 'characters' | 'episodes' | 'locations',
    options: {
      headers?: HttpHeaders | { [header: string]: string | string[] };
      observe?: 'body';
      params?: HttpParams | { [param: string]: string | string[] };
      reportProgress?: boolean;
      responseType?: 'json';
      withCredentials?: boolean;
    }
  ): Observable<TheRickAndMorty.ResponseWithInfo> {
    return this.resources.pipe(
      map((resources) =>
        this.http.get<TheRickAndMorty.ResponseWithInfo>(
          `${resources[type]}/`,
          options
        )
      ),
      mergeAll(),
      shareReplay()
    );
  }

  getOne(
    type: 'character' | 'episode' | 'location',
    id: number | string,
    url: string,
    options: {
      headers?: HttpHeaders | { [header: string]: string | string[] };
      observe?: 'body';
      params?: HttpParams | { [param: string]: string | string[] };
      reportProgress?: boolean;
      responseType?: 'json';
      withCredentials?: boolean;
    }
  ): Observable<
    | TheRickAndMorty.Character
    | TheRickAndMorty.Episode
    | TheRickAndMorty.Location
  > {
    return this.resources.pipe(
      map((resources) => {
        if (type === 'character')
          return this.http.get<TheRickAndMorty.Character>(
            url || `${resources[type]}/${id}`,
            options
          );
        else if (type === 'episode')
          return this.http.get<TheRickAndMorty.Episode>(
            url || `${resources[type]}/${id}`,
            options
          );
        else if (type === 'location')
          return this.http.get<TheRickAndMorty.Location>(
            url || `${resources[type]}/${id}`,
            options
          );
      }),
      mergeAll(),
      shareReplay()
    );
  }

  getCharacters(
    page: number = 1
  ): Observable<TheRickAndMorty.ResponseWithInfo> {
    const options = {
      headers: this.headers,
      params: new HttpParams().append('page', page.toString()),
    };

    return this.getAll('characters', options);
  }

  getEpisodes(page: number = 1): Observable<TheRickAndMorty.ResponseWithInfo> {
    const options = page
      ? {
          headers: this.headers,
          params: new HttpParams().append('page', page.toString()),
        }
      : {};

    return this.getAll('episodes', options);
  }

  getLocations(page: number = 1): Observable<TheRickAndMorty.ResponseWithInfo> {
    const options = page
      ? {
          headers: this.headers,
          params: new HttpParams().append('page', page.toString()),
        }
      : {};

    return this.getAll('locations', options);
  }

  getCharacter(
    id?: number | string,
    url?: string
  ): Observable<TheRickAndMorty.Character> {
    const options = {
      headers: this.headers,
    };

    return this.getOne('character', id, url, options) as Observable<
      TheRickAndMorty.Character
    >;
  }

  getEpisode(
    id?: number | string,
    url?: string
  ): Observable<TheRickAndMorty.Episode> {
    const options = {
      headers: this.headers,
    };

    return this.getOne('episode', id, url, options) as Observable<
      TheRickAndMorty.Episode
    >;
  }

  getLocation(
    id?: number | string,
    url?: string
  ): Observable<TheRickAndMorty.Location> {
    const options = {
      headers: this.headers,
    };

    return this.getOne('location', id, url, options) as Observable<
      TheRickAndMorty.Location
    >;
  }

  searchCharacter(
    name: string,
    page: number | string = 1,
    status?: TheRickAndMorty.CharacterStatus,
    species?: string,
    gender?: TheRickAndMorty.CharacterGender
  ): Observable<TheRickAndMorty.ResponseWithInfo> {
    const params = new HttpParams()
      .append('page', page.toString())
      .append('name', name.toString());

    if (status) params.append('status', status);
    if (species) params.append('species', species);
    if (gender) params.append('gender', gender);

    const options = {
      headers: this.headers,
      params: params,
    };
    return this.resources.pipe(
      distinctUntilChanged(),
      map((resources) =>
        this.http.get<TheRickAndMorty.ResponseWithInfo>(
          `${resources['characters']}/`,
          options
        )
      ),
      mergeAll(),
      shareReplay()
    );
  }

  searchEpisode(name: string, page: number | string = 1, episode?: string) {
    const params = new HttpParams()
      .append('page', page.toString())
      .append('name', name.toString());
    if (episode) params.append('episode', episode);

    const options = {
      headers: this.headers,
      params: params,
    };

    return this.resources.pipe(
      distinctUntilChanged(),
      map((resources) =>
        this.http.get<TheRickAndMorty.ResponseWithInfo>(
          `${resources['episodes']}/`,
          options
        )
      ),
      mergeAll(),
      shareReplay()
    );
  }

  searchLocation(
    name: string,
    page: number | string = 1,
    type?: string,
    dimension?: string
  ) {
    const params = new HttpParams()
      .append('page', page.toString())
      .append('name', name.toString());
    if (type) params.append('type', type);
    if (dimension) params.append('dimension', dimension);

    const options = {
      headers: this.headers,
      params: params,
    };

    return this.resources.pipe(
      distinctUntilChanged(),
      map((resources) =>
        this.http.get<TheRickAndMorty.ResponseWithInfo>(
          `${resources['locations']}/`,
          options
        )
      ),
      mergeAll(),
      shareReplay()
    );
  }

  searchCharacterByName(
    name: string,
    page: number | string = 1
  ): Observable<TheRickAndMorty.ResponseWithInfo> {
    return this.searchCharacter(name, page);
  }

  searchEpisodeByName(
    name: string,
    page: number | string = 1
  ): Observable<TheRickAndMorty.ResponseWithInfo> {
    return this.searchEpisode(name, page);
  }

  searchLocationByName(
    name: string,
    page: number
  ): Observable<TheRickAndMorty.ResponseWithInfo> {
    return this.searchLocation(name, page);
  }

  search(url: string): Observable<TheRickAndMorty.ResponseWithInfo> {
    const options = {
      headers: this.headers,
    };

    return this.http
      .get<TheRickAndMorty.ResponseWithInfo>(url, options)
      .pipe(shareReplay());
  }
}
