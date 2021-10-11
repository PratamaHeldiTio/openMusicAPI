const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const InvariantError = require('../exceptionError/InvariantError');
const AuthenticationError = require('../exceptionError/AuthenticationError');

class UsersService {
  constructor() {
    this._pool = new Pool();
  }

  async addUser({ username, fullname, password }) {
    await this.verifyNewUsername(username);
    const id = `user-${nanoid(16)}`;
    const hashPassword = await bcrypt.hash(password, 10);
    const query = {
      text: 'INSERT INTO users VALUES($1, $2, $3, $4) RETURNING id',
      values: [id, username, fullname, hashPassword],
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

  async verifyUserCredential({ username, password }) {
    const query = {
      text: 'SELECT id, password FROM users WHERE username = $1',
      values: [username],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new AuthenticationError('Username yang anda diberikan salah');
    }

    const { id, password: hashPassword } = result.rows[0];
    const match = await bcrypt.compare(password, hashPassword);

    if (!match) {
      throw new AuthenticationError('Password yang anda diberikan salah');
    }

    return id;
  }
}

module.exports = UsersService;
