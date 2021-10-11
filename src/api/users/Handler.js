const autoBind = require('auto-bind');
const ClientError = require('../../exceptionError/ClientError');
const {
  succesResponse,
  failResponses,
  serverErrorResponse,
} = require('../../utils/responses');

class UsersHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;
    autoBind(this);
  }

  async postUserHandler({ payload }, h) {
    try {
      await this._validator.validateUserPayload(payload);
      const userId = await this._service.addUser(payload);

      return succesResponse(h, {
        message: 'User berhasil ditambahkan',
        data: { userId },
        statusCode: 201,
      });
    } catch (error) {
      if (error instanceof ClientError) {
        return failResponses(h, error);
      }

      console.error(error);
      return serverErrorResponse(h);
    }
  }
}

module.exports = UsersHandler;
