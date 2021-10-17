const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptionError/InvariantError');

class CollaborationsService {
  constructor(cacheService) {
    this._pool = new Pool();
    this._cacheService = cacheService;
  }

  async addCollaboration({ playlistId, userId }) {
    const id = `collaboration-${nanoid(16)}`;
    const query = {
      text: 'INSERT INTO collaborations VALUES($1, $2, $3) RETURNING id',
      values: [id, userId, playlistId],
    };
    const result = await this._pool.query(query);

    await this._cacheService.delete(`playlist:${playlistId}`);
    return result.rows;
  }

  async deleteCollaboration({ playlistId, userId }) {
    const query = {
      text: 'DELETE FROM collaborations WHERE playlist_id = $1 AND user_id = $2',
      values: [playlistId, userId],
    };

    await this._cacheService.delete(`playlist:${playlistId}`);
    await this._pool.query(query);
  }

  async verifyCollaboration(playlistId, credentialId) {
    const query = {
      text: 'SELECT * FROM collaborations WHERE playlist_id = $1 AND user_id = $2',
      values: [playlistId, credentialId],
    };
    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError('Kolaborasi gagal diverifikasi');
    }
  }
}

module.exports = CollaborationsService;
