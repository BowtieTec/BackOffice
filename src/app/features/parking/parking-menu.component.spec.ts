import {ComponentFixture, TestBed} from '@angular/core/testing'

import {ParkingMenuComponent} from './parking-menu.component'

describe('ParkingMenuComponent', () => {
  let component: ParkingMenuComponent
  let fixture: ComponentFixture<ParkingMenuComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ParkingMenuComponent]
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(ParkingMenuComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
