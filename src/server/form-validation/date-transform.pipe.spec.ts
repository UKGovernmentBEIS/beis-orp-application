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
});
