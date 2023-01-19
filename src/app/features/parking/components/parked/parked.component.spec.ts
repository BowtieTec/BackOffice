import {ComponentFixture, TestBed} from '@angular/core/testing'

import {ParkedComponent} from './parked.component'

describe('ParkingComponent', () => {
  let component: ParkedComponent
  let fixture: ComponentFixture<ParkedComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ParkedComponent]
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(ParkedComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
