import { Component, OnInit, Input } from '@angular/core';
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';
import { TheRickAndMorty } from '../../../types/rick-and-morty.d';
import { isOf } from '../../../../utils/typeguard';

@Component({
  selector: 'accordion-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss'],
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
      ,
      transition('default <=> rotated', animate('250ms')),
    ]),
  ],
})
export class AccordionItemComponent implements OnInit {
  @Input() information: TheRickAndMorty.Type;
  show = false;
  constructor() {}

  ngOnInit(): void {}

  checkType(): TheRickAndMorty.TypeString | null {
    if (isOf<TheRickAndMorty.Character>(this.information, 'location'))
      return 'character';
    if (isOf<TheRickAndMorty.Episode>(this.information, 'air_date'))
      return 'episode';
    if (isOf<TheRickAndMorty.Location>(this.information, 'dimension'))
      return 'location';

    return null;
  }

  toggle() {
    this.show = !this.show;
  }
}
