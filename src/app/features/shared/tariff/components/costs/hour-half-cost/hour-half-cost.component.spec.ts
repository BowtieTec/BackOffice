import {ComponentFixture, TestBed} from '@angular/core/testing'

import {HourHalfCostComponent} from './hour-half-cost.component'

describe('HourHalfCostComponent', () => {
  let component: HourHalfCostComponent
  let fixture: ComponentFixture<HourHalfCostComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HourHalfCostComponent]
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(HourHalfCostComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
