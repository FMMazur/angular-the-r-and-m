import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MainViewPage } from './main-view.page';

describe('MainViewPage', () => {
  let component: MainViewPage;
  let fixture: ComponentFixture<MainViewPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MainViewPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MainViewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
