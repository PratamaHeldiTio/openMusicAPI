const autoBind = require('auto-bind');
const { succesResponse } = require('../../utils/responses');

class UsersHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;
    autoBind(this);
  }

  async postUserHandler({ payload }, h) {
    await this._validator.validateUserPayload(payload);
    const userId = await this._service.addUser(payload);

    return succesResponse(h, {
      message: 'User berhasil ditambahkan',
      data: { userId },
      statusCode: 201,
    });
  }
}

module.exports = UsersHandler;
