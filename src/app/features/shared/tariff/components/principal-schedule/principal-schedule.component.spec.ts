import {ComponentFixture, TestBed} from '@angular/core/testing'

import {PrincipalScheduleComponent} from './principal-schedule.component'

describe('PrincipalScheduleComponent', () => {
  let component: PrincipalScheduleComponent
  let fixture: ComponentFixture<PrincipalScheduleComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PrincipalScheduleComponent]
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(PrincipalScheduleComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
