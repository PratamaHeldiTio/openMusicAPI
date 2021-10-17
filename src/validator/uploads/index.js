const InvariantError = require('../../exceptionError/InvariantError');
const { pictureHeadersSchema } = require('./schema');

const uploadsValidator = {
  validatePictureHeaders: (headers) => {
    const validationResult = pictureHeadersSchema.validate(headers);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = uploadsValidator;
