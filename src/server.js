require('dotenv').config();
const Hapi = require('@hapi/hapi');
const openMusic = require('./api');
const OpenMusicServices = require('./services/OpenMusicService');
const OpenMusicValidator = require('./validator');

const init = async () => {
  const openMusicServices = new OpenMusicServices();

  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  await server.register({
    plugin: openMusic,
    options: {
      service: openMusicServices,
      validator: OpenMusicValidator,
    },
  });

  await server.start();
};

init();
