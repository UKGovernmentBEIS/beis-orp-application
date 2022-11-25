import {
  ArgumentMetadata,
  Injectable,
  PipeTransform,
  Render,
  UsePipes,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { ValidationException } from './types';

@Injectable()
export class ValidationPipe implements PipeTransform {
  constructor(private readonly template: string) {}

  async transform(model: any, { metatype }: ArgumentMetadata) {
    if (
      !metatype ||
      [String, Boolean, Number, Array, Object].includes(metatype as any)
    ) {
      return model;
    }
    const object = plainToClass(metatype, model);
    const errors = await validate(object);
    if (errors.length > 0) {
      throw new ValidationException(this.template, { model, errors });
    }
    return object;
  }
}

export function ValidateAndRender(
  invalidTemplate: string,
  validTemplate: string,
) {
  return function (
    target: any,
    propertyKey: string | symbol,
    descriptor: any,
  ): void {
    Render(validTemplate)(target, propertyKey, descriptor);
    UsePipes(new ValidationPipe(invalidTemplate))(
      target,
      propertyKey,
      descriptor,
    );
  };
}
