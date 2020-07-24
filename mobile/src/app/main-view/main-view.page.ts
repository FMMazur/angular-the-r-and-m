import { Component, OnInit, ViewChild } from '@angular/core';
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';

import { Observable, of, BehaviorSubject, Subscription } from 'rxjs';
import {
  map,
  tap,
  distinctUntilChanged,
  switchMap,
  catchError,
  mergeAll,
  concatMapTo,
  retry,
} from 'rxjs/operators';

import { RickAndMortyService } from '../services/rick-and-morty.service';
import { TheRickAndMorty } from '../types/rick-and-morty';
import { isOf } from 'src/utils/typeguard';

@Component({
  selector: 'app-main-view',
  templateUrl: './main-view.page.html',
  styleUrls: ['./main-view.page.scss'],
  animations: [
    trigger('smoothCollapse', [
      state(
        'initial',
        style({
          height: '0',
          overflow: 'hidden',
          opacity: '0',
          visibility: 'hidden',
        })
      ),
      state(
        'final',
        style({
          overflow: 'hidden',
        })
      ),
      transition('initial<=>final', animate('250ms')),
    ]),
    trigger('rotatedState', [
      state(
        'default',
        style({
          transform: 'rotate(0)',
        })
      ),
      state(
        'rotated',
        style({
          transform: 'rotate(90deg)',
        })
      ),
      transition('default<=>rotated', animate('250ms')),
    ]),
  ],
})
export class MainViewPage implements OnInit {
  resources: Observable<TheRickAndMorty.Resources>;
  response:
    | Observable<TheRickAndMorty.ResponseWithInfo>
    | Observable<TheRickAndMorty.Response>;
  page: number = 1;

  search$ = new BehaviorSubject<string>('');
  searchSubscription: Subscription;
  searchType: TheRickAndMorty.TypeString = 'character';
  searching: boolean;
  searchFailed = false;
  searchString: string = '';

  // Animations options
  showOptions = false;

  constructor(private rickAndMortyService: RickAndMortyService) {}

  ngOnInit() {
    this.resources = this.rickAndMortyService.resources;
    this.response = this.rickAndMortyService.getCharacters(1);
  }

  input(event: any) {
    this.searchString = event.detail.value;
    this.search();
  }

  search = () => {
    if (this.searchSubscription) this.searchSubscription.unsubscribe();

    this.searchSubscription = this.search$
      .pipe(
        concatMapTo(of(this.searchString.trim())),
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
              if (err) {
                this.searchFailed = true;
              }

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

  pageSearch(type: 'prev' | 'next') {
    this.search$
      .pipe(
        concatMapTo(this.response),
        tap(() => (this.searching = true)),
        switchMap((response: TheRickAndMorty.ResponseWithInfo) => {
          return this.rickAndMortyService.search(response.info[type]).pipe(
            tap(() => (this.searchFailed = false)),
            tap((response) => (this.response = of(response))),
            catchError((err) => {
              if (err) this.searchFailed = true;
              return of([]);
            }),
            retry(2)
          );
        }),
        tap(() => (this.searching = false))
      )
      .subscribe();
  }

  changeRadioOptions() {
    this.search();
  }

  toggleOptions() {
    this.showOptions = !this.showOptions;
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
