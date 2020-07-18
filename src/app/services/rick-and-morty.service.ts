import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { } from "rxjs/operators";

import { TheRickAndMorty } from '../types/rick-and-morty';

@Injectable({
  providedIn: 'root'
})
export class RickAndMortyService {
  static readonly API_URL = 'https://rickandmortyapi.com/api/';
  resources: TheRickAndMorty.resources;

  constructor(private http: HttpClient) {
    this.resources = this.http.get<TheRickAndMorty.resources>(RickAndMortyService.API_URL);
  }

}
