import {ComponentFixture, TestBed} from '@angular/core/testing'

import {DurationReportComponent} from './duration-report.component'

describe('DurationReportComponent', () => {
  let component: DurationReportComponent
  let fixture: ComponentFixture<DurationReportComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DurationReportComponent]
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(DurationReportComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
