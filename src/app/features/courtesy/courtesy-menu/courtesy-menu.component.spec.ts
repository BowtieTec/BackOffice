import {ComponentFixture, TestBed} from '@angular/core/testing'

import {CourtesyMenuComponent} from './courtesy-menu.component'

describe('CourtesyMenuComponent', () => {
  let component: CourtesyMenuComponent
  let fixture: ComponentFixture<CourtesyMenuComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CourtesyMenuComponent]
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(CourtesyMenuComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
