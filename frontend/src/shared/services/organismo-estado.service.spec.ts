import { TestBed } from '@angular/core/testing';

import { OrganismoEstadoService } from './organismo-estado.service';

describe('OrganismoEstadoService', () => {
  let service: OrganismoEstadoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OrganismoEstadoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
