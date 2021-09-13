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

  async getSongsHandler(request, h) {
    const songs = await this._service.getSongs();
    return succesResponse(h, { data: { songs: [songs] } });
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

  async putSongByIdHandler(request, h) {
    try {
      this._validator.validateSongPayload(request.payload);
      const { songId } = request.params;
      const {
        title, year, performer, genre, duration,
      } = request.payload;

      await this._service.editSongById(songId, {
        title, year, performer, genre, duration,
      });

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

module.exports = OpenMusicHandler;
