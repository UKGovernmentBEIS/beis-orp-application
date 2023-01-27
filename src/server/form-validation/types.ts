export type ValidationErrorsForView = Record<string, string>;
export interface ViewModel<T> {
  model: T;
  errors?: ValidationErrorsForView;
}

export class FormValidationException<T = any> extends Error {
  constructor(public readonly viewModel: ViewModel<T>) {
    super('validation error');
  }
}
