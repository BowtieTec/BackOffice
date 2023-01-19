import {ComponentFixture, TestBed} from '@angular/core/testing'

import {ParkingDayReportComponent} from './parking-day-report.component'

describe('ParkingDayReportComponent', () => {
  let component: ParkingDayReportComponent
  let fixture: ComponentFixture<ParkingDayReportComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ParkingDayReportComponent]
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(ParkingDayReportComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
