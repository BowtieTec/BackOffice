import {TestBed} from '@angular/core/testing'

import {BuildRulesService} from './build-rules.service'

describe('BuildRulesService', () => {
  let service: BuildRulesService

  beforeEach(() => {
    TestBed.configureTestingModule({})
    service = TestBed.inject(BuildRulesService)
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })
})
