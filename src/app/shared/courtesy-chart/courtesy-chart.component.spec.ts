import {ComponentFixture, TestBed} from '@angular/core/testing'

import {CourtesyChartComponent} from './courtesy-chart.component'

describe('CourtesyChartComponent', () => {
  let component: CourtesyChartComponent
  let fixture: ComponentFixture<CourtesyChartComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CourtesyChartComponent]
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(CourtesyChartComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
