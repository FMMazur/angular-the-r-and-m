import { TheRickAndMorty } from '../../types/rick-and-morty.d';
import { RickAndMortyService } from '../../services/rick-and-morty.service';
import { Component, OnInit } from '@angular/core';
import {
  shareReplay,
  map,
  tap,
  filter,
  share,
  refCount,
  distinctUntilChanged,
  debounceTime,
  switchMap,
  catchError,
} from 'rxjs/operators';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'main-view',
  templateUrl: './main-view.component.html',
  styleUrls: ['./main-view.component.scss'],
})
export class MainViewComponent implements OnInit {
  constructor(private rickAndMortyService: RickAndMortyService) {}
  resources: Observable<TheRickAndMorty.Resources>;
  result: Observable<TheRickAndMorty.TypeArray>;
  information: Observable<TheRickAndMorty.Type>;
  searchType: TheRickAndMorty.searchType = "character";
  searchFailed: boolean = false;
  model: any;

  async ngOnInit() {
    this.resources = this.rickAndMortyService.resources;
    this.result = this.showInfo();
  }

  showInfo() {
    return this.rickAndMortyService.getCharacters().pipe(
      map((response) => response.results),
      shareReplay()
    );
  }

  search(text: Observable<string>) {
    text.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      switchMap((term) => {
        if (this.searchType === 'character') {
          return this.rickAndMortyService
            .searchCharacterByName(term)
            .pipe(tap(() => (this.searchFailed = false)),
            catchError(() => {
              this.searchFailed = true;
              return of([]);
            }));
        }
      })
    );
  }

  searchCharacter(id: number) {
    // if (!this.firstClick) this.firstClick = true;
    this.information = this.rickAndMortyService.getCharacter(id);
  }
}
