import { registerDecorator, ValidationOptions } from 'class-validator';

const urlPattern = new RegExp(
  '^(?:https?://)?(?:www.)?legislation.gov.uk(?:/.*)?$',
  'i',
);

export function IsLegislationDomainValidator(
  validationOptions?: ValidationOptions,
) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'IsGovDomain',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: string) {
          return urlPattern.test(value);
        },
      },
    });
  };
}
