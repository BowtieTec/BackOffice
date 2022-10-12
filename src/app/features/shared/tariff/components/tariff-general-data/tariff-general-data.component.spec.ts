import {ComponentFixture, TestBed} from '@angular/core/testing'

import {TariffGeneralDataComponent} from './tariff-general-data.component'

describe('TariffGeneralDataComponent', () => {
  let component: TariffGeneralDataComponent
  let fixture: ComponentFixture<TariffGeneralDataComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TariffGeneralDataComponent]
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(TariffGeneralDataComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
