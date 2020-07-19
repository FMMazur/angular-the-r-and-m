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
  retry,
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
  response:
    | Observable<TheRickAndMorty.ResponseWithInfo>
    | Observable<TheRickAndMorty.Response>;
  information: Observable<TheRickAndMorty.Type>;
  page: number = 1;

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
    this.search$
      .pipe(
        concatMapTo(of(this.searchString)),
        distinctUntilChanged(),
        tap(() => (this.searching = true)),
        switchMap((term) => {
          if (this.searchType === 'character') {
            return this.rickAndMortyService
              .searchCharacterByName(term, this.page)
              .pipe(
                tap(() => {
                  this.searchFailed = false;
                }),
                map((response) => (this.response = of(response))),
                catchError(() => {
                  this.searchFailed = true;
                  return of([]);
                }),
                retry(2)
              );
          }
        }),
        mergeAll(),
        tap(() => (this.searching = false))
      )
      .subscribe();
  };

  searchCharacter(id: number) {
    this.information = this.rickAndMortyService.getCharacter(id);
  }

  nextPage() {
    this.page += 1;
    this.search();
  }
}
