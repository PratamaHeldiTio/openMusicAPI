const ExportsHandler = require('./Handler');
const routes = require('./routes');

module.exports = {
  name: 'exports',
  version: '1.0.0',
  register: (server, { producerService, playlistsService, validator }) => {
    const exportsHandler = new ExportsHandler(producerService, playlistsService, validator);
    server.route(routes(exportsHandler));
  },
};
