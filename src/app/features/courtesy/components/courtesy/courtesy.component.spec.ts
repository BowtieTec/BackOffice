import {ComponentFixture, TestBed} from '@angular/core/testing'

import {CourtesyComponent} from './courtesy.component'

describe('CourtesyComponent', () => {
  let component: CourtesyComponent
  let fixture: ComponentFixture<CourtesyComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CourtesyComponent]
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(CourtesyComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
