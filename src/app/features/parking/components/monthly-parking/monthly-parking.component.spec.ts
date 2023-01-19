import {ComponentFixture, TestBed} from '@angular/core/testing'

import {MonthlyParkingComponent} from './monthly-parking.component'

describe('MonthlyParkingComponent', () => {
  let component: MonthlyParkingComponent
  let fixture: ComponentFixture<MonthlyParkingComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MonthlyParkingComponent]
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(MonthlyParkingComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
