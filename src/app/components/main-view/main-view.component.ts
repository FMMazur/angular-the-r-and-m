import { TheRickAndMorty } from '../../types/rick-and-morty.d';
import { Component, OnInit } from '@angular/core';
import { Observable, of, BehaviorSubject } from 'rxjs';
import {
  shareReplay,
  map,
  tap,
  distinctUntilChanged,
  switchMap,
  catchError,
  mergeAll,
  concatMapTo,
} from 'rxjs/operators';

import { RickAndMortyService } from '../../services/rick-and-morty.service';

@Component({
  selector: 'main-view',
  templateUrl: './main-view.component.html',
  styleUrls: ['./main-view.component.scss'],
})
export class MainViewComponent implements OnInit {
  searching: boolean;
  resources: Observable<TheRickAndMorty.Resources>;
  response: Observable<TheRickAndMorty.ResponseWithInfo> | Observable<TheRickAndMorty.Response>;
  information: Observable<TheRickAndMorty.Type>;
  page: number | null;

  search$ = new BehaviorSubject<string>('');
  searchType: TheRickAndMorty.searchType = 'character';
  searchFailed = false;
  searchString: string;

  constructor(private rickAndMortyService: RickAndMortyService) {}

  ngOnInit() {
    this.resources = this.rickAndMortyService.resources;
    // this.result = this.showInfo();
  }

  showInfo() {
    return this.rickAndMortyService.getCharacters().pipe(
      map((response) => response.results),
      shareReplay()
    );
  }

  search = () => {
    this.search$.pipe(
      concatMapTo(of(this.searchString)),
      distinctUntilChanged(),
      tap(() => this.searching = true),
      switchMap((term) => {
        if (this.searchType === 'character') {
          return this.rickAndMortyService.searchCharacterByName(term).pipe(
            tap(() => {
              this.searchFailed = false;
              this.page += 1;
            }),
            map((response) => (this.response = of(response))),
            catchError(() => {
              this.searchFailed = true;
              return of([]);
            })
          );
        }
      }),
      mergeAll(),
      tap(() => this.searching = false)
    ).subscribe();
  };

  searchCharacter(id: number) {
    this.information = this.rickAndMortyService.getCharacter(id);
  }
}
