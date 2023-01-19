import {ComponentFixture, TestBed} from '@angular/core/testing'

import {AntennasFromCourtesyComponent} from './antennas-from-courtesy.component'

describe('AntennasFromCourtesyComponent', () => {
  let component: AntennasFromCourtesyComponent
  let fixture: ComponentFixture<AntennasFromCourtesyComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AntennasFromCourtesyComponent]
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(AntennasFromCourtesyComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
