import { TestBed, inject } from '@angular/core/testing';

import { SerCreateService } from './ser-create.service';

describe('SerCreateService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SerCreateService]
    });
  });

  it('should be created', inject([SerCreateService], (service: SerCreateService) => {
    expect(service).toBeTruthy();
  }));
});
