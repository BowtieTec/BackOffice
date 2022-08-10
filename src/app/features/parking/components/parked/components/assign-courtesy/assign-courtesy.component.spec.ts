import {ComponentFixture, TestBed} from '@angular/core/testing';

import {AssignCourtesyComponent} from './assign-courtesy.component';

describe('AssignCourtesyComponent', () => {
  let component: AssignCourtesyComponent;
  let fixture: ComponentFixture<AssignCourtesyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AssignCourtesyComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(AssignCourtesyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
