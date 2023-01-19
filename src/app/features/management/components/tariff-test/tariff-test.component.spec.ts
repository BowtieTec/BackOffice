import {ComponentFixture, TestBed} from '@angular/core/testing'

import {TariffTestComponent} from './tariff-test.component'

describe('TariffTestComponent', () => {
  let component: TariffTestComponent
  let fixture: ComponentFixture<TariffTestComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TariffTestComponent]
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(TariffTestComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
