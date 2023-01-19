import {TestBed} from '@angular/core/testing';

import {IssueLogService} from './issue-log.service';

describe('IssueLogService', () => {
  let service: IssueLogService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IssueLogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
