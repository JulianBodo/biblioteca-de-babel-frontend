
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';

import { BookList } from './book-list';
import { BookService } from '../../shared/services/book.service';
import { LoanService } from '../../shared/services/loan.service';

describe('BookList', () => {
  let component: BookList;
  let fixture: ComponentFixture<BookList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookList],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        {
          provide: BookService,
          useValue: {
            getBooks: () => of([]),
          },
        },
        {
          provide: LoanService,
          useValue: {},
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(BookList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
