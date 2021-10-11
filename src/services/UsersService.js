const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const InvariantError = require('../exceptionError/InvariantError');

class UsersService {
  constructor() {
    this._pool = new Pool();
  }

  async addUser({ username, fullname, password }) {
    await this.verifyNewUsername(username);
    const id = `user-${nanoid(16)}`;
    const query = {
      text: 'INSERT INTO users VALUES($1, $2, $3, $4) RETURNING id',
      values: [id, username, fullname, password],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError('User gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  async verifyNewUsername(username) {
    const query = {
      text: 'SELECT * FROM users where username = $1',
      values: [username],
    };

    const result = await this._pool.query(query);

    if (result.rowCount) {
      throw new InvariantError('Gagal menambahkan user, username sudah terdaftar');
    }
  }
}

module.exports = UsersService;
