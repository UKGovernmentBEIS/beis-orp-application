import {
  ArgumentMetadata,
  Injectable,
  PipeTransform,
  UsePipes,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { FormValidationException, ValidationErrorsForView } from './types';

@Injectable()
export class FormValidationPipe implements PipeTransform {
  async transform(model: any, { metatype }: ArgumentMetadata) {
    if (
      !metatype ||
      [String, Boolean, Number, Array, Object].includes(metatype as any)
    ) {
      return model;
    }
    const object = plainToInstance(metatype, model);
    const rawErrors = await validate(object);
    if (rawErrors.length === 0) {
      return object;
    }
    const errors = rawErrors.reduce<ValidationErrorsForView>(
      (acc, er) => ({
        ...acc,
        [er.property]: Object.values(er.constraints)[0],
      }),
      {},
    );

    throw new FormValidationException({ model, errors });
  }
}

export function ValidateForm() {
  return function (
    target: any,
    propertyKey: string | symbol,
    descriptor: any,
  ): void {
    UsePipes(new FormValidationPipe())(target, propertyKey, descriptor);
  };
}
