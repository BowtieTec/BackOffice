import {ComponentFixture, TestBed} from '@angular/core/testing'

import {StationaryCourtesyComponent} from './stationary-courtesy.component'

describe('StationaryCourtesyComponent', () => {
  let component: StationaryCourtesyComponent
  let fixture: ComponentFixture<StationaryCourtesyComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StationaryCourtesyComponent]
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(StationaryCourtesyComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
