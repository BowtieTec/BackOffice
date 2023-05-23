import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowCourtesiesComponent } from './show-courtesies.component';

describe('ShowCourtesiesComponent', () => {
  let component: ShowCourtesiesComponent;
  let fixture: ComponentFixture<ShowCourtesiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowCourtesiesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShowCourtesiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
