const autoBind = require('auto-bind');
const ClientError = require('../../exceptionError/ClientError');
const { succesResponse, failResponses, serverErrorResponse } = require('../../utils/responses');

class AuthenticationsHandler {
  constructor(authenticationsService, usersService, tokenManager, validator) {
    this._authenticationsService = authenticationsService;
    this._usersService = usersService;
    this._tokenManager = tokenManager;
    this._validator = validator;
    autoBind(this);
  }

  // payload: {username, password}
  async postAuthenticationHandler({ payload }, h) {
    try {
      this._validator.validatePostAuthenticationPayload(payload);
      const id = await this._usersService.verifyUserCredential(payload);
      const accessToken = this._tokenManager.generateAccessToken({ id });
      const refreshToken = this._tokenManager.generateRefreshToken({ id });
      await this._authenticationsService.addRefreshToken(refreshToken);

      return succesResponse(h, {
        message: 'Authentication berhasil ditambahkan',
        data: { accessToken, refreshToken },
        statusCode: 201,
      });
    } catch (error) {
      if (error instanceof ClientError) {
        return failResponses(h, error);
      }
      return serverErrorResponse(h);
    }
  }

  // payload {refreshToken}
  async putAuthenticationHandler({ payload }, h) {
    try {
      this._validator.validatePutAuthenticationPayload(payload);
      await this._authenticationsService.verifyRefreshToken(payload);
      const { id } = this._tokenManager.verifyRefreshToken(payload);
      const accessToken = this._tokenManager.generateAccessToken({ id });

      return succesResponse(h, {
        message: 'Authentication berhasil diperbaharui',
        data: { accessToken },
      });
    } catch (error) {
      if (error instanceof ClientError) {
        return failResponses(h, error);
      }
      return serverErrorResponse(h);
    }
  }
}

module.exports = AuthenticationsHandler;
