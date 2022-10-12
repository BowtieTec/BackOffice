import {ComponentFixture, TestBed} from '@angular/core/testing'

import {CourtesyReportComponent} from './courtesy-report.component'

describe('DiscountReportComponent', () => {
  let component: CourtesyReportComponent
  let fixture: ComponentFixture<CourtesyReportComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CourtesyReportComponent]
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(CourtesyReportComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
