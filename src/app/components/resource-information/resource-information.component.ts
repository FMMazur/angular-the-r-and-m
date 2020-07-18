import { Component, OnInit } from '@angular/core';
import { Input } from "@angular/core";
import { TheRickAndMorty } from '../../types/rick-and-morty';

@Component({
  selector: 'resource-information',
  templateUrl: './resource-information.component.html',
  styleUrls: ['./resource-information.component.scss']
})
export class ResourceInformationComponent implements OnInit {
  @Input() information: TheRickAndMorty.Type;
  constructor() { }

  ngOnInit(): void {
  }

}
