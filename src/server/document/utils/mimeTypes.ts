export const pdfMimeType = 'application/pdf';
export const wordMimeTypes = [
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/msword',
];

export const displayableMimeTypes = [...wordMimeTypes, pdfMimeType];

export const ooMimeType = 'application/vnd.oasis.opendocument.text';

export const acceptedMimeTypesRegex =
  /(pdf|msword|vnd.oasis.opendocument.text|vnd.openxmlformats-officedocument.wordprocessingml.document)$/;
