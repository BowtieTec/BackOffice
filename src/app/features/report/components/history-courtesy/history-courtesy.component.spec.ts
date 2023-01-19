import {ComponentFixture, TestBed} from '@angular/core/testing';

import {HistoryCourtesyComponent} from './history-courtesy.component';

describe('HistoryCourtesyComponent', () => {
  let component: HistoryCourtesyComponent;
  let fixture: ComponentFixture<HistoryCourtesyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HistoryCourtesyComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(HistoryCourtesyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
