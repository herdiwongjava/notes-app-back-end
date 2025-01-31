const Noteshandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'notes',
  version: '1.0.0',
  register: async (server, { service, validator }) => {
    const notesHandler = new Noteshandler(service, validator);
    server.route(routes(notesHandler));
  },
};
