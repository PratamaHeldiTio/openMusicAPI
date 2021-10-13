const autoBind = require('auto-bind');
const ClientError = require('../../exceptionError/ClientError');
const {
  succesResponse,
  failResponses,
  serverErrorResponse,
} = require('../../utils/responses');

class PlaylistsHandler {
  constructor(playlistsService, songsService, validator) {
    this._playlistsService = playlistsService;
    this._songsService = songsService;
    this._validator = validator;
    autoBind(this);
  }

  async postPlaylistHandler(request, h) {
    try {
      const { id: credentialId } = request.auth.credentials;
      const { name } = request.payload;

      this._validator.validatePostPlaylistPayload({ name });
      const playlistId = await this._playlistsService.addPlaylist(name, credentialId);

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
      const playlists = await this._playlistsService.getPlaylists(credentialId);

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

      await this._playlistsService.verifyPlaylistOwner(playlistId, credentialId);
      await this._playlistsService.deletePlaylistById(playlistId);

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
      await this._playlistsService.verifyPlaylistAccess(playlistId, credentialId);
      await this._songsService.verifySongId(songId);
      await this._playlistsService.addSongToPlaylist(playlistId, songId);

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

      await this._playlistsService.verifyPlaylistAccess(playlistId, credentialId);
      const songs = await this._playlistsService.getSongOnPlaylist(playlistId);

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
      await this._playlistsService.verifyPlaylistAccess(playlistId, credentialId);
      await this._songsService.verifySongId(songId);
      await this._playlistsService.deleteSongOnPlaylist(playlistId, songId);

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
