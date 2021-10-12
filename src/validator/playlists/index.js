const InvariantError = require('../../exceptionError/InvariantError');
const postPlaylistsPayloadSchema = require('./schema');

const playlistValidator = {
  validatePostPlaylistPayload: (payload) => {
    const validateResult = postPlaylistsPayloadSchema.validate(payload);

    if (validateResult.error) {
      throw new InvariantError(validateResult.error.message);
    }
  },
};

module.exports = playlistValidator;
