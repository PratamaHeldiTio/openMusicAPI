const autoBind = require('auto-bind');
const ClientError = require('../../exceptionError/ClientError');
const {
  succesResponse,
  failResponses,
  serverErrorResponse,
} = require('../../utils/responses');

class SongsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;
    autoBind(this);
  }

  async postSongHandler({ payload }, h) {
    try {
      this._validator.validateSongPayload(payload);
      const songId = await this._service.addSong(payload);

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

  async getSongsHandler(request, h) {
    const songs = await this._service.getSongs();
    return succesResponse(h, { data: { songs } });
  }

  async getSongByIdHandler(request, h) {
    try {
      const { songId } = request.params;
      const song = await this._service.getSongById(songId);

      return succesResponse(h, {
        data: { song },
      });
    } catch (error) {
      if (error instanceof ClientError) {
        return failResponses(h, error);
      }
    }

    return serverErrorResponse(h);
  }

  async putSongByIdHandler({ payload, params }, h) {
    try {
      this._validator.validateSongPayload(payload);
      const { songId } = params;

      await this._service.editSongById(songId, payload);

      return succesResponse(h, { message: 'lagu berhasil diperbarui' });
    } catch (error) {
      if (error instanceof ClientError) {
        return failResponses(h, error);
      }
    }

    return serverErrorResponse(h);
  }

  async deleteSongByIdHandler(request, h) {
    try {
      const { songId } = request.params;
      await this._service.deleteSongById(songId);

      return succesResponse(h, { message: 'lagu berhasil dihapus' });
    } catch (error) {
      if (error instanceof ClientError) {
        return failResponses(h, error);
      }
    }

    return serverErrorResponse(h);
  }
}

module.exports = SongsHandler;
