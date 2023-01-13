import { FileValidationException } from '../../form-validation';

type Messages = 'File is required' | 'Validation failed (expected type is pdf)';
const messageMap: Record<Messages, string> = {
  'File is required': 'Select a document',
  'Validation failed (expected type is pdf)': 'The selected file must be a pdf',
};

export default (validationMessage: Messages) => {
  return new FileValidationException(
    messageMap[validationMessage] ?? validationMessage,
    'pages/ingest/upload',
  );
};
