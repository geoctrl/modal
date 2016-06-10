var path = require('path');

function getResource(p) {
  return require('./resources/' + p);
}

require('bogus-api').create({
  resourceDir: path.resolve(__dirname, './resources'),
  resourceUriPrefix: '/rest',

  priorityRoutes: function(server) {

    // ----- TEST
    server.get('/rest/test', function(req, res) {
      res.status(200).json(getResource('test'));
    });

  }
}).start();
