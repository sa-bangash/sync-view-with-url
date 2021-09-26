import { TestBed } from '@angular/core/testing';

import { SyncParamBuilderService } from './sync-param-builder';

describe('SyncParamBuilderService', () => {
  let service: SyncParamBuilderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SyncParamBuilderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
