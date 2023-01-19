import {ComponentFixture, TestBed} from '@angular/core/testing'

import {HolidayTariffFormComponent} from './holiday-tariff-form.component'

describe('HolidayTariffFormComponent', () => {
  let component: HolidayTariffFormComponent
  let fixture: ComponentFixture<HolidayTariffFormComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HolidayTariffFormComponent]
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(HolidayTariffFormComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
