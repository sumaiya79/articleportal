import { TestBed, inject } from '@angular/core/testing';

import { SerListingService } from './ser-listing.service';

describe('SerListingService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SerListingService]
    });
  });

  it('should be created', inject([SerListingService], (service: SerListingService) => {
    expect(service).toBeTruthy();
  }));
});
