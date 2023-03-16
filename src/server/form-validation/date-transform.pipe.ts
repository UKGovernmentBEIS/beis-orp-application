import { Injectable, PipeTransform } from '@nestjs/common';

const daysForMonth = {
  '01': '31',
  '02': '28',
  '03': '31',
  '04': '30',
  '05': '31',
  '06': '30',
  '07': '31',
  '08': '31',
  '09': '30',
  '10': '31',
  '11': '30',
  '12': '31',
};
@Injectable()
export class DateTransformPipe implements PipeTransform {
  private getDateField(fieldKey: string): string {
    if (fieldKey.includes('-day')) return 'day';
    if (fieldKey.includes('-month')) return 'month';
    if (fieldKey.includes('-year')) return 'year';
    return '';
  }
  transform(value: Record<string, string | number>): any {
    const dateFields = Object.keys(value).filter(this.getDateField);
    const groupedDateFields = dateFields.reduce((groupedFields, field) => {
      const key = field.slice(0, field.lastIndexOf('-'));
      return {
        ...groupedFields,
        [key]: {
          ...groupedFields[key],
          [this.getDateField(field)]: value[field],
        },
      };
    }, {});

    return Object.keys(groupedDateFields).reduce((mergedValue, dateKey) => {
      const { day, month, year } = groupedDateFields[dateKey];
      const isFromDate = dateKey.toLowerCase().includes('from');
      const isToDate = dateKey.toLowerCase().includes('to');

      if (!year) return mergedValue;

      const sanitisedMonth = month
        ? month
        : isFromDate
        ? '01'
        : isToDate
        ? '12'
        : null;
      const santitisedDay = day
        ? day
        : isFromDate
        ? '01'
        : isToDate
        ? daysForMonth[sanitisedMonth]
        : null;

      if (!santitisedDay || !sanitisedMonth || !year) return mergedValue;

      const paddedDay = String(santitisedDay).padStart(2, '0');
      const paddedMonth = String(sanitisedMonth).padStart(2, '0');

      return {
        ...mergedValue,
        [`${dateKey}Date`]: `${year}-${paddedMonth}-${paddedDay}`,
      };
    }, value);
  }
}
