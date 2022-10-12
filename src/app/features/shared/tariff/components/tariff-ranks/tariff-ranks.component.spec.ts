import {ComponentFixture, TestBed} from '@angular/core/testing'

import {TariffRanksComponent} from './tariff-ranks.component'

describe('TariffRanksComponent', () => {
  let component: TariffRanksComponent
  let fixture: ComponentFixture<TariffRanksComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TariffRanksComponent]
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(TariffRanksComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
