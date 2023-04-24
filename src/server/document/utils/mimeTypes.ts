export const pdfMimeType = 'application/pdf';
export const wordMimeType =
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document';

export const displayableMimeTypes = [wordMimeType, pdfMimeType];

export const ooMimeType = 'application/vnd.oasis.opendocument.text';

export const acceptedMimeTypesRegex =
  /(pdf|vnd.oasis.opendocument.text|vnd.openxmlformats-officedocument.wordprocessingml.document)$/;
