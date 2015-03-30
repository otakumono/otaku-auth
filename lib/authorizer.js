var xport = require('node-xport')
  , restify = require('restify')
  , packageJson = require('../package.json')
  , Config = require('./config')
  , Database = require('./authorizer/database')
  ;

var config = Config('otaku.authorizer.json');
config.parse();
config.save();

var database = Database(config);
database.connect();

var server = restify.createServer({
    name: packageJson.name,
    version: packageJson.version
});

server.use(restify.acceptParser(server.acceptable));
server.use(restify.queryParser());
server.use(restify.bodyParser());

server.get('/user/:username', function (request, response, next) {
    database.findUser(request.params.username, function(error, result) {
        if (error) {
            console.log("error");
            next(error);
        }
        console.log("stuff");

        response.type('application/json');
        response.send(result);

        //return next();
    });
    console.log("test");
});

server.listen(config.get('server:port'), config.get('server:host'), function() {
    var address = server.address();
    console.log('Listening on %s:%s.', address.address, config.get('server:port'));
});