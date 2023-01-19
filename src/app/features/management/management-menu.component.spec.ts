import {ComponentFixture, TestBed} from '@angular/core/testing'

import {ManagementMenuComponent} from './management-menu.component'

describe('ManagmentComponent', () => {
  let component: ManagementMenuComponent
  let fixture: ComponentFixture<ManagementMenuComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ManagementMenuComponent]
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagementMenuComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
