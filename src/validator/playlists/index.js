const InvariantError = require('../../exceptionError/InvariantError');
const {
  postPlaylistPayloadSchema,
  postSongToPlaylistPayloadSchema,
  deleteSongOnPlaylistPayloadSchema,
} = require('./schema');

const playlistsValidator = {
  validatePostPlaylistPayload: (payload) => {
    const validateResult = postPlaylistPayloadSchema.validate(payload);

    if (validateResult.error) {
      throw new InvariantError(validateResult.error.message);
    }
  },
  validatePostSongToPlaylistPayload: (payload) => {
    const validateResult = postSongToPlaylistPayloadSchema.validate(payload);

    if (validateResult.error) {
      throw new InvariantError(validateResult.error.message);
    }
  },
  validateDeleteSongOnPlaylistPayload: (payload) => {
    const validateResult = deleteSongOnPlaylistPayloadSchema.validate(payload);

    if (validateResult.error) {
      throw new InvariantError(validateResult.error.message);
    }
  },
};

module.exports = playlistsValidator;
