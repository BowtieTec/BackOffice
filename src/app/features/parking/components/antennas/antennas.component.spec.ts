import {ComponentFixture, TestBed} from '@angular/core/testing'

import {AntennasComponent} from './antennas.component'

describe('StepFiveComponent', () => {
  let component: AntennasComponent
  let fixture: ComponentFixture<AntennasComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AntennasComponent]
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(AntennasComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
