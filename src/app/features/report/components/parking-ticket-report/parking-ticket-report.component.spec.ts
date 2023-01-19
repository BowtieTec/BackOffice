import {ComponentFixture, TestBed} from '@angular/core/testing'

import {ParkingTicketReportComponent} from './parking-ticket-report.component'

describe('ParkingTicketReportComponent', () => {
  let component: ParkingTicketReportComponent
  let fixture: ComponentFixture<ParkingTicketReportComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ParkingTicketReportComponent]
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(ParkingTicketReportComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
