import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Readers } from './readers';

describe('Readers', () => {
  let component: Readers;
  let fixture: ComponentFixture<Readers>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Readers],
    }).compileComponents();

    fixture = TestBed.createComponent(Readers);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
