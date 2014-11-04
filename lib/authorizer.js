var xport = require('node-xport')
  , restify = require('restify')
  , packageJson = require('../package.json')
  ;

var server = restify.createServer({
    name: packageJson.name,
    version: packageJson.version
});

server.use(restify.acceptParser(server.acceptable));
server.use(restify.queryParser());
server.use(restify.bodyParser());

server.get('/:name', function (request, response, next) {
    response.send(request.params);

    return next();
});

server.listen(8080, function() {

});