const autoBind = require('auto-bind');
const ClientError = require('../exceptionError/ClientError');
const { succesResponse, failResponses, serverErrorResponse } = require('../utils/responses');

class OpenMusicHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;
    autoBind(this);
  }

  async postSongHandler(request, h) {
    try {
      this._validator.validateSongPayload(request.payload);
      const {
        title, year, performer, genre, duration,
      } = request.payload;
      const songId = await this._service.addSong({
        title, year, performer, genre, duration,
      });

      return succesResponse(h, {
        message: 'Lagu berhasil ditambahkan',
        data: { songId },
        statusCode: 201,
      });
    } catch (error) {
      if (error instanceof ClientError) {
        return failResponses(h, error);
      }
    }
    return serverErrorResponse(h);
  }
}

module.exports = OpenMusicHandler;
