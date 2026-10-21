import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReadersList } from './readers-list';

describe('ReadersList', () => {
  let component: ReadersList;
  let fixture: ComponentFixture<ReadersList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReadersList],
    }).compileComponents();

    fixture = TestBed.createComponent(ReadersList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
