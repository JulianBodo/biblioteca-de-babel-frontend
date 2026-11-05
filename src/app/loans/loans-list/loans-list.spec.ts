import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { LoansList } from './loans-list';

describe('LoansList', () => {
  let component: LoansList;
  let fixture: ComponentFixture<LoansList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoansList],
      providers: [
        provideRouter([]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoansList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
