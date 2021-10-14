const autoBind = require('auto-bind');
const { succesResponse } = require('../../utils/responses');

class SongsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;
    autoBind(this);
  }

  async postSongHandler({ payload }, h) {
    this._validator.validateSongPayload(payload);
    const songId = await this._service.addSong(payload);

    return succesResponse(h, {
      message: 'Lagu berhasil ditambahkan',
      data: { songId },
      statusCode: 201,
    });
  }

  async getSongsHandler(request, h) {
    const songs = await this._service.getSongs();
    return succesResponse(h, { data: { songs } });
  }

  async getSongByIdHandler(request, h) {
    const { songId } = request.params;
    const song = await this._service.getSongById(songId);

    return succesResponse(h, {
      data: { song },
    });
  }

  async putSongByIdHandler({ payload, params }, h) {
    this._validator.validateSongPayload(payload);
    const { songId } = params;

    await this._service.editSongById(songId, payload);

    return succesResponse(h, { message: 'lagu berhasil diperbarui' });
  }

  async deleteSongByIdHandler(request, h) {
    const { songId } = request.params;
    await this._service.deleteSongById(songId);

    return succesResponse(h, { message: 'lagu berhasil dihapus' });
  }
}

module.exports = SongsHandler;
