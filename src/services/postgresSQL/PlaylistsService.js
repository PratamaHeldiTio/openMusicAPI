const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const NotFoundError = require('../../exceptionError/NotFoundError');
const AuthorizationError = require('../../exceptionError/AuthorizationError');

class PlaylistsService {
  constructor(collaborationsService, cacheService) {
    this._pool = new Pool();
    this._collaborationsService = collaborationsService;
    this._cacheService = cacheService;
  }

  async addPlaylist(name, owner) {
    const id = `playlist-${nanoid(16)}`;
    const query = {
      text: 'INSERT INTO playlists VALUES($1, $2, $3) RETURNING id',
      values: [id, name, owner],
    };
    const result = await this._pool.query(query);

    return result.rows[0].id;
  }

  async getPlaylists(owner) {
    const query = {
      text:
      `SELECT playlists.id, playlists.name, users.username FROM playlists
      INNER JOIN users ON users.id = playlists.owner
      LEFT JOIN collaborations ON collaborations.playlist_id = playlists.id
      WHERE playlists.owner = $1 OR collaborations.user_id = $1`,
      values: [owner],
    };
    const result = await this._pool.query(query);

    return result.rows;
  }

  async verifyPlaylistOwner(playlistId, owner) {
    const query = {
      text: 'SELECT owner FROM playlists WHERE id = $1',
      values: [playlistId],
    };
    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Playlist tidak ditemukan');
    }

    if (result.rows[0].owner !== owner) {
      throw new AuthorizationError('Anda tidak berhak mengakses resource ini');
    }
  }

  async deletePlaylistById(playlistId) {
    const query = {
      text: 'DELETE FROM playlists WHERE id = $1',
      values: [playlistId],
    };

    await this._pool.query(query);
  }

  async addSongToPlaylist(playlistId, songId) {
    const id = `playlistsong-${nanoid(16)}`;
    const query = {
      text: 'INSERT INTO playlistsongs VALUES($1, $2, $3) RETURNING id',
      values: [id, playlistId, songId],
    };

    await this._cacheService.delete(`playlist:${playlistId}`);
    await this._pool.query(query);
  }

  async getSongOnPlaylist(playlistId) {
    try {
      const result = await this._cacheService.get(`playlist:${playlistId}`);
      return JSON.parse(result);
    } catch (error) {
      const query = {
        text:
        `SELECT songs.id, songs.title, songs.performer FROM songs
        LEFT JOIN playlistsongs ON playlistsongs.song_id = songs.id
        WHERE playlistsongs.playlist_id = $1
        GROUP BY songs.id`,
        values: [playlistId],
      };
      const result = await this._pool.query(query);

      await this._cacheService.set(`playlist:${playlistId}`, JSON.stringify(result.rows));
      return result.rows;
    }
  }

  async deleteSongOnPlaylist(playlistId, songId) {
    const query = {
      text: 'DELETE FROM playlistsongs WHERE playlist_id = $1 and song_id = $2',
      values: [playlistId, songId],
    };

    await this._pool.query(query);
  }

  async verifyPlaylistAccess(playlistId, credentialId) {
    try {
      await this.verifyPlaylistOwner(playlistId, credentialId);
      await this._cacheService.delete(`playlist:${playlistId}`);
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }

      try {
        await this._collaborationsService.verifyCollaboration(playlistId, credentialId);
        await this._cacheService.delete(`playlist:${playlistId}`);
      } catch {
        throw error;
      }
    }
  }
}

module.exports = PlaylistsService;
