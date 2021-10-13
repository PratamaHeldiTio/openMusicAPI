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
      const { id: credentialId } = request.auth.credentials;
      const { name } = request.payload;

      this._validator.validatePostPlaylistPayload({ name });
      const playlistId = await this._service.addPlaylist(name, credentialId);

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

  async deletePlaylistByIdHandler(request, h) {
    try {
      const { playlistId } = request.params;
      const { id: credentialId } = request.auth.credentials;

      await this._service.verifyPlaylistOwner(playlistId, credentialId);
      await this._service.deletePlaylistById(playlistId);

      return succesResponse(h, { message: 'Playlist berhasil dihapus' });
    } catch (error) {
      if (error instanceof ClientError) {
        return failResponses(h, error);
      }
      return serverErrorResponse(h);
    }
  }

  async postSongToPlaylistByIdHandler(request, h) {
    try {
      const { songId } = request.payload;
      const { id: credentialId } = request.auth.credentials;
      const { playlistId } = request.params;

      this._validator.validatePostSongToPlaylistPayload({ songId });
      await this._service.verifyPlaylistOwner(playlistId, credentialId);
      await this._service.verifySongId(songId);
      await this._service.addSongToPlaylist(playlistId, songId);

      return succesResponse(h, {
        message: 'Lagu berhasil ditambahkan ke playlist',
        statusCode: 201,
      });
    } catch (error) {
      if (error instanceof ClientError) {
        return failResponses(h, error);
      }
      return serverErrorResponse(h);
    }
  }

  async getSongOnPlaylistByIdHandler(request, h) {
    try {
      const { id: credentialId } = request.auth.credentials;
      const { playlistId } = request.params;

      await this._service.verifyPlaylistOwner(playlistId, credentialId);
      const songs = await this._service.getSongOnPlaylist(playlistId);

      return succesResponse(h, { data: { songs } });
    } catch (error) {
      if (error instanceof ClientError) {
        return failResponses(h, error);
      }
      return serverErrorResponse(h);
    }
  }

  async deleteSongOnPlaylistByIdHandler(request, h) {
    try {
      const { songId } = request.payload;
      const { id: credentialId } = request.auth.credentials;
      const { playlistId } = request.params;

      this._validator.validateDeleteSongOnPlaylistPayload({ songId });
      await this._service.verifyPlaylistOwner(playlistId, credentialId);
      await this._service.verifySongId(songId);
      await this._service.deleteSongOnPlaylist(playlistId, songId);

      return succesResponse(h, { message: 'Lagu berhasil dihapus dari playlist' });
    } catch (error) {
      if (error instanceof ClientError) {
        return failResponses(h, error);
      }
      return serverErrorResponse(h);
    }
  }
}

module.exports = PlaylistsHandler;
