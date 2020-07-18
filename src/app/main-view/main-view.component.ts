import { TheRickAndMorty } from './../types/rick-and-morty.d';
import { RickAndMortyService } from './../services/rick-and-morty.service';
import { Component, OnInit } from '@angular/core';
import { shareReplay, map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
  selector: 'main-view',
  templateUrl: './main-view.component.html',
  styleUrls: ['./main-view.component.scss'],
})
export class MainViewComponent implements OnInit {
  constructor(private rickAndMortyService: RickAndMortyService) {}
  resources: TheRickAndMorty.Resources;
  result: Observable<TheRickAndMorty.Response>;

  async ngOnInit() {
    this.resources = await this.rickAndMortyService.getResources().toPromise();
    this.result = this.showInfo();
  }

  showInfo() {
    return this.rickAndMortyService
      .getCharacters()
      .pipe(map(response => response))
      // .pipe(shareReplay())
  }
}
