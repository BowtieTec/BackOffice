import {ComponentFixture, TestBed} from '@angular/core/testing'

import {ScheduleRanksTariffFormComponent} from './schedule-ranks-tariff-form.component'

describe('ScheduleRanksTariffFormComponent', () => {
  let component: ScheduleRanksTariffFormComponent
  let fixture: ComponentFixture<ScheduleRanksTariffFormComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ScheduleRanksTariffFormComponent]
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(ScheduleRanksTariffFormComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
