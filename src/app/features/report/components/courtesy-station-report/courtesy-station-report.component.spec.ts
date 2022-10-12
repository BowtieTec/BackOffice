import {ComponentFixture, TestBed} from '@angular/core/testing'

import {CourtesyStationReportComponent} from './courtesy-station-report.component'

describe('DiscountReportComponent', () => {
  let component: CourtesyStationReportComponent
  let fixture: ComponentFixture<CourtesyStationReportComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CourtesyStationReportComponent]
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(CourtesyStationReportComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
