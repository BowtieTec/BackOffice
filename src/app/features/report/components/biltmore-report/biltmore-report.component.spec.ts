import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BiltmoreReportComponent } from './biltmore-report.component';

describe('BiltmoreReportComponent', () => {
  let component: BiltmoreReportComponent;
  let fixture: ComponentFixture<BiltmoreReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BiltmoreReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BiltmoreReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
