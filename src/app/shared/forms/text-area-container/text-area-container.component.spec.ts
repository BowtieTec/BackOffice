import {ComponentFixture, TestBed} from '@angular/core/testing'

import {TextAreaContainerComponent} from './text-area-container.component'

describe('TextAreaContainerComponent', () => {
  let component: TextAreaContainerComponent
  let fixture: ComponentFixture<TextAreaContainerComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TextAreaContainerComponent]
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(TextAreaContainerComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
