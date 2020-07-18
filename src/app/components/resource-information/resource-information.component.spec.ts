import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourceInformationComponent } from './resource-information.component';

describe('ResourceInformationComponent', () => {
  let component: ResourceInformationComponent;
  let fixture: ComponentFixture<ResourceInformationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResourceInformationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResourceInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
