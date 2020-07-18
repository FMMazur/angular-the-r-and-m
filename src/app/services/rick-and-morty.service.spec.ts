/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { RickAndMortyService } from './rick-and-morty.service';

describe('Service: RickAndMorty', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RickAndMortyService]
    });
  });

  it('should ...', inject([RickAndMortyService], (service: RickAndMortyService) => {
    expect(service).toBeTruthy();
  }));
});
