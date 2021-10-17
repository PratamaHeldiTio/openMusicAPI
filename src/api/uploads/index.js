const UploadsHandler = require('./Handler');
const routes = require('./routes');

module.exports = {
  name: 'uploads',
  version: '1.0.0',
  register: (server, { service, validator }) => {
    const uploadsHandler = new UploadsHandler(service, validator);
    server.route(routes(uploadsHandler));
  },
};
