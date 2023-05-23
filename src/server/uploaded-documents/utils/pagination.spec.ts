import { getPaginationDetails } from './pagination';

describe('pagination', () => {
  it('should return PaginationDetail', () => {
    const response = getPaginationDetails(2, 30, 10);
    expect(response).toEqual({
      prevValue: 1,
      nextValue: 3,
      titlePostfix: ' (page 2 of 3)',
      totalPages: 3,
      pageOn: 2,
      pagesToShow: [1, 2, 3],
    });
  });

  it('should return return null prev value if on first page', () => {
    const response = getPaginationDetails(1, 30, 10);
    expect(response).toEqual({
      prevValue: null,
      nextValue: 2,
      titlePostfix: ' (page 1 of 3)',
      totalPages: 3,
      pageOn: 1,
      pagesToShow: [1, 2, 3],
    });
  });

  it('should default to first page', () => {
    const response = getPaginationDetails(undefined, 30, 10);
    expect(response).toEqual({
      prevValue: null,
      nextValue: 2,
      titlePostfix: ' (page 1 of 3)',
      totalPages: 3,
      pageOn: 1,
      pagesToShow: [1, 2, 3],
    });
  });

  it('should return null next value if on last page', () => {
    const response = getPaginationDetails(3, 30, 10);
    expect(response).toEqual({
      prevValue: 2,
      nextValue: null,
      titlePostfix: ' (page 3 of 3)',
      totalPages: 3,
      pageOn: 3,
      pagesToShow: [1, 2, 3],
    });
  });

  it('should return suitable detail when only one page', () => {
    const response = getPaginationDetails(1, 5, 10);
    expect(response).toEqual({
      prevValue: null,
      nextValue: null,
      titlePostfix: ' (page 1 of 1)',
      totalPages: 1,
      pageOn: 1,
      pagesToShow: [1],
    });
  });

  it('should split large page lists showing first, last and surrounding pages', () => {
    const response = getPaginationDetails(5, 100, 10);
    expect(response).toEqual({
      prevValue: 4,
      nextValue: 6,
      titlePostfix: ' (page 5 of 10)',
      totalPages: 10,
      pageOn: 5,
      pagesToShow: [1, null, 4, 5, 6, null, 10],
    });
  });

  it('should split large page lists showing first, last and surrounding pages when on first page', () => {
    const response = getPaginationDetails(1, 100, 10);
    expect(response).toEqual({
      prevValue: null,
      nextValue: 2,
      titlePostfix: ' (page 1 of 10)',
      totalPages: 10,
      pageOn: 1,
      pagesToShow: [1, 2, null, 10],
    });
  });

  it('should split large page lists showing first, last and surrounding pages when on last page', () => {
    const response = getPaginationDetails(10, 100, 10);
    expect(response).toEqual({
      prevValue: 9,
      nextValue: null,
      titlePostfix: ' (page 10 of 10)',
      totalPages: 10,
      pageOn: 10,
      pagesToShow: [1, null, 9, 10],
    });
  });
});
