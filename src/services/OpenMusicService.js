const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const InvariantError = require('../exceptionError/InvariantError');
const mapDBtoModel = require('../utils/mapDBToModel');

class OpenMusicServices {
  constructor() {
    this._pool = new Pool();
  }

  async addSong({
    title, year, performer, genre, duration,
  }) {
    const id = nanoid(16);
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;
    const query = {
      text: 'INSERT INTO openmusic VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id',
      values: [id, title, year, performer, genre, duration, insertedAt, updatedAt],
    };
    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Music gagal ditambahkan');
    }
    return result.rows[0].id;
  }

  async getSongs() {
    const result = await this._pool.query('SELECT * FROM openmusic');
    return result.rows.map(mapDBtoModel);
  }
}

module.exports = OpenMusicServices;
