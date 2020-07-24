import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MainViewPageRoutingModule } from './main-view-routing.module';

import { MainViewPage } from './main-view.page';
import { AccordionComponent } from '../components/accordion/accordion.component';
import { AccordionItemComponent } from '../components/accordion/item/item.component';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, MainViewPageRoutingModule],
  declarations: [MainViewPage, AccordionComponent, AccordionItemComponent],
})
export class MainViewPageModule {}
