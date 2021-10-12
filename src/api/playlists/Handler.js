const autoBind = require('auto-bind');
const ClientError = require('../../exceptionError/ClientError');
const {
  succesResponse,
  failResponses,
  serverErrorResponse,
} = require('../../utils/responses');

class PlaylistsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;
    autoBind(this);
  }

  async postPlaylistHandler(request, h) {
    try {
      this._validator.validatePostPayload(request.payload);
      const { id: credentialId } = request.auth.credentials;
      const playlistId = await this._service.addPlaylist(request.payload.name, credentialId);

      return succesResponse(h, {
        message: 'Playlist berhasil ditambahkan',
        data: { playlistId },
        statusCode: 201,
      });
    } catch (error) {
      if (error instanceof ClientError) {
        return failResponses(h, error);
      }
      return serverErrorResponse(h);
    }
  }
}

module.exports = PlaylistsHandler;
