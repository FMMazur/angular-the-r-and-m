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
import { TheRickAndMorty } from '../../types/rick-and-morty.d';

@Component({
  selector: 'main-view',
  templateUrl: './main-view.component.html',
  styleUrls: ['./main-view.component.scss'],
})
export class MainViewComponent implements OnInit {
  resources: Observable<TheRickAndMorty.Resources>;
  response:
    | Observable<TheRickAndMorty.ResponseWithInfo>
    | Observable<TheRickAndMorty.Response>;
  page: number = 1;

  search$ = new BehaviorSubject<string>('');
  searchType: TheRickAndMorty.TypeString = 'character';
  searching: boolean;
  searchFailed = false;
  searchString: string = '';

  constructor(private rickAndMortyService: RickAndMortyService) {}

  ngOnInit() {
    this.resources = this.rickAndMortyService.resources;
    this.response = this.showInfo();
  }

  showInfo() {
    return this.rickAndMortyService.getCharacters();
  }

  search = () => {
    this.search$
      .pipe(
        concatMapTo(of(this.searchString)),
        distinctUntilChanged(),
        tap(() => {
          this.searching = true;
          this.page = 1;
        }),
        switchMap((term) => {
          let response: Observable<TheRickAndMorty.ResponseWithInfo>;
          if (this.searchType === 'character') {
            response = this.rickAndMortyService.searchCharacterByName(
              term,
              this.page
            );
          } else if (this.searchType === 'episode') {
            response = this.rickAndMortyService.searchEpisodeByName(
              term,
              this.page
            );
          } else if (this.searchType === 'location') {
            response = this.rickAndMortyService.searchLocationByName(
              term,
              this.page
            );
          }

          return response.pipe(
            tap(() => {
              this.searchFailed = false;
            }),
            map((response) => (this.response = of(response))),
            catchError((err) => {
              if (err) this.searchFailed = true;
              return of([]);
            }),
            retry(2)
          );
        }),
        mergeAll(),
        tap(() => (this.searching = false))
      )
      .subscribe();
  };

  onChangeSearchType() {
    console.log(this.searchType);
  }

  pageSearch(type: 'prev' | 'next') {
    this.search$
      .pipe(
        concatMapTo(this.response),
        tap(() => (this.searching = true)),
        switchMap((response: TheRickAndMorty.ResponseWithInfo) => {
          return this.rickAndMortyService.search(response.info[type]).pipe(
            tap(() => {
              this.searchFailed = false;
            }),
            map((response) => (this.response = of(response))),
            catchError((err) => {
              if (err) this.searchFailed = true;
              return of([]);
            }),
            retry(2)
          );
        }),
        mergeAll(),
        tap(() => (this.searching = false))
      )
      .subscribe();
  }

  nextPage() {
    ++this.page;
    this.pageSearch('next');
  }

  prevPage() {
    --this.page;
    this.pageSearch('prev');
  }
}
