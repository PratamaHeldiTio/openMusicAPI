require('dotenv').config();
const Hapi = require('@hapi/hapi');
const openMusic = require('./api/songs');
const SongsServices = require('./services/SongsService');
const songsValidator = require('./validator/songs');

// users
const users = require('./api/users');
const UsersService = require('./services/UsersService');
const usersValidator = require('./validator/users');

const init = async () => {
  const songsServices = new SongsServices();
  const usersService = new UsersService();

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
      plugin: openMusic,
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
  ]);

  await server.start();
};

init();
