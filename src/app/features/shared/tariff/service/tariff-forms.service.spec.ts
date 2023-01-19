import {TestBed} from '@angular/core/testing'

import {TariffFormsService} from './tariff-forms.service'

describe('TariffFormsService', () => {
  let service: TariffFormsService

  beforeEach(() => {
    TestBed.configureTestingModule({})
    service = TestBed.inject(TariffFormsService)
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })
})
