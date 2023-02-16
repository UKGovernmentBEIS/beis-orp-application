import { Injectable, PipeTransform } from '@nestjs/common';

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
      if (!day || !month || !year) return mergedValue;

      const paddedDay = String(day).padStart(2, '0');
      const paddedMonth = String(month).padStart(2, '0');

      return {
        ...mergedValue,
        [`${dateKey}Date`]: `${year}-${paddedMonth}-${paddedDay}`,
      };
    }, value);
  }
}
