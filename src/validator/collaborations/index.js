const {
  postCollaborationPayloadSchema,
  deleteCollaborationPayloadSchema,
} = require('./schema');
const InvariantError = require('../../exceptionError/InvariantError');

const collaborationsValidator = {
  validatePostCollaborationPayload: (payload) => {
    const validateResult = postCollaborationPayloadSchema.validate(payload);

    if (validateResult.error) {
      throw new InvariantError(validateResult.error.message);
    }
  },
  validateDeleteCollaborationPayload: (payload) => {
    const validateResult = deleteCollaborationPayloadSchema.validate(payload);

    if (validateResult.error) {
      throw new InvariantError(validateResult.error.message);
    }
  },
};

module.exports = collaborationsValidator;
