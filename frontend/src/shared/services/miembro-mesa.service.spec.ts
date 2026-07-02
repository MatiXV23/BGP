import { TestBed } from '@angular/core/testing';

import { MiembroMesaService } from './miembro-mesa.service';

describe('MiembroMesaService', () => {
  let service: MiembroMesaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MiembroMesaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
