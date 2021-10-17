const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const NotFoundError = require('../../exceptionError/NotFoundError');
const InvariantError = require('../../exceptionError/InvariantError');
const mapDBtoModel = require('../../utils/mapDBToModel');

class SongsService {
  constructor(cacheService) {
    this._pool = new Pool();
    this._cacheService = cacheService;
  }

  async addSong(payload) {
    const id = `song-${nanoid(16)}`;
    const insertedAt = new Date().toISOString();
    const query = {
      text: 'INSERT INTO songs VALUES($1, $2, $3, $4, $5, $6, $7, $7) RETURNING id',
      values: [id, ...Object.values(payload), insertedAt],
    };
    const result = await this._pool.query(query);

    await this._cacheService.delete('songs');
    return result.rows[0].id;
  }

  async getSongs() {
    try {
      const result = await this._cacheService.get('songs');
      return JSON.parse(result);
    } catch (error) {
      const result = await this._pool.query('SELECT id, title, performer FROM songs');
      const mapedResult = result.rows.map(mapDBtoModel);

      await this._cacheService.set('songs', JSON.stringify(mapedResult));
      return mapedResult;
    }
  }

  async getSongById(id) {
    try {
      const result = await this._cacheService.get(`song:${id}`);
      return JSON.parse(result);
    } catch (error) {
      const query = {
        text: 'SELECT * FROM songs WHERE id = $1',
        values: [id],
      };
      const result = await this._pool.query(query);

      if (!result.rows[0]) {
        throw new NotFoundError('Music tidak dapat ditemukan');
      }

      const mapedResult = result.rows.map(mapDBtoModel)[0];

      await this._cacheService.set(`song:${id}`, JSON.stringify(mapedResult));
      return mapedResult;
    }
  }

  async editSongById(id, payload) {
    const updatedAt = new Date().toISOString();
    const query = {
      text: 'UPDATE songs SET title = $1, year = $2, performer = $3, genre = $4, duration = $5, updated_at = $6 WHERE id = $7 RETURNING id',
      values: [...Object.values(payload), updatedAt, id],
    };
    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Song gagal diperbaharui, Id tidak ditemukan');
    }

    await this._cacheService.delete(`song:${id}`);
  }

  async deleteSongById(id) {
    const query = {
      text: 'DELETE FROM songs WHERE id = $1 RETURNING id',
      values: [id],
    };
    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Song gagal dihapus.  Id tidak ditemukan');
    }

    await this._cacheService.delete(`song:${id}`);
  }

  async verifySongId(songId) {
    const query = {
      text: 'SELECT * FROM songs WHERE id = $1',
      values: [songId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError('Id lagu tidak valid');
    }
  }
}

module.exports = SongsService;
