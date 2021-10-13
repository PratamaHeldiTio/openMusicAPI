const PlaylistsHandler = require('./Handler');
const routes = require('./routes');

module.exports = {
  name: 'playlist',
  version: '1.0.0',
  register: (server, { playlistsService, songsService, validator }) => {
    const playlistsHandler = new PlaylistsHandler(playlistsService, songsService, validator);
    server.route(routes(playlistsHandler));
  },
};
