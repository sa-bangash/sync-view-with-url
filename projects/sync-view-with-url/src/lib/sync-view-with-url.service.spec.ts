import { TestBed } from '@angular/core/testing';

import { SyncViewWithUrlService } from './sync-view-with-url.service';

describe('SyncViewWithUrlService', () => {
  let service: SyncViewWithUrlService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SyncViewWithUrlService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
