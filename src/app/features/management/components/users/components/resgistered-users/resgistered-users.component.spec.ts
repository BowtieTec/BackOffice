import {ComponentFixture, TestBed} from '@angular/core/testing'

import {ResgisteredUsersComponent} from './resgistered-users.component'

describe('ResgisteredUsersComponent', () => {
  let component: ResgisteredUsersComponent
  let fixture: ComponentFixture<ResgisteredUsersComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ResgisteredUsersComponent]
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(ResgisteredUsersComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
