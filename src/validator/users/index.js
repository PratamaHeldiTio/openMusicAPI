const userPayloadSchema = require('./schema');
const InvariantError = require('../../exceptionError/InvariantError');

const usersValidator = {
  validateUserPayload: (payload) => {
    const valdiationResult = userPayloadSchema.validate(payload);

    if (valdiationResult.error) {
      throw new InvariantError(valdiationResult.error.message);
    }
  },
};

module.exports = usersValidator;
