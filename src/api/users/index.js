const UsersHandler = require('./Handler');
const routes = require('./routes');

module.exports = {
  name: 'users',
  version: '1.0.0',
  register: (server, { service, validator }) => {
    const userHandler = new UsersHandler(service, validator);
    server.route(routes(userHandler));
  },
};
