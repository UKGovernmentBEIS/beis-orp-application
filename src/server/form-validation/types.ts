export type ValidationErrorsForView = Record<string, string>;
export interface ViewModel<T> {
  model: T;
  errors?: ValidationErrorsForView;
  returnPathOverride?: string;
}

export class FormValidationException<T = any> extends Error {
  constructor(public readonly viewModel: ViewModel<T>) {
    super('validation error');
  }
}

export class FileValidationException extends Error {
  constructor(
    public readonly errors: string,
    public readonly template: string,
  ) {
    super('file validation error');
  }
}
