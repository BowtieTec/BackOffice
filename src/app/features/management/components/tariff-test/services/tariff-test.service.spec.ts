import {TestBed} from '@angular/core/testing'

import {TariffTestService} from './tariff-test.service'

describe('TariffTestService', () => {
  let service: TariffTestService

  beforeEach(() => {
    TestBed.configureTestingModule({})
    service = TestBed.inject(TariffTestService)
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })
})
