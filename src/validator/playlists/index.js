const InvariantError = require('../../exceptionError/InvariantError');
const {
  postPlaylistsPayloadSchema,
  postSongToPlaylistPayloadSchema,
  deleteSongOnPlaylistPayloadSchema,
} = require('./schema');

const playlistValidator = {
  validatePostPlaylistPayload: (payload) => {
    const validateResult = postPlaylistsPayloadSchema.validate(payload);

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

module.exports = playlistValidator;
