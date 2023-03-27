import { registerDecorator, ValidationOptions } from 'class-validator';
import { topicsLeafMap } from '../document/utils/topics-leaf-map';

export function IsEndOfTopicPath(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'isTopics',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: any) {
          if (!value) return false;
          return !!topicsLeafMap[value];
        },
      },
    });
  };
}
