import {TestBed} from '@angular/core/testing';

import {ListCheckboxService} from './list-checkbox.service';

describe('ListCheckboxService', () => {
  let service: ListCheckboxService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ListCheckboxService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
