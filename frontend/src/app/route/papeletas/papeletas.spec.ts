import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Papeletas } from './papeletas';

describe('Papeletas', () => {
  let component: Papeletas;
  let fixture: ComponentFixture<Papeletas>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Papeletas]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Papeletas);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
