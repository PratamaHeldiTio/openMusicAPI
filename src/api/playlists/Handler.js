const autoBind = require('auto-bind');
const { succesResponse } = require('../../utils/responses');

class PlaylistsHandler {
  constructor(playlistsService, songsService, validator) {
    this._playlistsService = playlistsService;
    this._songsService = songsService;
    this._validator = validator;
    autoBind(this);
  }

  async postPlaylistHandler({ payload, auth }, h) {
    const { id: credentialId } = auth.credentials;
    const { name } = payload;

    this._validator.validatePostPlaylistPayload({ name });
    const playlistId = await this._playlistsService.addPlaylist(name, credentialId);

    return succesResponse(h, {
      message: 'Playlist berhasil ditambahkan',
      data: { playlistId },
      statusCode: 201,
    });
  }

  async getPlaylistsHandler({ auth }, h) {
    const { id: credentialId } = auth.credentials;
    const playlists = await this._playlistsService.getPlaylists(credentialId);

    return succesResponse(h, { data: { playlists } });
  }

  async deletePlaylistByIdHandler({ auth, params }, h) {
    const { playlistId } = params;
    const { id: credentialId } = auth.credentials;

    await this._playlistsService.verifyPlaylistOwner(playlistId, credentialId);
    await this._playlistsService.deletePlaylistById(playlistId);

    return succesResponse(h, { message: 'Playlist berhasil dihapus' });
  }

  async postSongToPlaylistByIdHandler({ payload, auth, params }, h) {
    const { songId } = payload;
    const { id: credentialId } = auth.credentials;
    const { playlistId } = params;

    this._validator.validatePostSongToPlaylistPayload({ songId });
    await this._playlistsService.verifyPlaylistAccess(playlistId, credentialId);
    await this._songsService.verifySongId(songId);
    await this._playlistsService.addSongToPlaylist(playlistId, songId);

    return succesResponse(h, {
      message: 'Lagu berhasil ditambahkan ke playlist',
      statusCode: 201,
    });
  }

  async getSongOnPlaylistByIdHandler({ auth, params }, h) {
    const { id: credentialId } = auth.credentials;
    const { playlistId } = params;

    await this._playlistsService.verifyPlaylistAccess(playlistId, credentialId);
    const songs = await this._playlistsService.getSongOnPlaylist(playlistId);

    return succesResponse(h, { data: { songs } });
  }

  async deleteSongOnPlaylistByIdHandler({ payload, auth, params }, h) {
    const { songId } = payload;
    const { id: credentialId } = auth.credentials;
    const { playlistId } = params;

    this._validator.validateDeleteSongOnPlaylistPayload({ songId });
    await this._playlistsService.verifyPlaylistAccess(playlistId, credentialId);
    await this._songsService.verifySongId(songId);
    await this._playlistsService.deleteSongOnPlaylist(playlistId, songId);

    return succesResponse(h, { message: 'Lagu berhasil dihapus dari playlist' });
  }
}

module.exports = PlaylistsHandler;
