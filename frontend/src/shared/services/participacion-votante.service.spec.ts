import { TestBed } from '@angular/core/testing';

import { ParticipacionVotanteService } from './participacion-votante.service';

describe('ParticipacionVotanteService', () => {
  let service: ParticipacionVotanteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ParticipacionVotanteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
