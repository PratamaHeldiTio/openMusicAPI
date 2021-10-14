const autoBind = require('auto-bind');
const { succesResponse } = require('../../utils/responses');

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
  }

  // payload {refreshToken}
  async putAuthenticationHandler({ payload }, h) {
    const { refreshToken } = payload;
    this._validator.validatePutAuthenticationPayload(payload);
    await this._authenticationsService.verifyRefreshToken(refreshToken);
    const { id } = this._tokenManager.verifyRefreshToken(refreshToken);
    const accessToken = this._tokenManager.generateAccessToken({ id });

    return succesResponse(h, {
      message: 'Authentication berhasil diperbaharui',
      data: { accessToken },
    });
  }

  async deleteAuthenticationHandler({ payload }, h) {
    const { refreshToken } = payload;
    this._validator.validateDeleteAuthenticationPayload(payload);
    await this._authenticationsService.verifyRefreshToken(refreshToken);
    await this._authenticationsService.deleteRefreshToken(refreshToken);

    return succesResponse(h, { message: 'Refresh token berhasil dihapus' });
  }
}

module.exports = AuthenticationsHandler;
