import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReaderForm } from './reader-form';

describe('ReaderForm', () => {
  let component: ReaderForm;
  let fixture: ComponentFixture<ReaderForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReaderForm],
    }).compileComponents();

    fixture = TestBed.createComponent(ReaderForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
