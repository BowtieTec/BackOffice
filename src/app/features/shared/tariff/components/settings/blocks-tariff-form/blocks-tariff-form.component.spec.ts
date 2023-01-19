import {ComponentFixture, TestBed} from '@angular/core/testing'

import {BlocksTariffFormComponent} from './blocks-tariff-form.component'

describe('BlocksTariffFormComponent', () => {
  let component: BlocksTariffFormComponent
  let fixture: ComponentFixture<BlocksTariffFormComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BlocksTariffFormComponent]
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(BlocksTariffFormComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
