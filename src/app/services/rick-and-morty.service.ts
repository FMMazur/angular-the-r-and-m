import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import {
  shareReplay,
  map,
  tap,
  mergeAll,
  share,
  refCount,
  distinct,
  distinctUntilChanged,
  debounceTime,
} from 'rxjs/operators';

import { TheRickAndMorty } from '../types/rick-and-morty';

@Injectable({
  providedIn: 'root',
})
export class RickAndMortyService {
  static readonly API_URL = 'https://rickandmortyapi.com/api/';
  resources: Observable<TheRickAndMorty.Resources>;

  constructor(private http: HttpClient) {
    this.resources = this.getResources();
  }

  getResources(): Observable<TheRickAndMorty.Resources> {
    return this.http
      .get<TheRickAndMorty.Resources>(RickAndMortyService.API_URL)
      .pipe(shareReplay());
  }

  getCharacters(page?: number): Observable<TheRickAndMorty.ResponseWithInfo> {
    return this.resources.pipe(
      map((resources) =>
        this.http.get<TheRickAndMorty.ResponseWithInfo>(
          `${resources['characters']}/${page || ''}`
        )
      ),
      mergeAll(),
      tap(c => console.log(c))
    );
  }

  getCharacter(id: number): Observable<TheRickAndMorty.Character> {
    return this.resources.pipe(
      map((resources) =>
        this.http.get<TheRickAndMorty.Character>(
          `${resources['characters']}/${id}`
        )
      ),
      mergeAll()
    );
  }

  searchCharacterByName(name: string) {
    return this.resources.pipe(
      debounceTime(400),
      distinctUntilChanged(),
      map((resources) =>
        this.http.get<TheRickAndMorty.ResponseWithInfo>(
          `${resources['characters']}/?name=${name}`
        )
      ),
      mergeAll()
    );
  }
}
