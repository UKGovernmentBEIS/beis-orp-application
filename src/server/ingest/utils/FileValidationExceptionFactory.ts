import { FileValidationException } from '../../form-validation';

type Messages =
  | 'File is required'
  | 'Validation failed (expected type is /(pdf|vnd.oasis.opendocument.text|vnd.openxmlformats-officedocument.wordprocessingml.document)$/)';
const messageMap: Record<Messages, string> = {
  'File is required': 'Select a document',
  'Validation failed (expected type is /(pdf|vnd.oasis.opendocument.text|vnd.openxmlformats-officedocument.wordprocessingml.document)$/)':
    'The selected file must be a PDF, Microsoft Word or Open Office document',
};

export default (validationMessage: Messages) => {
  return new FileValidationException(
    messageMap[validationMessage] ?? validationMessage,
    'pages/ingest/upload',
  );
};
