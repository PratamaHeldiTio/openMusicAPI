const InvariantError = require('../../exceptionError/InvariantError');
const { songPayloadSchema } = require('./schema');

const songsValidator = {
  validateSongPayload: (payload) => {
    const validationResult = songPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = songsValidator;
