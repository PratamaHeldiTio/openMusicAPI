/* eslint-disable no-console */
require('dotenv').config();
const Hapi = require('@hapi/hapi');
const Jwt = require('@hapi/jwt');
const Inert = require('@hapi/inert');
const path = require('path');
const tokenManager = require('./token/tokenManager');
const ClientError = require('./exceptionError/ClientError');
const { failResponses, serverErrorResponse } = require('./utils/responses');

// songs
const songs = require('./api/songs');
const SongsService = require('./services/postgresSQL/SongsService');
const songsValidator = require('./validator/songs');

// users
const users = require('./api/users');
const UsersService = require('./services/postgresSQL/UsersService');
const usersValidator = require('./validator/users');

// authentications
const authentications = require('./api/authentications');
const AuthenticationsService = require('./services/postgresSQL/AuthenticationsService');
const authenticationsValidator = require('./validator/authentications');

// playlist
const playlists = require('./api/playlists');
const PlaylistsService = require('./services/postgresSQL/PlaylistsService');
const playlistsValidator = require('./validator/playlists');

// collaborations
const collaborations = require('./api/collaborations');
const CollaborationsService = require('./services/postgresSQL/CollaborationsService');
const collaborationsValidator = require('./validator/collaborations');

// exports
const _exports = require('./api/exports');
const exportsValidator = require('./validator/exports');
const producerService = require('./services/rabbitMQ/producerService');

// uploads
const uploads = require('./api/uploads');
const StorageService = require('./services/storage/StorageService');
const uploadsValidator = require('./validator/uploads');

// cache (redis)
const CacheService = require('./services/redis/CacheService');

const init = async () => {
  const cacheService = new CacheService();
  const songsService = new SongsService(cacheService);
  const usersService = new UsersService();
  const authenticationsService = new AuthenticationsService();
  const collaborationsService = new CollaborationsService(cacheService);
  const playlistsService = new PlaylistsService(collaborationsService, cacheService);
  const storageService = new StorageService(path.resolve(__dirname, 'api/uploads/file/pictures'));

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
    {
      plugin: Inert,
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
        id: artifact.decoded.payload.id,
      },
    }),
  });

  await server.register([
    {
      plugin: songs,
      options: {
        service: songsService,
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
    {
      plugin: playlists,
      options: {
        playlistsService,
        songsService,
        validator: playlistsValidator,
      },
    },
    {
      plugin: collaborations,
      options: {
        collaborationsService,
        playlistsService,
        validator: collaborationsValidator,
      },
    },
    {
      plugin: _exports,
      options: {
        producerService,
        playlistsService,
        validator: exportsValidator,
      },
    },
    {
      plugin: uploads,
      options: {
        service: storageService,
        validator: uploadsValidator,
      },
    },
  ]);

  // penanganan catch dari semua handler dialihkan kesini
  server.ext('onPreResponse', (request, h) => {
    const { response } = request;

    if (response instanceof ClientError) {
      return failResponses(h, response);
    }

    if (response instanceof Error && response.output.statusCode === 500) {
      console.error(response);
      return serverErrorResponse(h);
    }

    // lanjut ke handler masing2 jikda tidak ada client error atau server error 500
    return response.continue || response;
  });

  await server.start();
};

init();
