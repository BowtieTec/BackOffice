import {ComponentFixture, TestBed} from '@angular/core/testing';

import {TransitDetailReportComponent} from './transit-detail-report.component';

describe('TransitDetailReportComponent', () => {
  let component: TransitDetailReportComponent;
  let fixture: ComponentFixture<TransitDetailReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TransitDetailReportComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(TransitDetailReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
