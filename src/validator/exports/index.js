const { exportPlaylistsPayloadSchema } = require('./schema');
const InvariantError = require('../../exceptionError/InvariantError');

const exportsValidator = {
  validateExportPlaylistPayload: (payload) => {
    const validateResult = exportPlaylistsPayloadSchema.validate(payload);

    if (validateResult.error) {
      throw new InvariantError(validateResult.error.message);
    }
  },
};

module.exports = exportsValidator;
