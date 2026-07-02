import { TestBed } from '@angular/core/testing';

import { PapeletaService } from './papeleta.service';

describe('PapeletaService', () => {
  let service: PapeletaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PapeletaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
