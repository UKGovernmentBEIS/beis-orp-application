import { BadRequestException } from '@nestjs/common';

const messageMap = {
  'Validation failed (expected type is /(pdf|vnd.oasis.opendocument.text|vnd.openxmlformats-officedocument.wordprocessingml.document)$/)':
    'The uploaded file must be a PDF, Microsoft Word or Open Office document',
};

export default (validationMessage: string) => {
  return new BadRequestException(
    messageMap[validationMessage] ?? validationMessage,
  );
};
