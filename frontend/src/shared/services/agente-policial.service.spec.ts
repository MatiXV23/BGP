import { TestBed } from '@angular/core/testing';

import { AgentePolicialService } from './agente-policial.service';

describe('AgentePolicialService', () => {
  let service: AgentePolicialService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AgentePolicialService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
