import { DateTransformPipe } from './date-transform.pipe';

describe('DateTransformPipe', () => {
  let pipe: DateTransformPipe;
  beforeEach(() => {
    pipe = new DateTransformPipe();
  });

  it('should add a date string variable from the 3 parts supplied', () => {
    const input = {
      'someDate-day': '12',
      'someDate-month': '03',
      'someDate-year': '1985',
    };
    const result = pipe.transform(input);
    expect(result).toEqual({
      ...input,
      someDateDate: '1985-03-12',
    });
  });

  it('should handle multiple dates', () => {
    const input = {
      'someDate-day': '12',
      'someDate-month': '03',
      'someDate-year': '1985',
      'someOtherDate-day': '13',
      'someOtherDate-month': '04',
      'someOtherDate-year': '1986',
    };
    const result = pipe.transform(input);
    expect(result).toEqual({
      ...input,
      someDateDate: '1985-03-12',
      someOtherDateDate: '1986-04-13',
    });
  });

  it('should return undefined if date is incomplete', () => {
    const input = {
      'someDate-day': '',
      'someDate-month': '03',
      'someDate-year': '1985',
    };
    const result = pipe.transform(input);
    expect(result).toEqual({
      ...input,
      someDateDate: undefined,
    });
  });

  it('should ensure day and month are 2 digits', () => {
    const input = {
      'someDate-day': '1',
      'someDate-month': '3',
      'someDate-year': '1985',
    };
    const result = pipe.transform(input);
    expect(result).toEqual({
      ...input,
      someDateDate: '1985-03-01',
    });
  });

  it('a From date should accept just a year', () => {
    const input = {
      'someFrom-day': '',
      'someFrom-month': '',
      'someFrom-year': '1985',
    };
    const result = pipe.transform(input);
    expect(result).toEqual({
      ...input,
      someFromDate: '1985-01-01',
    });
  });

  it('a From date should accept a year and month', () => {
    const input = {
      'someFrom-day': '',
      'someFrom-month': '04',
      'someFrom-year': '1985',
    };
    const result = pipe.transform(input);
    expect(result).toEqual({
      ...input,
      someFromDate: '1985-04-01',
    });
  });

  it('a To date should accept just a year', () => {
    const input = {
      'someTo-day': '',
      'someTo-month': '',
      'someTo-year': '1985',
    };
    const result = pipe.transform(input);
    expect(result).toEqual({
      ...input,
      someToDate: '1985-12-31',
    });
  });

  it('a To date should accept just a year', () => {
    const input = {
      'someTo-day': '',
      'someTo-month': '04',
      'someTo-year': '1985',
    };
    const result = pipe.transform(input);
    expect(result).toEqual({
      ...input,
      someToDate: '1985-04-30',
    });
  });
});
