import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { shareReplay, map } from 'rxjs/operators';

import { TheRickAndMorty } from '../types/rick-and-morty';

@Injectable({
  providedIn: 'root',
})
export class RickAndMortyService {
  static readonly API_URL = 'https://rickandmortyapi.com/api/';
  resources: TheRickAndMorty.Resources;

  constructor(private http: HttpClient) {
    this.getResources().subscribe((resources) => (this.resources = resources));
  }

  getResources(): Observable<TheRickAndMorty.Resources> {
    return this.http
      .get<TheRickAndMorty.Resources>(RickAndMortyService.API_URL)
      .pipe(shareReplay());
  }

  getCharacters(page?: number): Observable<TheRickAndMorty.Response> {
    return this.http.get<TheRickAndMorty.Response>(
      `${this.resources['characters']}/${page || ''}`
    );
  }

  getCharacter(id: number): Observable<TheRickAndMorty.Response> {
    return this.http.get<TheRickAndMorty.Response>(
      `${this.resources['characters']}/${id}`
    );
  }
}
