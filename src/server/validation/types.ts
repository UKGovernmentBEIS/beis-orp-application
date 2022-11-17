import { ValidationError } from 'class-validator';

export interface ViewModel<T> {
  model: T;
  errors?: ValidationError[];
}

export class ValidationException<T = any> extends Error {
  constructor(
    public readonly template: string,
    public readonly viewModel: ViewModel<T>,
  ) {
    super('validation error');
  }
}
