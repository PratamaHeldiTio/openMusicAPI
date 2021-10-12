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
      this._validator.validatePostPlaylistPayload(request.payload);
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

  async getPlaylistsHandler(request, h) {
    try {
      const { id: credentialId } = request.auth.credentials;
      const playlists = await this._service.getPlaylists(credentialId);

      return succesResponse(h, { data: { playlists } });
    } catch (error) {
      if (error instanceof ClientError) {
        return failResponses(h, error);
      }
      return serverErrorResponse(h);
    }
  }
}

module.exports = PlaylistsHandler;
