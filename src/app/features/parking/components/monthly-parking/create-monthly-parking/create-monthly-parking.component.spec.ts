import {ComponentFixture, TestBed} from '@angular/core/testing'

import {CreateMonthlyParkingComponent} from './create-monthly-parking.component'

describe('CreateMonthlyParkingComponent', () => {
  let component: CreateMonthlyParkingComponent
  let fixture: ComponentFixture<CreateMonthlyParkingComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateMonthlyParkingComponent]
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateMonthlyParkingComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
