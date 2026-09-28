import { TestBed } from '@angular/core/testing';

import { CompositionTreeService } from './composition-tree.service';

describe('CompositionTreeService', () => {
  let service: CompositionTreeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CompositionTreeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
