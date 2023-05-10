import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlacklistReportComponent } from './blacklist-report.component';

describe('BlacklistReportComponent', () => {
  let component: BlacklistReportComponent;
  let fixture: ComponentFixture<BlacklistReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BlacklistReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BlacklistReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
