require('dotenv').config();
const Hapi = require('@hapi/hapi');
const Jwt = require('@hapi/jwt');
const tokenManager = require('./token/tokenManager');

// songs
const songs = require('./api/songs');
const SongsServices = require('./services/SongsService');
const songsValidator = require('./validator/songs');

// users
const users = require('./api/users');
const UsersService = require('./services/UsersService');
const usersValidator = require('./validator/users');

// authentications
const authentications = require('./api/authentications');
const AuthenticationsService = require('./services/AuthenticationsService');
const authenticationsValidator = require('./validator/authentications');

const init = async () => {
  const songsServices = new SongsServices();
  const usersService = new UsersService();
  const authenticationsService = new AuthenticationsService();

  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  await server.register([
    {
      plugin: Jwt,
    },
  ]);

  server.auth.strategy('openmusic_jwt', 'jwt', {
    keys: process.env.ACCESS_TOKEN_KEY,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: process.env.ACCESS_TOKEN_AGE,
    },
    validate: (artifact) => ({
      isValid: true,
      credentials: {
        id: artifact.decoded.paylaod.id,
      },
    }),
  });

  await server.register([
    {
      plugin: songs,
      options: {
        service: songsServices,
        validator: songsValidator,
      },
    },
    {
      plugin: users,
      options: {
        service: usersService,
        validator: usersValidator,
      },
    },
    {
      plugin: authentications,
      options: {
        authenticationsService,
        usersService,
        tokenManager,
        validator: authenticationsValidator,
      },
    },
  ]);

  await server.start();
};

init();
